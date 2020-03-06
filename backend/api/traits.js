var db = null;



const list = async function(limits) {
    const join = 'trait LEFT JOIN trait_category ON trait.trait_category_id = trait_category.id '
               + 'LEFT JOIN reference ON trait.reference_id = reference.id';
    
    var res = await db.prepareListResponse(limits, 'trait', null, null, join);
    
   var results = await db.query({table: 'trait', sql:`SELECT trait.id, trait.abbrev, trait.name, trait_category.id, trait_category.name, reference.id, reference.abbrev `
   + `FROM ${join}`, nestTables: true, limits });
   res.items = results.map(r => {    
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
    });   


    return res;
}

const get = async function(params) {
    var id = parseInt(params.id);
    var results = await db.query({table: 'trait', sql:'SELECT trait.*, trait_category.id, trait_category.name, data_type.id, data_type.name, reference.id, reference.abbrev, reference.full_citation '
     + 'FROM trait LEFT JOIN trait_category ON trait.trait_category_id = trait_category.id LEFT JOIN data_type ON trait.data_type_id = data_type.id '
     + 'LEFT JOIN reference ON trait.reference_id = reference.id '
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
        },
        reference: r.reference.id ? {
            id: r.reference.id,
            abbrev: r.reference.abbrev,
            fullCitation: r.reference.full_citation
        } : null
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
    return await db.createEntity({body, table: 'trait', prepareForSql});
}

const update = async function(params, body) {
    return await db.updateEntity({params, body, table: 'trait', prepareForSql});
}

const remove = async function(params) {
    return await db.deleteEntity({params, table: 'trait'});
}

const synonyms = {
    'traits': 'trait',
    'category.name': 'trait_category.name',
    'category.id': 'trait_category.id',
    'dataType.name': 'data_type.name',
    'reference.abbrev': 'reference.abbrev'
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('traits','trait', synonyms);
    return {
        list,
        get,
        create,
        update,
        remove,
        synonyms
    }
}