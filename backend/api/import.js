const conv = require('../util/converter');
const fcsv = require('fast-csv');
const csv = require('../util/csv');
const jm = require('../util/job-manager');
const { snakeCase, camelCase } = require('change-case');


var db = null;
var mail = null; 

const columns = [
  `wsc_lsid`,
  `original_name`,
  `trait_abbrev`,
  `trait_name`,
  `trait_description`,
  `trait_data_type`,
  `trait_category`,
  `value`,
  `measure`,
  `sex`,
  `life_stage`,
  `frequency`,
  `sample_size`,
  `treatment`,
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
  //`location_precision`,
  `location_altitude`,
  `location_locality`,
  `location_country_code`,
  //`location_habitat_global`,
  `location_habitat`,
  `location_microhabitat`,
  //`location_stratum`,
  `note`
];

const validityColumns = [
    'valid_review',
    'valid_approve',
    'duplicate',
]

const colSynonyms = {
    'longitude': 'location_lon',
    'latitude': 'location_lat',
    'altitude': 'location_altitude',
    'date': 'event_date',
    'locality': 'location_locality',
    'country_code': 'location_country_code',
    'country': 'location_country_code',
    'habitat': 'location_habitat',
    'habitat_local': 'location_habitat',
    'microhabitat': 'location_microhabitat', 
}

const joinf = 'data LEFT JOIN trait ON data.trait_id = trait.id '
            + 'LEFT JOIN taxonomy ON data.taxonomy_id = taxonomy.id '
            + 'LEFT JOIN sex ON data.sex_id = sex.id '
            + 'LEFT JOIN life_stage ON data.life_stage_id = life_stage.id '
            + 'LEFT JOIN measure ON data.measure_id = measure.id '
            + 'LEFT JOIN method ON data.method_id = method.id '       
            + 'LEFT JOIN reference ON data.reference_id = reference.id '
            + 'LEFT JOIN location ON data.location_id = location.id '
            + 'LEFT JOIN dataset ON data.dataset_id = dataset.id';

const joind = 'import LEFT JOIN dataset ON import.dataset_id = dataset.id';

const joindt = 'import LEFT JOIN dataset ON import.dataset_id = dataset.id '
             + 'LEFT JOIN taxonomy ON import.taxonomy_id = taxonomy.id ';

const joinv = 'import LEFT JOIN trait ON import.trait_abbrev = trait.abbrev '
            + 'LEFT JOIN data_type ON import.trait_data_type = data_type.name OR trait.data_type_id = data_type.id '
            + 'LEFT JOIN trait_category ON import.trait_category = trait_category.name '
            + 'LEFT JOIN taxonomy ON import.wsc_lsid IS NOT NULL AND import.wsc_lsid = taxonomy.wsc_lsid '
            + 'LEFT JOIN taxonomy taxonomy_names ON import.original_name IS NOT NULL AND import.original_name = taxonomy_names.full_name '
            + 'LEFT JOIN sex ON import.sex = sex.name '
            + 'LEFT JOIN life_stage ON import.life_stage = life_stage.name '
            + 'LEFT JOIN measure ON import.measure = measure.name '
            + 'LEFT JOIN method ON import.method_abbrev = method.abbrev '
            + 'LEFT JOIN country country3 ON import.location_country_code = country3.alpha3_code '
            + 'LEFT JOIN country country2 ON import.location_country_code = country2.alpha2_code '
            + 'LEFT JOIN habitat_global ON import.location_habitat_global = habitat_global.name '
            + 'LEFT JOIN reference refa ON import.reference_abbrev = refa.abbrev ' 
            + 'LEFT JOIN reference refd ON import.reference_doi = refd.doi '
            + 'LEFT JOIN reference reff ON import.reference = reff.full_citation '
            + 'LEFT JOIN location ON import.location_abbrev = location.abbrev '
            + 'LEFT JOIN location loccoord ON import.location_lat_conv = loccoord.lat AND import.location_lon_conv = loccoord.lon '
            //+ 'LEFT JOIN dataset ON import.dataset_id = dataset.id';

const getAuthWhere = function(auth) {
    var c = '';
    if(!auth.isEditor) {
        c+= `dataset.sub = ${db.escape(auth.sub)} AND `;
    }
    c+='dataset.imported < 3';
    return c;
}

const checkOwner = async function(id, auth) {
    var r = await db.query({table: 'dataset', sql: `SELECT id FROM dataset WHERE ${getAuthWhere(auth)} AND id=?`, values: [id]});
    if(r.length != 1 || r[0].id != id) {
        throw 'UNAUTH: Cannot edit the dataset - not an owner or editor'
    }
}

