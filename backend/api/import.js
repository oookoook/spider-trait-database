const conv = require('../util/converter');
const XLSX = require('xlsx');
const fcsv = require('fast-csv');
const jm = require('../util/job-manager');
const { snakeCase, camelCase } = require('change-case');


var db = null;


const columns = [
  `wsc_lsid`,
  `original_name`,
  `trait_abbrev`,
  `trait_name`,
  `trait_description`,
  `value`,
  `measure`,
  `sex`,
  `life_stage`,
  `frequency`,
  `sample_size`,
  `event_date`,
  `row_link`,
  `method_abbrev`,
  `method_name`,
  `method_description`,
  `reference`,
  `reference_abbrev`,
  `reference_doi`,
  `location_abbrev`,
  `location_lat`,
  `location_lon`,
  `location_precision`,
  `location_altitude`,
  `location_locality`,
  `location_country_code`,
  `location_habitat_global`,
  `location_habitat`,
  `location_microhabitat`,
  `location_stratum`,
  `location_note`
];

const join = 'import LEFT JOIN trait ON import.trait_id = trait.id '
            + 'LEFT JOIN taxonomy ON import.taxonomy_id = taxonomy.id'
            + 'LEFT JOIN sex ON import.sex_id = sex.id '
            + 'LEFT JOIN life_stage ON import.life_stage_id = life_stage.id '
            + 'LEFT JOIN measure ON import.measure_id = measure.id '
            + 'LEFT JOIN method ON import.method_id = method.id '       
            + 'LEFT JOIN reference ON import.reference_id = reference.id'
            + 'LEFT JOIN location ON import.location_id = location.id'
            + 'LEFT JOIN dataset ON import.dataset_id';

const joind = 'import LEFT JOIN dataset ON import.dataset_id';

const joinv = 'import LEFT JOIN trait ON import.trait_abbrev = trait.abbrev LEFT JOIN data_type ON trait.data_type_id = data_type.id'
            + 'LEFT JOIN taxonomy ON import.wsc_lsid = taxonomy.wsc_lsid '
            + 'LEFT JOIN taxonomy_names ON import.original_name = taxonomy_names.name'
            + 'LEFT JOIN sex ON import.sex = sex.name '
            + 'LEFT JOIN life_stage ON import.life_stage = life_stage.name '
            + 'LEFT JOIN measure ON import.measure = measure.name '
            + 'LEFT JOIN method ON import.method_abbrev = method.abbrev '
            + 'LEFT JOIN country ON import.location_country_code = country.alpha3_code '
            + 'LEFT JOIN habitat_global ON import.location_habitat_global = habitat_global.name '
            + 'LEFT JOIN reference ON import.reference_doi = reference.doi OR import.reference = reference.fullCitation'
            + 'LEFT JOIN location ON import.location_abbrev = location.abbrev'
            + 'LEFT JOIN dataset ON import.dataset_id';

const getAuthWhere = function(auth) {
    var c = '';
    if(!auth.isEditor) {
        c+= `dataset.sub = ${db.escape(auth.sub)} AND `;
    }
    c+='dataset.imported < 2';
    return c;
}

