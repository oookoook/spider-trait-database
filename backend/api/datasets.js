var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'dataset');
    console.dir(res);
    var results = await db.query({table: 'dataset', sql: `SELECT dataset.id, dataset.name, dataset.authors, dataset.uploader, dataset.date, dataset.imported `
     + `FROM dataset`, limits});    
     res.items = results;
     res.items.foreach(r => {
         r.imported = r.imported > 0;
         // JavaScript dates are serialized badly in JSON
         r.date = r.date.valueOf();
     });

    return res;
}

const get = async function(params) {
    var id = params.id;
    var results = await db.query({table: 'dataset', sql: 'SELECT * FROM dataset WHERE id = ?', values: [id]});
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
    return {
        list,
        get,
        create,
        update,
        remove
    }
}