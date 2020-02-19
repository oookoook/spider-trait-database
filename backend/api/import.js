var db = null;

const join = 'import LEFT JOIN trait ON import.trait_id = trait.id '
                   + 'LEFT JOIN reference ON import.reference_id = reference.id'
                   + 'LEFT JOIN location ON import.location_id = location.id'
                   + 'LEFT JOIN dataset ON import.dataset_id';

const joind = 'import LEFT JOIN dataset ON import.dataset_id';

const joinv = 'import LEFT JOIN trait ON import.trait_abbrev = trait.abbrev '
            + 'LEFT JOIN taxonomy ON import.wsc_lsid = taxonomy.wsc_lsid '
            + 'LEFT JOIN taxonomy_names ON import.original_name = taxonomy_names.'
            + 'LEFT JOIN sex ON import.sex = sex.name '
            + 'LEFT JOIN life_stage ON import.life_stage = life_stage.name '
            + 'LEFT JOIN measure ON import.measure = life_stage.measure '
            + 'LEFT JOIN method ON import.method_abbrev = method.abbrev '
            + 'LEFT JOIN country ON import.location_country_code = country.alpha3_code '
            + 'LEFT JOIN habitat_global ON import.location_habitat_global = habitat_global.name '
            + 'LEFT JOIN reference ON import.reference_doi = reference.doi OR import.reference = reference.fullCitation'
            + 'LEFT JOIN location ON import.location_id = location.id'
            + 'LEFT JOIN dataset ON import.dataset_id';

const getAuthWhere = function(auth) {
    var c = '';
    if(!auth.isEditor) {
        c+= `dataset.sub = ${db.escape(auth.sub)} AND `;
    }
    c+='dataset.imported < 2';
    return c;
}

const list = async function(params, limits, auth) {
        var id = parseInt(params.id);
        var aw = getAuthWhere(auth);
        var res = await db.prepareListResponse(limits, 'import', aw, [], join);
        
       var results = await db.query({table: 'import', sql:`SELECT * `
       + `FROM ${join} WHERE dataset_id = ? AND ${aw}`, values: [id], nestTables: true, limits, hasWhere: true });
       res.items = results;
       /*results.map(r => {    
        return {
            id: r.trait.id,
            abbrev: r.trait.abbrev,
            name: r.trait.name,
            category: {
                id: r.trait_category.id,
                name: r.trait_category.name
            },
            reference: r.reference.id ? {
                id: r.reference.id,
                abbrev: r.reference.abbrev
            } : null
            }
        });*/   
        return res;
}

const changeState = async function(params, body, auth) {
    var id = parseInt(params.id);
    
    // used for sending the dataset to approval and for approving the dataset. If the dataset is approved,
    // all the records are transferred from the import table to the data table - that's why this is not handled by the datasets endpoint 

    var state = body.state;

    // contributor can only change state to reviewed
    if(!auth.isEditor && state != 'reviewed') {
        throw 'cannot change the state to this value';
    }

    if(state == 'approved') {
        // check if the dataset is valid    
        var valid = false;
        var validR = db.query({table: 'import', sql: `SELECT COUNT(import.valid) as invalid FROM `
        + `${joind} WHERE dataset.id = ? AND ${getAuthWhere(auth)} AND valid=0`, values: [id]});
        valid = validR[0].invalid == 0;
        if(!valid) {
            throw 'Cannot approve the dataset - the dataset is not valid.';
        }

        
    }

    var imp;
    switch(state) {
        case 'uploaded': imp = 0; break;
        case 'reviewed': imp = 1; break;
        case 'approved': imp = 2; break; 
    }

    await db.query({table: 'dataset', sql: `UPDATE dataset SET imported = ? WHERE id = ? AND ${getAuthWhere(auth)}`, values: [imp] });

    // Transfering the data
    // TODO
    // USE job manager
    transferToData();
}

const transferToData = async function() {
    // TODO
    // INSERT INTO data (...) SELECT ... FROM import WHERE dataset_id = ?
    // DELETE FROM import WHERE dataset_id = ?
}
    
const uploadFile = async function(params, body, auth) {
    // TODO
    // uploads a file to already existing dataset
    // returns only a jobId that can be used to track the progress
    // in the background transfers rows from the file to the import table
}

const deleteRecords = async function(params, auth) {
    var id = parseInt(params.id);
    //https://www.mysqltutorial.org/mysql-delete-join/
    var r = await d.query({table, sql: `DELETE import FROM ${joind} WHERE dataset_id=? AND ${getAuthWhere(auth)}`, values: [id] });
    return {
        id
    }
}

const getRow = async function(params, auth) {
    var ds = parseInt(params.id);
    var row = parseInt(param.row);
    var aw = getAuthWhere(auth);
    // the dataset id is not really needed - the row IDs are autoincremented
    var results = await db.query({table: 'import', sql:`SELECT * FROM ${joind} WHERE dataset_id = ? AND id= ? AND ${aw}`, values: [ds, row], nestTables: true });
     var r = results[0];
     return { 
         item: r 
    }
}

const updateRow = async function(params, body, auth) {
    var ds = parseInt(params.id);
    var row = parseInt(param.row);
    var aw = getAuthWhere(auth);
    var newAttrs = body;
    delete(newAttrs.id);
    // the dataset id is not really needed - the row IDs are autoincremented
    var results = await db.query({table: 'import', sql:`UPDATE import FROM ${joind} SET ? WHERE dataset_id = ? AND id=? AND ${aw}`, values: [newAttrs, ds, row], nestTables: true });
    var r = results[0];
    validate(ds, auth);
    return { 
        item: r 
    }
}


const deleteRow = async function(params, auth) {
    var ds = parseInt(params.id);
    var row = parseInt(param.row);
    var aw = getAuthWhere(auth);
    // the dataset id is not really needed - the row IDs are autoincremented globally
    var results = await db.query({table: 'import', sql:`DELETE import FROM ${joind} WHERE dataset_id = ? AND id=? AND ${aw}`, values: [ds, row], nestTables: true });
     //var r = results[0];
     return {
        dataset: ds, 
        row 
    }
}

const updateColumn = async function(params, body, auth) {
    var ds = parseInt(params.id);
    var aw = getAuthWhere(auth);
    var column = db.escapeId(params.column);
    var ov = body.oldValue;
    var nv = body.newValue;

    var results = await db.query({table: 'import', sql:`UPDATE import FROM ${joind} SET ?? = ? WHERE dataset_id = ? AND ?? = ? AND ${aw}`, values: [column, nv, ds, column, ov], nestTables: true });
    
    // if needed, run the validation as a new job and return a job id
    validate(ds, auth); 
    return { 
        affected: results.affectedRows 
    }
}

const validate = async function(ds, auth) {
    // TODO
    // step 1: update all foreign keys
    var results = await db.query({table: 'import', sql:`UPDATE import FROM ${join} SET ?? = ? WHERE dataset_id = ? AND ?? = ? AND ${aw}`, values: [column, nv, ds, column, ov], nestTables: true });

    // step 2: set the valid attribute to 1 if all the necesssary foreign keys are filled in and other conditions are met

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
        updateColumn
    }
}