const getObject = function(r) {
    // convert to camelCase from snake case
    // serialize timestamps
    return {
        taxonomy: {
            wscLsid: r[`wsc_lsid`],
            originalName: r[`original_name`],
            id: r[`taxonomy_id`]
        },
        trait: {
            abbrev: r[`trait_abbrev`],
            name: r[`trait_name`],
            description: r[`trait_description`],
            id: r[`trait_id`]
        },
        value: {
            raw: r[`value`],
            numeric: r[`value_numeric`],
        },
        measure: {
            raw: r[`measure`],
            id: r[`measure_id`]
        },
        sex: {
            raw: r[`sex`],
            id: r[`sex_id`]
        },
        lifeStage: {
            raw: r[`life_stage`],
            id: r[`life_stage_id`]
        },
        frequency: {
            raw: r[`frequency`],
            numeric: r[`frequency_numeric`]
        },
        sampleSize: {
            raw: r[`sample_size`],
            numeric: r[`sample_size_numeric`]
        },
        eventDate: {
            raw: r[`event_date`],
            start: r[`event_date_start`].toJSON(),
            end: r[`event_date_end`].toJSON()
        },
        rowLink: r[`row_link`],
        method: {
            abbrev: r[`method_abbrev`],
            name: r[`method_name`],
            description: r[`method_description`],
            id: r[`method_id`]
        },
        reference: {
            raw: r[`reference`],
            abbrev: r[`reference_abbrev`],
            doi: r[`reference_doi`],
            id: r[`reference_id`]
        },
        location: {
            abbrev: r[`location_abbrev`],
            lat: {
                raw: r[`location_lat`],
                conv: r[`location_lat_conv`],
            },
            lon: {
                raw: r[`location_lon`],
                conv: r[`location_lon_conv`],
            },
            precision: r[`location_precision`],
            altitude: r[`location_altitude`],
            locality: r[`location_locality`],
            countryCode: {
                raw: r[`location_country_code`],
                id: r[`location_country_id`]
            },
            habitatGlobal: {
                raw: r[`location_habitat_global`],
                id: r[`location_habitat_global_id`]
            },
            habitat: r[`location_habitat`],
            microhabitat: r[`location_microhabitat`],
            stratum: r[`location_stratum`],
            note: r[`location_note`],
            id: r[`location_id`]
        },
        valid: {
            review: r[`valid_review`],
            approve: r[`valid`]
        }
    }
}

const list = async function(params, limits, auth) {
    var id = parseInt(params.id);
    var aw = getAuthWhere(auth);
    var res = await db.prepareListResponse(limits, 'import', aw, [], joind);
        
    var results = await db.query({table: 'import', sql:`SELECT import.* `
    + `FROM ${joind} WHERE dataset_id = ? AND ${aw}`, values: [id], nestTables: false, limits, hasWhere: true });
   
    res.items = results.map(r => getObject(r)); 
    return res;
}

const changeState = async function(params, body, auth) {
    var id = parseInt(params.id);
    
    var aw = getAuthWhere(auth);

    // used for sending the dataset to approval and for approving the dataset. If the dataset is approved,
    // all the records are transferred from the import table to the data table - that's why this is not handled by the datasets endpoint 

    var state = body.state;
    var msg = body.message;

    // contributor can only change state to reviewed
    if(!auth.isEditor && state != 'reviewed') {
        throw 'cannot change the state to this value';
    }

    if(state == 'approved') {
        // check if the dataset is valid    
        var valid = false;
        var validR = await db.query({table: 'import', sql: `SELECT COUNT(import.valid) as invalid FROM `
        + `${joind} WHERE dataset.id = ? AND ${aw} AND valid=0`, values: [id]});
        valid = validR[0].invalid == 0;
        if(!valid) {
            throw 'Cannot approve the dataset - the dataset is not valid.';
        }

        
    }

    var imp;
    switch(state) {
        case 'created': imp = 0; break;
        case 'rejected': imp = 1; break;
        case 'reviewed': imp = 2; break;
        case 'approved': imp = 3; break; 
    }

    if(imp < 2) {
        await db.query({table: 'dataset', sql: `UPDATE dataset SET imported = ?, message = ? WHERE id = ? AND ${getAuthWhere(auth)}`, values: [imp, msg, id] });
        return {
            id
        };
    }

    // Transfering the data
    // USE job manager


    var state = { total: 6, progress: 0, errors: [], completed: false }
    var jobId = jm.createJob(auth.sub, state, transferToData, { id, aw });
    return {
        jobId,
        state
    };
}