const getObject = function(r) {
    // convert to camelCase from snake case
    // serialize timestamps
    return {
        id: r[`id`],
        taxonomy: {
            wscLsid: r[`wsc_lsid`],
            originalName: r[`original_name`],
            id: r[`taxonomy_id`],
            fullName: r[`full_name`]
        },
        trait: {
            abbrev: r[`trait_abbrev`],
            name: r[`trait_name`],
            description: r[`trait_description`],
            dataType: {
                raw: r[`trait_data_type`],
                id: r[`trait_data_type_id`]
            },
            category: {
                raw: r[`trait_category`],
                id: r[`trait_category_id`]
            },
            id: r[`trait_id`]
        },
        value: {
            raw: r[`value`],
            numeric: r[`value_numeric`],
            requiresNumeric: r[`require_numeric_value`]
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
        treatment: r[`treatment`],
        eventDate: {
            text: r[`event_date`],
            start: r[`event_date_start`] ? r[`event_date_start`].toJSON() : null,
            end: r[`event_date_end`] ? r[`event_date_end`].toJSON() : null
        },
        note: r[`note`],
        rowLink: r[`row_link`],
        method: {
            abbrev: r[`method_abbrev`],
            name: r[`method_name`],
            description: r[`method_description`],
            id: r[`method_id`]
        },
        reference: {
            fullCitation: r[`reference`],
            abbrev: r[`reference_abbrev`],
            doi: r[`reference_doi`],
            id: r[`reference_id`]
        },
        location: {
            abbrev: r[`location_abbrev`],
            coords: {
                lat: {
                    raw: r[`location_lat`],
                    conv: r[`location_lat_conv`],
                },
                lon: {
                    raw: r[`location_lon`],
                    conv: r[`location_lon_conv`],
                },
                /*
                precision: {
                    raw: r[`location_precision`],
                    numeric: r[`location_precision_numeric`]
                }
                */
            },
            altitude: {
                raw: r[`location_altitude`],
                numeric: r[`location_altitude_numeric`]
            },
            locality: r[`location_locality`],
            country: {
                raw: r[`location_country_code`],
                id: r[`location_country_id`]
            },
            /*
            habitatGlobal: {
                raw: r[`location_habitat_global`],
                id: r[`location_habitat_global_id`]
            },
            */
            habitat: r[`location_habitat`],
            microhabitat: r[`location_microhabitat`],
            //stratum: r[`location_stratum`],
            //note: r[`location_note`],
            id: r[`location_id`]
        },
        valid: {
            review: r[`valid_review`] == 1,
            approve: r[`valid`] == 1,
            duplicate: r['duplicate'] == 1
        }
    }
}

const list = async function(params, limits, auth) {
    var id = parseInt(params.id);
    var aw = getAuthWhere(auth);
    var res = await db.prepareListResponse(limits, 'import', `dataset_id = ? AND ${aw}`, [id], joind);
        
    var results = await db.query({table: 'import', sql:`SELECT import.*, taxonomy.full_name `
    + `FROM ${joindt} WHERE dataset_id = ? AND ${aw}`, values: [id], nestTables: false, limits, hasWhere: true });
   
    res.items = results.map(r => getObject(r)); 
    return res;
}

const exportCsv = async function(params, auth, tmpDir) {
    var id = parseInt(params.id);
    var aw = getAuthWhere(auth);
    var c = await db.getConnection();
    var dstream = db.squery(c, {table: 'import', sql:`SELECT ${columns.map(c => 'import.'+c).join(',')} `
    + `FROM ${joind} WHERE dataset_id = ? AND ${aw}`, values: [id], nestTables: false, hasWhere: true });
   
    var r = await csv.get(tmpDir, `spider-traits-import-${id}-${Date.now()}.csv`, dstream, c);
    //console.log(r);
    db.releaseConnection(c);
    return r;
}

const getUploaderEmail = async function(id) {
    var record = await db.query({table: 'dataset', sql: `SELECT email FROM dataset WHERE id = ?`, values: [id]});
    return record[0].email;
}

const getDatasetState = async function(id) {
    var currStateR = await db.query({table: 'dataset', sql: `SELECT imported FROM dataset WHERE id = ?`, values: [id]});
    if(currStateR.length == 0) {
        throw 'Dataset does not exist'
    }
    var currState;
    switch(currStateR[0].imported) {
        case 0: currState = 'created'; break;
        case 1: currState = 'reviewed'; break;
        case 2: currState = 'rejected'; break;
        case 3: currState = 'approved'; break;
        default: currState = 'created';
    }
    return { currState, currStateNum: currStateR[0].imported};
}

const changeState = async function(params, body, auth) {
    var id = parseInt(params.id);
    
    var aw = getAuthWhere(auth);

    // used for sending the dataset to approval and for approving the dataset. If the dataset is approved,
    // all the records are transferred from the import table to the data table - that's why this is not handled by the datasets endpoint 

    var state = body.state;
    if(!state) {
        throw 'State was not provided'
    }
    var msg = body.message;

    // contributor can only change state to reviewed
    if(!auth.isEditor && state != 'reviewed') {
        throw 'cannot change the state to this value';
    }

    var { currState, currStateNum } = await getDatasetState(id);

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

    // send notification email
    // only if dataset is not already approved
    if(currStateNum < 3) {
    switch(state) {
        case 'created': mail.send({subject: 'Dataset added', text: 'A new dataset was created by a contributor.'}); break; // this will never happen
        case 'rejected': mail.send({ to: await getUploaderEmail(id), subject: 'Dataset rejected', text: 'Your dataset was rejected by an editor. You can find more details at {BASEURL}/import'}); break;
        case 'reviewed': mail.send({subject: 'Dataset review requested', text: 'A new dataset was submitted for a review by a contributor. You can find more details at {BASEURL}/approve'}); break;
        case 'approved': mail.send({ to: await getUploaderEmail(id), subject: 'Dataset approved', text: `Your dataset was approved by an editor. You can view the dataset detail at {BASEURL}/datasets/${id}`}); break; 
    }
    }

    var imp;
    switch(state) {
        case 'created': imp = 0; break;
        case 'rejected': imp = 1; break;
        case 'reviewed': imp = 2; break;
        case 'approved': imp = 3; break; 
    }

    //console.log(currStateNum);
    //console.log(imp);

    // dataset is not yet approved and should not be approved now
    if(currStateNum < 3 && imp < 3) {
        await db.query({table: 'dataset', sql: `UPDATE dataset SET imported = ?, message = ? WHERE id = ? AND ${getAuthWhere(auth)}`, values: [imp, msg, id] });
        //console.log('Returning...');
        return {
            id
        };
    } else if(currStateNum == 2 && imp == 3) {
        // dataset is approved now
        var jobId = jm.createJob(auth.sub, 6, transferToData, { id, aw });
        return {
            job: jm.getJob(jobId)
        };
    } else if(currStateNum == 3 && imp == 2) {
        // transferring data from validated dataset back to import
        var jobId = jm.createJob(auth.sub, 30000, transferFromData, { id, auth });
        return {
            job: jm.getJob(jobId)
        };
    }
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
    (SELECT @row_number:=0) AS t) rl ON import.row_link = rl.row_link SET import.row_link = ? + rl.rlnum WHERE import.row_link IS NOT NULL AND dataset_id = ? AND ${aw}`, values: [lastRowLink, id]});

    state.progress+=1;

    // INSERT INTO data (...) SELECT ... FROM import WHERE dataset_id = ?
    await db.cquery(c, {table: 'data', sql:`INSERT INTO data`
    + ` (taxonomy_id, original_name, trait_id, value, value_numeric, measure_id, sex_id, life_stage_id, frequency, `
    + ` sample_size, event_date_text, event_date_start, event_date_end, method_id, location_id, reference_id, dataset_id, note, row_link) `
    + ` SELECT taxonomy_id, original_name, trait_id, value, value_numeric, measure_id, sex_id, life_stage_id, frequency_numeric, `
    + ` sample_size_numeric, event_date, event_date_start, event_date_end, method_id, location_id, reference_id, dataset_id, note, CONVERT(row_link, UNSIGNED) `
    + ` FROM ${joind} WHERE dataset_id = ? AND ${aw}`, values: [id] });
    
    state.progress+=1;
    // DELETE FROM import WHERE dataset_id = ?
    await db.cquery(c, {table: 'import', sql:`DELETE import FROM ${joind} WHERE dataset_id = ? AND ${aw}`, values: [id] });
    
    state.progress+=1;

    await db.cquery(c, {table: 'dataset', sql: `UPDATE dataset SET imported = 3, message = null WHERE id = ? AND ${aw}`, values: [id] });
    state.progress+=1;
    db.releaseConnection(c);
    
    state.completed = true;
}

const transferFromData = async function(params) {
    var { id, auth, state } = params;

    if(!auth.isEditor) {
        throw 'Unauthorized for this action';
    }

    c = await db.getConnection();
    
    state.progress+=1000;
    // copy data to import
    await db.cquery(c, {table: 'import', sql:`INSERT INTO import (`
    + `wsc_lsid, original_name, trait_abbrev, value, value_numeric, measure, sex, life_stage, frequency, frequency_numeric, sample_size, sample_size_numeric, `
    + `event_date, event_date_start, event_date_end, method_abbrev, location_abbrev, reference_abbrev, dataset_id, note, row_link, changed, valid, valid_review, duplicate`
    + `) SELECT `
    + `taxonomy.wsc_lsid, data.original_name, trait.abbrev, value, value_numeric, measure.name, sex.name, life_stage.name, frequency, frequency, sample_size, `
    + `sample_size, event_date_text, event_date_start, event_date_end, method.abbrev, location.abbrev, reference.abbrev, dataset.id, data.note, data.row_link, 1, 0, 0, 0 `
    + `FROM ${joinf} WHERE data.dataset_id = ?`, values: [id] });

    state.progress+=10000;
    // change dataset state
    await db.cquery(c, {table: 'dataset', sql: `UPDATE dataset SET imported = 2, message = 'Transferred back from approved data' WHERE id = ?`, values: [id] });
    state.progress+=1000;
    // delete from data
    await db.cquery(c, {table: 'data', sql: `DELETE FROM data WHERE dataset_id = ?`, values: [id] });
    state.progress+=2000;
    db.releaseConnection(c);
    // validation = 16000 progress
    await validate({ds: id, auth, state: params.state});
    state.completed = true;
}

const importRow = async function(conn, ds, r, state, cache) {
    var row = {};
    // copy the values and convert to snake case
    //console.dir(r);
    Object.keys(r).forEach(k => {
        var c = snakeCase(k).toLowerCase();
        //console.dir(c);

        var val = r[k];
        if(!val || val.trim().length == 0) {
            // skips the column
            return;
        }

        if(columns.includes(c)) {
            row[c] = val;
        }
        if(colSynonyms[c]) {
            row[colSynonyms[c]] = val;
        }

    });
    //console.dir(row);
    // caches the parsed values
    const gfc = (field, func) => {
        var v = row[field];
        if(!v) {
            return null;
        }
        if(cache[`${field}|${v}`]) {
            return cache[`${field}|${v}`];
        } else {
            var nv = func(v);
            cache[`${field}|${v}`] = nv;
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
   row['location_altitude_numeric'] =conv.parseNumber(row['location_altitude']);
   row['location_precision_numeric'] =conv.parseNumber(row['location_precision']);

   if(row['wsc_lsid']) {
    row['wsc_lsid'] = row['wsc_lsid'].replace(/\[|\]/g,'');
   }

    // convert timestamps (start, end)
    if(row['event_date']) {
        var { start, end } = gfc('event_date',conv.parseEvent);
        row['event_date_start'] = start;
        row['event_date_end'] = end;
    }

    // convert lat, lon
    row['location_lat_conv'] = gfc('location_lat', conv.parseCoord);

    row['location_lon_conv'] = gfc('location_lon', conv.parseCoord);

    row['dataset_id'] = ds;
    row['changed'] = 1;
    row['duplicate'] = 0;
    row['valid_review'] = 0;
    row['valid'] = 0;

    //console.dir(row);

    try { 
        await db.cquery(conn, {table: 'import', sql: 'INSERT INTO import SET ?', values: [row]});
    } catch (err) {
        console.log(err);
        state.errors.push(`Row skipped: ${JSON.stringify(row)}, error: ${err}`);
        return false;
    }
    state.progress += 1;
    return true;
}

const uploadFile = async function(params, body, files, auth) {
    // uploads a file to already existing dataset
    // returns only a jobId that can be used to track the progress
    // in the background transfers rows from the file to the import table
    
    // file is uploaded
    
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
    //console.dir(fpath);
    //console.log(f.mimetype);
    //console.log(f.name);
    //console.log(`${f.name.toLowerCase().indexOf('.csv')} ${f.name.length}`)
    // https://www.drupal.org/project/commerce_shipping_price_matrix/issues/2965997
    // we check mime type or if file name ends with csv
    if((f.mimetype == 'application/vnd.ms-excel' || f.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    && f.name.toLowerCase().indexOf('.csv') + 4 != f.name.length) {
        //console.log('converting');
        fpath = await csv.convert(fpath);
    } else if(f.mimetype != 'text/csv' && f.name.toLowerCase().indexOf('.csv') + 4 != f.name.length) {
        throw 'Unknown file format';
    }
    // first passthrough - just get the number of lines
    var total = await csv.rows(fpath);
    var cnt = total;
    //console.log(`Total: ${total}`);
    var ifunc = async (params) => {
        // + 1 - the file was uploaded
        params.state.progress += 1;

        var conn = await db.getConnection();

        
        // https://mariadb.com/kb/en/how-to-quickly-insert-data-into-mariadb/
        //await conn.query({table: 'import', sql: 'BEGIN'});
        await conn.query({table: 'import', sql: 'ALTER TABLE import DISABLE KEYS'});

        // this promise will resolve when the last row is inserted into the db
        // the data events are fired asynchronously (they are not waiting for processing the previous row) and the queries are queued by the mysql client
        // releaseConnection is also queued and can be basically ignored in the flow 
        await new Promise((resolve, reject) => {
        var valCache = {};
        fcsv.parseFile(fpath, {headers: true, ignoreEmpty: true, trim: true, encoding: 'utf8'})
        .on('error', error => { params.state.errors.push[error]; params.state.aborted = true; resolve(); })
        .on('data', async row => {  
            // we are running async code here here, but another data event was already fired - the events are not waiting for each other
            
            /* speeding up the querying 
            if(cnt-total % 1000 == 0 && cnt - total >= 1000) {
                await conn.query({table: 'import', sql: 'END'});
                await conn.query({table: 'import', sql: 'BEGIN'});
            }
            */
            await importRow(conn, params.ds, row, params.state, valCache);
            
            cnt-=1;
            if(cnt == 0) {
                console.log('Last row processed. Enabling indexes...');
                await conn.query({table: 'import', sql: 'ALTER TABLE import ENABLE KEYS'});
                db.releaseConnection(conn); 
                console.log('Connecton released');
                resolve();
            }
        })
        // when the last record is added to the db queue, an callback is attached to the connection release
        // when the connection is released, the callback is called
        .on('end', rowCount => { /* console.log('csv processing ended - conn released'); db.releaseConnection(conn); db.releaseConnection(conn, () => resolve())*/ });
        });
        // now all the records are saved in the db or the import was aborted due to the error
        if(params.state.aborted) {
            return;
        }
        
        await validate({ds, auth, state: params.state});
        params.state.progress += 1000;
        params.state.completed = true;
    };

    // +16000 to the total is the validation step
    // + 1000 to the totat is the file upload
    var jobId = jm.createJob(auth.sub, total + 1000 + 16000, ifunc, { ds });
    return {
        job: jm.getJob(jobId)    
    };
}

const deleteRecords = async function(params, auth) {
    var id = parseInt(params.id);
    //https://www.mysqltutorial.org/mysql-delete-join/
    await db.query({table: 'import', sql: `DELETE import FROM ${joind} WHERE dataset_id=? AND ${getAuthWhere(auth)}`, values: [id] });
    await db.query({table: 'import', sql: `OPTIMIZE TABLE import;`});
    return {
        id
    }
}

const getColumnName = function(val) {
    if(!val) {
        return null;
    }
    if(val == 'valid.duplicate') {
        return 'duplicate';
    }
    if(val == 'taxonomy.wscLsid') {
        return `wsc_lsid`;
    }
    if(val == 'taxonomy.originalName') {
        return `original_name`;
    }
    if(val == 'reference.fullCitation') {
        return `reference`;
    }
    if(val == 'eventDate.text') {
        return `event_date`;
    }
    if(val.indexOf('location.country') > -1) {
        return `location_country_code`;
    }
    if(val.indexOf('.coords')>0) {
        val = val.replace('.coords','');
    }
    return snakeCase(val.replace('.raw','').replace('.', '_'));
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

const getPropsFromObject = function(o) {
    var output = {};
    //console.log('Input object: ');
    //console.dir(o);
    Object.keys(o).forEach(k => {
        //console.log('Prop key: ');
        //console.dir(k);
        if(o[k] != null && typeof o[k] === 'object') {
            var childAttrs = getPropsFromObject(o[k]);
            Object.keys(childAttrs).forEach(ca => {
                output[`${k}.${ca}`] = childAttrs[ca];
            });
        } else {
            output[k] = o[k];
        }
    })
    //console.log('Output: ');
    //console.dir(output);
    return output;
}

const updateRow = async function(params, body, auth) {
    var ds = parseInt(params.id);
    var row = parseInt(params.row);
    var aw = getAuthWhere(auth);
    var newAttrs = {};
    var props = getPropsFromObject(body);
    
    Object.keys(props).forEach(i => {
        newAttrs[getColumnName(i)] = props[i];
    });

    //console.dir(newAttrs);

    delete(newAttrs.id);
    delete(newAttrs['dataset_id']);
    newAttrs['valid'] = 0;
    newAttrs['valid_review'] = 0;
    newAttrs['duplicate'] = 0;
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
        newAttrs['sample_size_numeric'] = conv.parseNumber(newAttrs['sample_size']);
    }

    if(newAttrs['location_precision']) {
        newAttrs['location_precision_numeric'] = conv.parseNumber(newAttrs['location_precision']);
    }

    if(newAttrs['location_altitude']) {
        newAttrs['location_altitude_numeric'] = conv.parseNumber(newAttrs['location_altitude']);
    }
    
    // convert timestamps (start, end)
    if(newAttrs['event_date']) {
        var { start, end } = conv.parseEvent(newAttrs['event_date']);
        newAttrs['event_date_start'] = start;
        newAttrs['event_date_end'] = end;
    }

    // the dataset id is not really needed - the row IDs are autoincremented
    await db.query({table: 'import', sql:`UPDATE ${joind} SET ? WHERE dataset_id = ? AND import.id=? AND ${aw}`, values: [newAttrs, ds, row] });
    validate({ds, auth});
    return { 
        row
    }
}


const deleteRow = async function(params, auth) {
    var ds = parseInt(params.id);
    var row = parseInt(params.row);
    var aw = getAuthWhere(auth);
    // the dataset id is not really needed - the row IDs are autoincremented globally
    var results = await db.query({table: 'import', sql:`DELETE import FROM ${joind} WHERE dataset_id = ? AND import.id=? AND ${aw}`, values: [ds, row] });
     //var r = results[0];
     return {
        row 
    }
}

const updateColumn = async function(params, body, auth) {
    var ds = parseInt(params.id);
    
    var aw = getAuthWhere(auth);
    var column = getColumnName(params.column);
    if(column == 'dataset_id' || column == 'valid' || column == 'valid_review' || column == 'changed' || column == 'duplicate') {
        throw 'Cannot update this column';
    }
    var nv = body.newValue;
    if(nv == '') {
        nv = null;
    }
    // allow to change value in one column based on the value in another
    
    // add support for array of columns (for setting up the location, reference, trait, method abbrev)
    var vc = null;
    var ov = null; 
    if(body.multipleColumns) {
        vc = body.valueColumns.map(c =>getColumnName(c));
        ov = body.oldValues;
    } else {
        vc = [ getColumnName(body.valueColumn) || column ];
        ov = [ body.oldValue ];
    }
    if(vc.length != ov.length) {
        throw 'Number of columns and number of values does not match';
    }
    var clauses = [];
    for(var i = 0; i < vc.length; i++) {
        clauses.push(`${db.escapeId(vc[i])}${ov[i] != null ? '=' : ' IS ' }${db.escape(ov[i])}`)
    }
    var cw = clauses.join(' AND ');
    
    if(column == 'location_lat' || column == 'location_lon') {
        var convVal = conv.parseCoord(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET ${db.escapeId(column + '_conv')} = ? WHERE ${cw} AND dataset_id = ? AND ${aw}`, values: [convVal, ds] });
    }

    // convert numeric values
    if(column == 'value') {
        var numVal = conv.parseNumber(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET value_numeric = ? WHERE ${cw} AND dataset_id = ? AND ${aw}`, values: [numVal, ds] });
    }
    if(column == 'frequency') {
        var numVal = conv.parseNumber(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET frequency_numeric = ? WHERE ${cw} AND dataset_id = ? AND ${aw}`, values: [numVal, ds] });
    }
    if(column == 'sample_size') {
        var numVal = conv.parseNumber(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET sample_size_numeric = ? WHERE ${cw} AND dataset_id = ? AND ${aw}`, values: [numVal, ds] });
    }

    
    if(column == 'location_precision') {
        var numVal = conv.parseNumber(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET location_precision_numeric = ? WHERE ${cw} AND dataset_id = ? AND ${aw}`, values: [numVal, ds] });
    }
    
    if(column == 'location_altitude') {
        var numVal = conv.parseNumber(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET location_altitude_numeric = ? WHERE ${cw} AND dataset_id = ? AND ${aw}`, values: [numVal, ds] });
    }

    // convert timestamps (start, end)
    if(column == 'event_date') {
        var { start, end } = conv.parseEvent(nv);
        await db.query({table: 'import', sql:`UPDATE ${joind} SET event_date_start = ?, event_date_end = ? WHERE ${cw} AND dataset_id = ? AND ${aw}`, values: [start, end, ds ] });
    }

    /*
    console.dir(body);
    console.dir(column);
    console.dir(nv);
    console.dir(cw);
    */
    var results = await db.query({table: 'import', sql:`UPDATE ${joind} SET ?? = ?, valid_review = 0, valid = 0, duplicate=0, changed = 1 WHERE ${cw} AND dataset_id = ? AND ${aw}`, values: [column, nv, ds ] });
    
    // run the validation as a new job and return a job id
    //validate(ds, aw); 
    
    // run validation only if not disabled
    if(body.validation != null && body.validation == false) {
        return {
            affected: results.affectedRows
        }
    }

    var jobId = jm.createJob(auth.sub, 16000, validate, { ds, auth });
    return {
        job: jm.getJob(jobId),    
        affected: results.affectedRows 
    };
}

const deleteColumn = async function(params, auth) {
    var ds = parseInt(params.id);
    var aw = getAuthWhere(auth);
    var column = getColumnName(params.column);
    if(!columns.includes(column) && !validityColumns.includes(column)) {
        throw 'Cannot delete by this column';
    }
    var v = params.value;
    if (v == 'empty') {
        v = '';
    }
    var results = await db.query({table: 'import', sql:`DELETE import FROM ${joind} WHERE dataset_id = ? AND ??=? AND ${aw}`, values: [ds, column, v] });
    return {
        affected: results.affectedRows
    }
}

const getColumn = async function(params, limits, auth) {
    // get distinct column values
    
    // UGLY, I know

    // if the column name matches one of the columns array, select distinct. if the column name is one of location, reference, method, trait - handle special case
    // select location_* from columns and construct the distinct cause
    var ds = parseInt(params.id);
    var aw = getAuthWhere(auth);
    var column = getColumnName(params.column);
    var cols = null;

    var entity = null;
    // there are some special cases
    if(column == 'taxonomy') {
        cols = ['original_name', 'wsc_lsid', 'taxonomy_id'];
    } else if(column == 'reference' && params.column == 'reference') { // reference.fullCitation is also translated as reference
        cols = ['reference', 'reference_abbrev', 'reference_doi', 'reference_id'];
    } else if(column == 'event_date') {
        cols = ['event_date', 'event_date_start', 'event_date_end'];
    } else if(!columns.includes(column)) {
        // method, location, trait
        cols = columns.filter(c => c.indexOf(column) == 0);
        cols.push(`${column}_id`);
        if(column == 'location') {
            cols.push('location_lat_conv');
            cols.push('location_lon_conv');
            cols.push('location_country_id');
            //cols.push('location_habitat_global_id');
        }
        if(column == 'trait') {
            cols.push('trait_data_type_id');
            cols.push('trait_category_id');
        }
    }

    if(cols && !cols.length) {
        // the column does not match any known value, but the column search have not returned any results
        throw "Unknown column";
    } else if(!cols) {
        cols = [column];
    } else {
        // there are cols from the special cases - the netity column was specified
        entity = column;
    }
    
    var colEsc = cols.map(c => db.escapeId(c))
    var colSql = colEsc.join(',');


    var res = await db.prepareListResponse(limits, 'import', `dataset_id = ? AND ${aw}`, [ds], joind, colEsc);
        
    var results = await db.query({table: 'import', sql:`SELECT DISTINCT ${colSql} `
    + `FROM ${joind} WHERE dataset_id = ? AND ${aw}`, values: [ds], nestTables: false, limits, hasWhere: true });

    res.items = results.map(r => {
       return getObject(r);
    });
    return res;
}

const startValidation = async function(params, body, auth) {
    var ds = parseInt(params.id);
    var aw = getAuthWhere(auth);
    //console.dir(body);
    
    const f = async (params) => {
        if(body.all && body.all === true) {
            await db.query({table: 'import', sql:`UPDATE ${joind} SET changed = 1, valid_review = 0, valid = 0 WHERE dataset_id = ? AND ${aw}`, values: [ ds ] });
        }
        params.state.progress += 1000;
        await validate(params);
    }
    
    var jobId = jm.createJob(auth.sub, 17000, f, { ds, auth });
    return {
        job: jm.getJob(jobId),    
    };
}

const validate = async function(params) {
    var { ds, auth, state } = params;
    try {
        checkOwner(ds, auth);
    } catch(e) {
        state.aborted = true;
        state.errors.push(e);
    }
    state = state || { progress: 0 };
    c = await db.getConnection();
    state.progress += 1000;

    await db.cquery(c,{table: 'import', sql:`UPDATE ${joinv} SET `
    + ` sex_id = sex.id, life_stage_id = life_stage.id, measure_id = measure.id, method_id = method.id, trait_id = trait.id, trait_data_type_id = data_type.id, `
    + ` import.trait_category_id = trait_category.id, `
    + ` import.reference_id = COALESCE(refa.id, refd.id, reff.id),  `
    + ` location_id = COALESCE(location.id, loccoord.id), `
    // + `location_habitat_global_id = habitat_global.id, `
    + ` location_country_id = COALESCE(country3.id,country2.id), `
    + ` import.taxonomy_id = CASE WHEN taxonomy_names.id IS NULL THEN NULL WHEN taxonomy.id IS NOT NULL AND taxonomy_names.id IS NOT NULL `
    + `   AND COALESCE(taxonomy.valid_id, taxonomy.id) <> COALESCE(taxonomy_names.valid_id, taxonomy_names.id) `
    + `    THEN NULL ELSE COALESCE(taxonomy.valid_id, taxonomy.id, taxonomy_names.valid_id, taxonomy_names.id) END, `
    + ` require_numeric_value = CASE WHEN data_type.name <> 'Character' AND data_type.name <> 'Categorical' THEN 1 ELSE 0 END `
    + ` WHERE changed = 1 AND dataset_id = ?`, values: [ds] });

    state.progress += 4000;

    // mark the duplicate records
    await db.cquery(c,{table: 'import', sql:`UPDATE import INNER JOIN data`
    + ` ON import.original_name = data.original_name`
    + ` AND import.reference_id = data.reference_id`
    + ` AND import.trait_id = data.trait_id`
    + ` AND import.value = data.value`
    + ` AND import.sex_id = data.sex_id`
    + ` AND import.life_stage_id = data.life_stage_id`
    + ` SET duplicate = 1 WHERE changed = 1 AND import.dataset_id = ?`, values: [ds] });


    state.progress += 3000;

    // step 3: set the valid attribute to 1 if all the necesssary foreign keys are filled in and other conditions are met
    await db.cquery(c,{table: 'import', sql:`UPDATE import SET valid_review = 1 WHERE`
    + ` (sex IS NULL OR sex_id IS NOT NULL) AND`
    + ` (life_stage IS NULL OR life_stage_id IS NOT NULL) AND`
    + ` (measure_id IS NOT NULL) AND`
    + ` (value IS NOT NULL) AND`
    + ` (trait_id IS NOT NULL OR (trait_name IS NOT NULL AND trait_description IS NOT NULL AND trait_data_type_id IS NOT NULL AND trait_category_id IS NOT NULL)) AND`
    // method is not required
    + ` (method_id IS NOT NULL OR (method_name IS NULL AND method_description IS NULL) OR (method_name IS NOT NULL AND method_description IS NOT NULL)) AND`
    + ` (reference_id IS NOT NULL OR reference IS NOT NULL) AND`
    + ` (original_name IS NOT NULL AND taxonomy_id IS NOT NULL) AND`
    + ` (sample_size IS NULL OR sample_size_numeric IS NOT NULL) AND`
    + ` (frequency IS NULL OR frequency_numeric IS NOT NULL) AND`
    + ` (location_lat IS NULL OR location_lat_conv IS NOT NULL) AND`
    + ` (location_lon IS NULL OR location_lon_conv IS NOT NULL) AND`
    + ` ((location_lat_conv IS NULL AND location_lon_conv IS NULL) OR (location_lat_conv IS NOT NULL AND location_lon_conv IS NOT NULL)) AND`
    + ` (location_altitude IS NULL OR location_altitude_numeric IS NOT NULL) AND`
    + ` (location_precision IS NULL OR location_precision_numeric IS NOT NULL) AND`
    + ` (location_country_code IS NULL OR location_country_id IS NOT NULL) AND`
    // + ` (location_habitat_global IS NULL OR location_habitat_global_id IS NOT NULL) AND`
    + ` (event_date IS NULL OR (event_date_start IS NOT NULL AND event_date_end IS NOT NULL)) AND`
    + ` (require_numeric_value = 0 OR value_numeric = value OR (value = 'true' AND value_numeric = 1) OR (value = 'false' AND value_numeric = 0)) AND`
    + ` duplicate = 0 AND `
    + ` dataset_id = ? AND changed = 1`, values: [ds] });

    state.progress += 4000;

    // step 4: set the valid attribute to 1 if the record is valid for review and also trait_id, method_id, 

    await db.cquery(c,{table: 'import', sql:`UPDATE import SET valid = 1 WHERE valid_review = 1 AND`
    + ` (trait_id IS NOT NULL) AND`
    //+ ` (method_id IS NOT NULL) AND`
    + ` (method_id IS NOT NULL OR (method_name IS NULL AND method_description IS NULL)) AND`
    + ` (import.reference_id IS NOT NULL) AND`
    //+ ` (event_date IS NULL OR event_date_start IS NOT NULL) AND`
    /* all location fields are null OR location_id is filled in */
    + ` ((location_abbrev IS NULL AND location_lat IS NULL AND location_lon IS NULL AND`
    //+ ` location_precision IS NULL AND`
    + ` location_altitude IS NULL AND`
    + ` location_locality IS NULL AND location_country_code IS NULL AND`
    // + `AND location_habitat_global IS NULL AND location_habitat IS NULL AND `
    + ` location_microhabitat IS NULL `
    // + `AND location_stratum IS NULL AND location_note IS NULL `
    + `) OR location_id IS NOT NULL) AND`
    + ` dataset_id = ? AND changed = 1`, values: [ds] });
    
    // step 5 reset the changed attribute for all the records (also for the invalid ones)
    await db.cquery(c,{table: 'import', sql:`UPDATE import SET changed = 0 WHERE changed = 1 AND`
    + ` dataset_id = ? AND changed = 1`, values: [ds] });

    state.progress += 4000;
    state.completed = true;
    
    db.releaseConnection(c);
    return {
        status: 'completed'
    }
}

var synonyms = {
    'taxonomy.wscLsid': 'wsc_lsid',
    'taxonomy.originalName': `original_name`,
    'location.abbrev': 'location_abbrev',
    'location.coords.lon': 'location_lon',
    'location.coords.lat': 'location_lat',
    //'location.coords.precision': 'location_precision',
    'location.altitude': `location_altitude`,
    'location.locality': `location_locality`,
    'location.country.code': `location_country_code`,
    'location.country': `location_country_code`,
    //'location.habitatGlobal': `location_habitat_global`,
    'location.habitat': `location_habitat`,
    'location.microhabitat': `location_microhabitat`,
    //'location.stratum': `location_stratum`,
    'location.note': `location_note`,
    'trait.abbrev': `trait_abbrev`,
    'trait.name': `trait_name`,
    'trait.description': `trait_description`,
    'trait.category': `trait_category`,
    'trait.dataType': `trait_data_type`,
    'method.abbrev': `method_abbrev`,
    'method.name': `method_name`,
    'method.description': `method_description`,
    'lifeStage': `life_stage`,
    'sampleSize': `sample_size`,
    'eventDate.text': `event_date`,
    'rowLink': `row_link`,
    'reference.fullCitation': 'reference',
    'reference.abbrev': 'reference_abbrev',
    'reference.doi': `reference_doi`,
    'valid.review': 'valid_review',
    'valid.approve': 'valid',
    'valid.duplicate': 'duplicate'
}

module.exports = function(dbClient, mailClient) {
    mail = mailClient;
    db = dbClient;
    db.addSynonyms('import', 'import', synonyms);
    return {
        list,
        exportCsv,
        changeState,
        uploadFile,
        deleteRecords,
        getRow,
        updateRow,
        deleteRow,
        updateColumn,
        getColumn,
        deleteColumn,
        startValidation
    }
}