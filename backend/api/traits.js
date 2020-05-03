var db = null;



const list = async function(limits) {
    const join = 'trait LEFT JOIN trait_category ON trait.trait_category_id = trait_category.id';
    
    var res = await db.prepareListResponse(limits, 'trait', null, null, join);
    
   var results = await db.query({table: 'trait', sql:`SELECT trait.id, trait.abbrev, trait.description, trait.name, trait_category.id, trait_category.name `
   + `FROM ${join}`, nestTables: true, limits });
   res.items = results.map(r => {    
    return {
        id: r.trait.id,
        abbrev: r.trait.abbrev,
        name: r.trait.name,
        description: r.trait.description,
        category: {
            id: r.trait_category.id,
            name: r.trait_category.name
        },
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

// validate trait - check if abbrev is unique
const validate = async function(trait) {
    if(!trait.abbrev || trait.abbrev.length == 0) {
        return 'Trait abbrev. cannot be empty';
    }

    if(trait.data_type_id == null) {
        return 'Trait data type cannot be empty';
    }

    if(trait.trait_category_id == null) {
        return 'Trait category cannot be empty';
    }

    var r = await db.query({table: 'trait', sql: 'SELECT trait.id FROM trait WHERE abbrev = ?', values: [trait.abbrev], nestTables: false});
    return (r.length == 0 || (trait.id && r[0].id == trait.id)) ? true : 'Trait abbrev. is already used.';
}

const prepareForSql = function(trait) {
    // prepare trait
    trait.trait_category_id = (trait.category) ? trait.category.id : null;
    trait.data_type_id = (trait.dataType) ? trait.dataType.id : null;
    delete trait.category;
    delete trait.dataType;
}

const create = async function(body) {
    return await db.createEntity({body, table: 'trait', prepareForSql, validate});
}

const update = async function(params, body) {
    return await db.updateEntity({params, body, table: 'trait', prepareForSql, validate});
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