const transferToData = async function(params) {
    var { id, aw, state } = params;

    c = await db.getConnection();
    
    state.progress+=1;

    /* Uniquify the rowlinks */
    
    var tlr = await db.cquery(c, {table : 'data', sql: 'SELECT DISTINCT row_link FROM data ORDER BY row_link DESC LIMIT 0,1'});
    var lastRowLink = 0;
    if (tlr && tlr[0] && tlr[0].rowLink) {
        lastRowLink = tlr[0].rowLink;
    }

    state.progress+=1;

    /* this would cause rowlink number collisions
    var importedRowLinks = await db.cquery(c, {table : 'import', sql: 'SELECT DISTINCT row_link FROM import'});
    for(var i = 0; i < importedRowLinks.length; i++) {
        var oldRowLink = importedRowLinks[i]['row_link'];
        await db.cquery(c, {table : 'import', sql: `UPDATE import SET row_link = ? WHERE dataset_id = ? AND row_link = ? AND ${aw}`, values: [++lastRowLink, id, oldRowLink] });
    }
    */

   //https://blog.sqlauthority.com/2014/03/08/mysql-generating-row-number-for-each-row-using-variable/

   await db.cquery(c, {table : 'import', sql: `UPDATE ${joind} `
   +` LEFT JOIN (SELECT DISTINCT @row_number:=@row_number+1 AS rlnum,row_link FROM import,
    (SELECT @row_number:=0) AS t) rl ON import.row_link = rl.row_link SET import.row_link = ? + rl.rlnum WHERE import.row_link IS NOT NULL AND dataset_id = ? AND ${aw}`, values: [lastRowLink]});

    state.progress+=1;

    // INSERT INTO data (...) SELECT ... FROM import WHERE dataset_id = ?
    await db.cquery(c, {table: 'data', sql:`INSERT INTO data`
    + ` (taxonomy_id, original_name, trait_id, value, value_numeric, measure_id, sex_id, life_stage_id, frequency, `
    + ` sample_size, event_date_text, event_date_start, event_date_end, method_id, location_id, reference_id, dataset_id, row_link) `
    + ` SELECT taxonomy_id, original_name, trait_id, value, value_numeric, measure_id, sex_id, life_stage_id, frequency_numeric, `
    + ` sample_size_numeric, event_date, event_date_start, event_date_end, method_id, location_id, reference_id, dataset_id, CONVERT(row_link, UNSIGNED) `
    + ` FROM import WHERE dataset_id = ? AND ${aw}`, values: [ds] });
    
    state.progress+=1;
    // DELETE FROM import WHERE dataset_id = ?
    await db.cquery(c, {table: 'import', sql:`DELETE import FROM ${joind} WHERE dataset_id = ? AND ${aw}`, values: [id] });
    
    state.progress+=1;

    await db.cquery(c, {table: 'dataset', sql: `UPDATE dataset SET imported = 2, message = null WHERE id = ? AND ${aw}`, values: [id] });
    state.progress+=1;
    db.releaseConnection(c);
    
    state.completed = true;
}

const convertToCSV = async function(f) {
    var wb = XLSX.readFile(f);
    /* generate array of arrays */
    var sheetName = wb.SheetNames[0];
    if(wb.SheetNames.includes('Data')) {
        sheetName = 'Data';
    }
    var nf = `${f}.csv`;
    //data = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName], {header:1});
    // wait for the file to convert
    await new Promise(
        function(resolve, reject) {
            var stream = XLSX.stream.to_csv(wb.Sheets[sheetName], {header:1});
            stream.pipe(fs.createWriteStream(nf));
            stream.on('error', (err) => {
                reject(err);
            });
            stream.on('end', () => {
                resolve();
            });
        });
    return nf;
}

const importRow = async function(conn, ds, r, state, cache) {
    var row = {};
    // copy the values and convert to snake case
    Object.keys(r).forEach(k => {
        var c = snakeCase(k);
        if(columns.includes(c)) {
            row[c] = r[k];
        }
    });

    // caches the parsed values
    const gfc = (field, func) => {
        var v = row[field];
        if(!v) {
            return null;
        }
        if(cache[`${f}|${v}`]) {
            return cache[`${f}|${v}`];
        } else {
            var nv = func(v);
            cache[`${f}|${v}`] = nv;
            return nv;
        }
    }

    // convert numeric values
    // do not cache numeric values - they will probably be unique
    /*
    row['value_numeric'] = gfc('value', conv.parseNumber); 
    row['frequency_numeric'] = gfc('frequency', conv.parseNumber); 
    row['sample_size_numeric'] = gfc('sample_size', conv.parseNumber); 
    */
   row['value_numeric'] = conv.parseNumber(row['value']); 
   row['frequency_numeric'] = conv.parseNumber(row['frequency']); 
   row['sample_size_numeric'] =conv.parseNumber(row['sample_size']);

    // convert timestamps (start, end)
    if(row['event_date']) {
        var { s, e } = gfc('event_date',conv.parseEvent);
        row['event_date_start'] = s;
        row['event_date_end'] = e;
    }

    // convert lat, lon
    row['location_lat_conv'] = gfc('location_lat', conv.parseCoord);

    row['location_lon_conv'] = gfc('location_lon', conv.parseCoord);

    row['dataset_id'] = ds;
    row['changed'] = 1;
    row['valid_review'] = 0;
    row['valid'] = 0;

    try { 
        await db.cquery(conn, {table: 'import', sql: 'INSERT INTO import SET ?', values: [row]});
    } catch (err) {
        state.errors.push(err);
    }
    state.progress += 1;
    if(state.progress + state.errors.length == state.total) {
        return true;
    }
    return false;
}

