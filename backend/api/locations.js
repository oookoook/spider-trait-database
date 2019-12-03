var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'trait');
    console.dir(res);
    var results = await db.query(`SELECT trait.id, trait.abbrev, trait.name, trait_category.id, trait_category.name `
     + `FROM trait LEFT JOIN trait_category ON trait.trait_category_id = trait_category.id LIMIT ${limits.offset},${limits.limit};`, [], true);    
     res.items = results.map(r => {    
        return {
                id: r.trait.id,
                abbrev: r.trait.abbrev,
                name: r.trait.name,
                category: {
                    id: r.trait_category.id,
                    name: r.trait_category.name
                }
            }
        });
    return res;
}

const get = async function(params) {
    var id = params.id;
    var results = await db.query('SELECT trait.*, trait_category.id, trait_category.name, data_type.id, data_type.name '
     + 'FROM trait LEFT JOIN trait_category ON trait.trait_category_id = trait_category.id LEFT JOIN data_type ON trait.data_type_id = data_type.id '
     + 'WHERE trait.id = ?', [id], true);
     console.dir(results);
     var r = results[0];
     return {
        id: r.trait.id,
        abbrev: r.trait.abbrev,
        name: r.trait.name,
        description: r.trait.description,
        standard: r.trait.standard,
        category: {
            id: r.trait_category.id,
            name: r.trait_category.name
        },
        dataType: {
            id: r.data_type.id,
            name: r.data_type.name
        }
    }
}

const prepareForSql = function(trait) {
    trait.trait_category_id = (trait.category) ? trait.category.id : null;
    trait.data_type_id = (trait.dataType) ? trait.dataType.id : null;
    delete(trait.id);
    delete(trait.category);
    delete(trait.dataType);
}

const create = function(body) {
    return await db.createEntity(body, prepareForSql);
}

const update = function(params, body) {
    return await db.updateEntity(body, prepareForSql);
}

const remove = function(params) {
    return await db.deleteEntity(params);
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