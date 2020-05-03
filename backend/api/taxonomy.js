var db = null;

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'taxonomy');
    var results = await db.query({table: 'taxonomy', sql: `SELECT taxonomy.id, taxonomy.wsc_lsid, taxonomy.valid, `
     + `taxonomy.valid_id, taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `taxonomy.author, taxonomy.year `
     + `FROM taxonomy`, nestTables: true, limits});    
     res.items = results.map(r => {    
        return {
                id: r.taxonomy.id,
                lsid: r.taxonomy.wsc_lsid,
                valid: r.taxonomy.valid == 1,
                validId: r.taxonomy.valid_id,
                family: r.taxonomy.family,
                genus: r.taxonomy.genus,
                species: r.taxonomy.species,
                subspecies: r.taxonomy.subspecies,
                author: r.taxonomy.author,
                year: r.taxonomy.year
            }
        });
    return res;
}

const get = async function(params) {
    var id = params.id;
    var results = await db.query({table: 'taxonomy', sql: 'SELECT taxonomy.* '
     + 'FROM taxonomy '
     + 'WHERE taxonomy.id = ?', values: [id], nestTables: true});
     var r = results[0];
     return { item: {
        id: r.taxonomy.id,
        lsid: r.taxonomy.wsc_lsid,
        valid: r.taxonomy.valid == 1,
        validId: r.taxonomy.valid_id,
        family: r.taxonomy.family,
        genus: r.taxonomy.genus,
        species: r.taxonomy.species,
        subspecies: r.taxonomy.subspecies,
        author: r.taxonomy.author,
        year: r.taxonomy.year
    }}
}

const prepareForSql = function(trait) {
    trait.trait_category_id = (trait.category) ? trait.category.id : null;
    trait.data_type_id = (trait.dataType) ? trait.dataType.id : null;
    delete(trait.id);
    delete(trait.category);
    delete(trait.dataType);
}

/*
Data manipulating methods should not be called from the API - Taxonomy will be synchronized with the World Spider Catalog database

*/
const synonyms = {
    'wsc.lsid': 'taxonomy.wsc_lsid',
    'fullName': 'taxonomy.full_name',
    'taxonomy.fullName': 'taxonomy.full_name'
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('taxonomy','taxonomy', synonyms);
    return {
        list,
        get,
        //create,
        //update,
        //remove
    }
}