const uploadFile = async function(params, body, files, auth) {
    // uploads a file to already existing dataset
    // returns only a jobId that can be used to track the progress
    // in the background transfers rows from the file to the import table
    var ds = parseInt(params.id);

    var dscheck = await db.query({table: 'dataset', sql: `SELECT id FROM dataset WHERE id=? AND ${getAuthWhere(auth)}`, values: [ds]});
    if(!dscheck || dscheck.length == 0 || dscheck[0].id != ds) {
        throw 'Cannot upload to the given dataset';
    }

    var f = files.dataset;
    if(f.truncated) {
        throw 'File size is too large';
    }
    var fpath = f.tempFilePath;
    if(f.mimetype == 'application/vnd.ms-excel') {
        fpath = await convertToCSV(f);
    } else if(f.mimetype != 'text/csv') {
        throw 'Unknown file format';
    }
    var total = 0;
    // firts passthrough - just get the number of lines
    fcsv.parseFile(fpath)
    .on('end', rowCount => { total = rowCount });

    var ifunc = async (params) => {
        // this promise will resolve when the last row is inserted into the db
        // the data events are fired asynchronously (they are not waiting for processing the previous row) and the queries are queued by the mysql client
        // releaseConnection is also queued and can be basically ignored in the flow 
        await new Promise((resolve, reject) => {
        var conn = db.getConnection();
        var valCache = {};
        fcsv.parseFile(fpath)
        .on('error', error => { params.state.errors.push[error]; params.state.aborted = true; resolve(); })
        .on('data', async row => {  
            // we are waiting here, but another data event was already fired - the events are not waiting for each other
            var last = await importRow(conn, params.ds, row, cache);
            // the import row func detected that it's the last one to execute
            if(last) {
                // resolving the promise and continuing to validation
                resolve();
            }
        })
        .on('end', rowCount => { db.releaseConnection(conn) });
        });
        // now all the records are saved in the db or the import was aborted due to the error
        if(params.state.aborted) {
            return;
        }
        
        await validate({ds, aw: getAuthWhere(auth), state: params.state});
        params.state.progress += 1;
        params.state.completed = true;
    };

    // +1 to the total is the validation step
    var jobId = jm.createJob(auth.sub, total + 3, ifunc, { ds });
    return {
        job: jm.getJob(jobId)    
    };
}

const deleteRecords = async function(params, auth) {
    var id = parseInt(params.id);
    //https://www.mysqltutorial.org/mysql-delete-join/
    var r = await d.query({table, sql: `DELETE import FROM ${joind} WHERE dataset_id=? AND ${getAuthWhere(auth)}`, values: [id] });
    return {
        id
    }
}

const getColumnName = function(val) {
    if(val == 'taxonomy.wscLsid') {
        return `wsc_lsid`;
    }
    if(val == 'taxonomy.originalName') {
        return `original_name`;
    }
    return snakeCase(i.replace('.raw','').replace('.', '_'));
}

