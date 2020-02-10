var db = null;

const getWhere = function(auth, showImport) {
    if(!auth || !showImport) {
        return 'imported = 1';
    }

    if(auth.isEditor && showImport) {
        return 'imported = 0';
    }
    if(auth.isContributor && showImport) {
        return `imported = 0 AND sub = ${db.escape(auth.user)}`;
    }
}

const list = async function(limits, auth, showImport) {
    var res = await db.prepareListResponse(limits, 'dataset');
    var where = getWhere(auth,showImport);
    //console.dir(res);
    var results = await db.query({table: 'dataset', sql: `SELECT dataset.id, dataset.name, dataset.authors, dataset.uploader, dataset.date, dataset.imported `
     + `FROM dataset WHERE ${where}`, limits, hasWhere: true });    
     res.items = results;
     res.items.foreach(r => {
         r.imported = r.imported > 0;
         // JavaScript dates are serialized badly in JSON
         r.date = r.date.valueOf();
     });

    return res;
}

const get = async function(params, auth, showImport) {
    var id = params.id;
    var where = getWhere(auth,showImport);
    var results = await db.query({table: 'dataset', sql: `SELECT * FROM dataset WHERE id = ? AND ${where}`, values: [id]});
     var r = results[0];
     r.imported = r.imported > 0;
     // JavaScript dates are serialized badly in JSON
     r.date = r.date.valueOf();
     return {
         item: r
     }
}

const prepareForSql = function(dataset) {
    dataset.imported = (dataset.imported) ? 1 : 0;
    dataset.date = new Date(dataset.date);
}

const create = async function(body) {
    return await db.createEntity(body, 'dataset', prepareForSql);
}

const update = async function(params, body) {
    return await db.updateEntity(params, body, 'dataset', prepareForSql);
}

const remove = async function(params) {
    return await db.deleteEntity(params, 'dataset');
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