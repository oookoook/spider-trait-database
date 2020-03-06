var db = null;

const getWhere = function(auth, showImport) {
    if(!auth || !showImport) {
        return 'imported = 3';
    }

    if(auth.isEditor && showImport) {
        return 'imported < 3';
    }
    if(auth.isContributor && showImport) {
        return `sub = ${db.escape(auth.user)}`;
    }
}

const setState = function(r) {
    r.state = 'approved';
     if(r.imported == 0) {
         r.state = 'created';
     } else if(r.imported == 1) {
        r.state = 'rejected';
     } else if(r.imported == 2) {
         r.state = 'reviewed';
     }
     delete(r.imported);
}

const list = async function(limits, auth, showImport) {
    var res = await db.prepareListResponse(limits, 'dataset');
    var where = getWhere(auth,showImport);
    //console.dir(res);
    var results = await db.query({table: 'dataset', sql: `SELECT dataset.id, dataset.name, dataset.authors, dataset.uploader, dataset.date, dataset.imported `
     + `FROM dataset WHERE ${where}`, limits, hasWhere: true });    
     
     res.items = results;
     res.items.forEach(r => {
         setState(r);
         // JavaScript dates are serialized badly in JSON
         //console.log(r.date);
         r.date = r.date.toJSON();
     });

    return res;
}

const get = async function(params, auth, showImport) {
    var id = params.id;
    var where = getWhere(auth,showImport);
    var results = await db.query({table: 'dataset', sql: `SELECT * FROM dataset WHERE id = ? AND ${where}`, values: [id]});
     var r = results[0];
     
     if(showImport) {
        var validR = db.query({table: 'import', sql: `SELECT COUNT(import.valid) as invalid FROM `
        + `import LEFT JOIN dataset ON import.dataset_id = dataset.id WHERE dataset.id = ? AND ${where} AND valid=0`, values: [id]});
       r.valid = validR.results[0].invalid == 0;
    }
     
     setState(r);
     // JavaScript dates are serialized badly in JSON
     r.date = r.date.valueOf();
     return {
         item: r
     }
}

const prepareForCreate = function(dataset, auth) {
    dataset.imported = 0;
    dataset.sub = auth.sub;
    dataset.name = db.unique(dataset.name);
    dataset.date = new Date();
}

const prepareForUpdate = function(dataset, auth) {
    // state cant be changed here
    delete(dataset.state);
    delete(dataset.sub);
    delete(dataset.date);
}



const create = async function(body, auth) {
    return await db.createEntity({ body, table: 'dataset', auth, prepareForSql: prepareForCreate });
}

const update = async function(params, body, auth) {
    return await db.updateEntity({params, body, table: 'dataset', auth, prepareForSql: prepareForUpdate });
}

const remove = async function(params, auth) {
    // delete all the records in the import and data tables
    var id = parseInt(params.id);
    var aw = getWhere(auth, true);
    await db.query({table: 'import', sql: `DELETE import FROM import JOIN dataset ON import.dataset_id = dataset.id WHERE dataset_id = ? AND ${aw}`, values: [id] });
    await db.query({table: 'data', sql: `DELETE data FROM data JOIN dataset ON data.dataset_id = dataset.id WHERE dataset_id = ? AND ${aw}`, values: [id] });

    return await db.deleteEntity({params, table: 'dataset', auth});
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('datasets', 'dataset', {});
    return {
        list,
        get,
        create,
        update,
        remove
    }
}