const getRow = async function(params, auth) {
    var ds = parseInt(params.id);
    var row = parseInt(param.row);
    var aw = getAuthWhere(auth);
    // the dataset id is not really needed - the row IDs are autoincremented
    var results = await db.query({table: 'import', sql:`SELECT import.* FROM ${joind} WHERE dataset_id = ? AND id= ? AND ${aw}`, values: [ds, row], nestTables: true });
     var r = results[0];
     // todo return correctly formatted row
     return { 
         item: getObject(r)
    }
}

const updateRow = async function(params, body, auth) {
    var ds = parseInt(params.id);
    var row = parseInt(param.row);
    var aw = getAuthWhere(auth);
    var newAttrs = {};
    // convert to snake case
    Object.keys(body).forEach(i => {
        newAttrs[getColumnName(i)] = body[i];
    });
    delete(newAttrs.id);
    delete(newAttrs['dataset_id']);
    delete(newAttrs['valid']);
    delete(newAttrs['valid_review']);
    newAttrs.changed = 1;

    if(newAttrs['location_lat']) {
        newAttrs['location_lat_conv'] = conv.parseCoord(newAttrs['location_lat']);
    }
    if(newAttrs['location_lon']) {
        newAttrs['location_lon_conv'] = conv.parseCoord(newAttrs['location_lon']);
    }


    // convert numeric values
    if(newAttrs['value']) {
        newAttrs['value_numeric'] = conv.parseNumber(newAttrs['value']);
    }
    if(newAttrs['frequency']) {
        newAttrs['frequency_numeric'] = conv.parseNumber(newAttrs['frequency']);
    }
    if(newAttrs['sample_size']) {
        newAttrs['sample_size'] = conv.parseNumber(newAttrs['sample_size']);
    }
    
    // convert timestamps (start, end)
    if(newAttrs['event_date']) {
        var { s, e } = conv.parseEvent(newAttrs['event_date']);
        newAttrs['event_date_start'] = s;
        newAttrs['event_date_end'] = e;
    }

    // the dataset id is not really needed - the row IDs are autoincremented
    await db.query({table: 'import', sql:`UPDATE ${joind} SET ? WHERE dataset_id = ? AND id=? AND ${aw}`, values: [newAttrs, ds, row] });
    validate({ds, aw});
    return { 
        id
    }
}


const deleteRow = async function(params, auth) {
    var ds = parseInt(params.id);
    var row = parseInt(param.row);
    var aw = getAuthWhere(auth);
    // the dataset id is not really needed - the row IDs are autoincremented globally
    var results = await db.query({table: 'import', sql:`DELETE import FROM ${joind} WHERE dataset_id = ? AND id=? AND ${aw}`, values: [ds, row] });
     //var r = results[0];
     return {
        dataset: ds, 
        row 
    }
}

