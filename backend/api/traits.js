var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'trait');
    var results = await db.query({table: 'trait', sql: `SELECT trait.id, trait.abbrev, trait.name, trait_category.id, trait_category.name `
     + `FROM trait LEFT JOIN trait_category ON trait.trait_category_id = trait_category.id`, nestTables: true, limits });    
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
    var id = parseInt(params.id);
    var results = await db.query({table: 'trait', sql:'SELECT trait.*, trait_category.id, trait_category.name, data_type.id, data_type.name '
     + 'FROM trait LEFT JOIN trait_category ON trait.trait_category_id = trait_category.id LEFT JOIN data_type ON trait.data_type_id = data_type.id '
     + 'WHERE trait.id = ?', values: [id], nestTables: true });
     var r = results[0];
     return { item: {
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
    }}
}

const prepareForSql = function(trait) {
    trait.trait_category_id = (trait.category) ? trait.category.id : null;
    trait.data_type_id = (trait.dataType) ? trait.dataType.id : null;
    delete trait.id;
    delete trait.category;
    delete trait.dataType;
}

const create = async function(body) {
    return await db.createEntity(body, 'trait', prepareForSql);
}

const update = async function(params, body) {
    return await db.updateEntity(params, body, 'trait', prepareForSql);
}

const remove = async function(params) {
    return await db.deleteEntity(params, 'trait');
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