const updateColumn = async function(params, body, auth) {
    var ds = parseInt(params.id);
    var aw = getAuthWhere(auth);
    var column = getColumnName(params.column);
    if(column == 'dataset_id' || column == 'valid' || column == 'valid_review' || column == 'changed') {
        throw 'Cannot update this column';
    }
    
    // allow to change value in one column based on the value in another
    var vc = getColumnName(body.valueColumn);

    var ov = body.oldValue;
    var nv = body.newValue;

    if(column == 'location_lat' || column == 'location_lon') {
        var convVal = conv.parseCoord(newValue);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET ${db.escapeId(column + '_conv')} = ? WHERE dataset_id = ? AND ?? = ? AND ${aw}`, values: [convVal, ds, vc || column, ov] });
    }

    // convert numeric values
    if(column == 'value') {
        var numVal = conv.parseNumber(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET value_numeric = ? WHERE dataset_id = ? AND ?? = ? AND ${aw}`, values: [numVal, ds, vc || column, ov] });
    }
    if(column == 'frequency') {
        var numVal = conv.parseNumber(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET frequency_numeric = ? WHERE dataset_id = ? AND ?? = ? AND ${aw}`, values: [numVal, ds, vc || column, ov] });
    }
    if(column == 'sample_size') {
        var numVal = conv.parseNumber(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET sample_size_numeric = ? WHERE dataset_id = ? AND ?? = ? AND ${aw}`, values: [numVal, ds, vc || column, ov] });
    }

    // convert timestamps (start, end)
    if(column == 'event_date') {
        var { s, e } = conv.parseEvent(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET event_date_start = ?, event_date_end = ? WHERE dataset_id = ? AND ?? = ? AND ${aw}`, values: [s, e, ds, vc || column, ov] });
    }

    var results = await db.query({table: 'import', sql:`UPDATE ${joind} SET ?? = ?, changed = 1 WHERE dataset_id = ? AND ?? = ? AND ${aw}`, values: [column, nv, ds, vc || column, ov] });
    
    // run the validation as a new job and return a job id
    //validate(ds, aw); 
    
    var jobId = jm.createJob(auth.sub, 3, validate, { ds, aw });
    return {
        job: jm.getJob(jobId),    
        affected: results.affectedRows 
    };
}

const getColumn = async function(params, auth) {
    // get distinct column values
    
    // UGLY, I know

    // if the column name matches one of the columns array, select distinct. if the column name is one of location, reference, method, trait - handle special case
    // select location_* from columns and construct the distinct cause
    var ds = parseInt(params.id);
    var aw = getAuthWhere(auth);
    var column = getColumnName(params.column);
    var cols = null;

    // there are some special cases
    if(column == 'taxonomy') {
        cols = ['original_name', 'wsc_lsid'];
    } else if(column == 'reference') {
        cols = ['reference', 'reference_abbrev', 'reference_doi'];
    } else if(column == 'event_date') {
        cols = ['event_date', 'event_date_start', 'event_date_end'];
    } else if(!columns.includes(column)) {
        // method, location, trait
        cols = columns.filter(c => c.indexOf(column) == 0);
    }

    if(cols && !cols.length) {
        // the column does not match any known value, but the column search have not returned any results
        throw "Unknown column";
    } else if(!cols) {
        cols = [column];
    }
    
    var colSql = cols.map(c => db.escapeId(c)).join(',');


    var res = await db.prepareListResponse(limits, 'import', aw, [], joind);
        
    var results = await db.query({table: 'import', sql:`SELECT DISTINCT ${colSql} `
    + `FROM ${joind} WHERE dataset_id = ? AND ${aw}`, values: [id], nestTables: false, limits, hasWhere: true });

    var remstr = ['location_', 'method_', 'trait_', 'reference_', 'event_date_'];
    // compute the names of the object properties
    var oprops = [];
    cols.forEach(c => {
        var oprop = c;
        if(oprop == 'reference' || oprop == 'event_date') {
            oprop = 'raw';
        } else {
            remstr.forEach(s => { oprop = oprop.replace(s, '') });
            oprop = camelCase(oprop);
        }
        oprops.push(oprop);
    })

    
    res.items = results.map(r => {
        var o = {};
        // assign the values from results to the correct object properties
        cols.forEach((c, i) => {
            o[oprops[i]] = results[c];
        });
        return o;
    });
    return res;
}

const validate = async function(params) {
    var { ds, aw, state } = params;
    state = state || { progress: 0 };
    c = await db.getConnection();
     
    // step 1: convert all values to numeric where possible
    // this will set 0 when conversion is not possible 
    // don't do this here - do it when row or column values are saved (just one conversion occurs for the whole batch) and when the data are imported 
    /*
    await db.cquery(c,{table: 'import', sql:`UPDATE ${joinv} SET`
     + ` value_numeric = CONVERT(REPLACE(REPLACE(REPLACE(value,'true', 1),'false',0), ',','.'), DECIMAL(15,4))`
     + ` WHERE data_type.name NOT IN ('Character') AND changed = 1 dataset_id = ? AND ${aw}`, values: [ds] });
    */

     // Tcovert timestamps
     // dont do this here

     

    // step 2: update all foreign keys

    /*
    `sex_id` INT NULL, x
  `life_stage_id` INT NULL, x
  `measure_id` INT NULL, x
  `method_id` INT NULL, x
  `trait_id` INT NULL, x
  `reference_id` INT NULL, x
  `location_id` INT NULL,
  `habitat_global_id` INT NULL,
  `country_id` INT NULL,
  `taxonomy_id` INT NULL, x
  */

    await db.cquery(c,{table: 'import', sql:`UPDATE ${joinv} SET `
    + ` sex_id = sex.id, life_stage_id = life_stage.id, measure_id = measure.id, method_id = method.id, trait_id = trait.id,`
    + ` reference_id = reference.id,  location_id = location.id, location_habitat_global_id = habitat_global.id, location_country_id = country.id,`
    + ` taxonomy_id = COALESCE(taxonomy.id, taxonomy_name.taxonomy_id)`
    + ` WHERE changed = 1 AND dataset_id = ? AND ${aw}`, values: [ds] });

    state.progress += 1;

    // step 3: set the valid attribute to 1 if all the necesssary foreign keys are filled in and other conditions are met
    await db.cquery(c,{table: 'import', sql:`UPDATE import SET valid_review = 1 WHERE`
    + ` (sex IS NULL OR sex_id IS NOT NULL) AND`
    + ` (life_stage IS NULL OR life_stage_id IS NOT NULL) AND`
    + ` (measure_id IS NOT NULL) AND`
    + ` (value IS NOT NULL) AND`
    + ` (trait_id IS NOT NULL OR trait_abbrev IS NOT NULL OR (trait_name IS NOT NULL AND trait_description IS NOT NULL)) AND`
    // method is not required
    //+ ` (method_id IS NOT NULL OR method_abbrev IS NOT NULL OR (method_name IS NOT NULL AND method_description IS NOT NULL)) AND`
    + ` (reference IS NOT NULL) AND`
    + ` (original_name IS NOT NULL AND taxonomy_id IS NOT NULL) AND`
    + ` (sample_size IS NULL OR sample_size_numeric IS NOT NULL) AND`
    + ` (frequency IS NULL OR frequency_numeric IS NOT NULL) AND`
    + ` (location_lat IS NULL OR location_lat_conv IS NOT NULL) AND`
    + ` (location_lon IS NULL OR location_lon_conv IS NOT NULL) AND`
    + ` (location_country IS NULL OR location_country_id IS NOT NULL) AND`
    + ` (location_habitat_global IS NULL OR location_habitat_global_id IS NOT NULL) AND`
    //+ ` (event_date IS NULL OR event_date_start IS NOT NULL) AND`
    + ` (value_numeric IS NULL OR value_numeric = value OR (value = 'true' AND value_numeric = 1) OR (value = 'false' AND value_numeric = 0)) AND`
    + ` dataset_id = ? AND changed = 1 AND ${aw}`, values: [ds] });

    state.progress += 1;

    // step 4: set the valid attribute to 1 if the record is valid for review and also trait_id, method_id, 

    await db.cquery(c,{table: 'import', sql:`UPDATE import SET valid = 1 WHERE valid_review = 1 AND`
    + ` (trait_id IS NOT NULL) AND`
    //+ ` (method_id IS NOT NULL) AND`
    + ` (reference_id IS NOT NULL) AND`
    //+ ` (event_date IS NULL OR event_date_start IS NOT NULL) AND`
    /* all location fields are null OR location_id is filled in */
    + ` ((location_abbrev IS NULL AND location_lat IS NULL AND location_lon IS NULL AND location_precision IS NULL AND location_altitude IS NULL AND `
    + ` location_locality IS NULL AND location_country_code IS NULL AND location_habitat_global IS NULL AND location_habitat IS NULL AND `
    + ` location_microhabitat IS NULL AND location_stratum IS NULL AND location_note IS NULL) OR location_id IS NOT NULL) AND`
    + ` dataset_id = ? AND changed = 1 AND ${aw}`, values: [ds] });
    
    // step 5 reset the changed attribute for all the records (also for the invalid ones)
    await db.cquery(c,{table: 'import', sql:`UPDATE import SET changed = 0 WHERE changed = 1 AND`
    + ` dataset_id = ? AND changed = 1 AND ${aw}`, values: [ds] });

    state.progress += 1;
    state.completed = true;
    
    db.releaseConnection(c);
    return {
        status: 'completed'
    }
}


module.exports = function(dbClient) {
    db = dbClient;
    return {
        list,
        changeState,
        uploadFile,
        deleteRecords,
        getRow,
        updateRow,
        deleteRow,
        updateColumn,
        getColumn
    }
}