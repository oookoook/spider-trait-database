var db = null;
const { getFullName } = require('../util/taxonomy-common');

const validName = async function(params, query) {
    console.dir(query);
    let taxon = params.taxon || query.taxon;
    var results = await db.query({table: 'taxonomy', sql: 'SELECT synonyms.*, valid.* '
     + 'FROM taxonomy synonyms LEFT JOIN taxonomy valid ON synonyms.valid_id = valid.id '
     + 'WHERE synonyms.full_name = ?', values: [taxon], nestTables: true});
     if(results.length > 0) {
        var r = results[0];
        console.dir(r);
        if(r.valid.id) {
            return { item: {
                id: r.valid.id,
                lsid: r.valid.wsc_lsid,
                valid: r.valid.valid == 1,
                order: r.valid.order,
                family: r.valid.family,
                genus: r.valid.genus,
                species: r.valid.species,
                subspecies: r.valid.subspecies,
                author: r.valid.author,
                year: r.valid.year
            }}    
        } else if(!r.synonyms.valid_id && r.synonyms.id) {
            return { item: {
                id: r.synonyms.id,
                lsid: r.synonyms.wsc_lsid,
                valid: r.synonyms.valid == 1,
                order: r.synonyms.order,
                family: r.synonyms.family,
                genus: r.synonyms.genus,
                species: r.synonyms.species,
                subspecies: r.synonyms.subspecies,
                author: r.synonyms.author,
                year: r.synonyms.year
            }}
        } 
    } else {
            // query the taxonomy name table
            console.log(`Querying taxonomy_name for ${taxon}`)
            results = await db.query({table: 'taxonomy', sql: 'SELECT DISTINCT valid.* '
            + 'FROM taxonomy_name synonyms LEFT JOIN taxonomy valid ON synonyms.taxonomy_id = valid.id '
            + 'WHERE synonyms.name = ?', values: [taxon], nestTables: true});
            if(results.length == 0) {
                return { item: null };
            }
            /*
            var r = results[0];
            console.dir(r);
            if(!r.valid.id) {
                return { item: null };
            }
            return { item: {
                id: r.valid.id,
                lsid: r.valid.wsc_lsid,
                valid: r.valid.valid == 1,
                order: r.valid.order,
                family: r.valid.family,
                genus: r.valid.genus,
                species: r.valid.species,
                subspecies: r.valid.subspecies,
                author: r.valid.author,
                year: r.valid.year
            }}
            */
           let res = { combinations: true, items: [] };
           results.forEach(r => {
            if(!r.valid.id) {
                return;
            }
            res.items.push({
                id: r.valid.id,
                lsid: r.valid.wsc_lsid,
                valid: r.valid.valid == 1,
                order: r.valid.order,
                family: r.valid.family,
                genus: r.valid.genus,
                species: r.valid.species,
                subspecies: r.valid.subspecies,
                author: r.valid.author,
                year: r.valid.year
            })
           });
           // just to maintain backward compatibility
           
           res.item = res.items.length > 0 ? res.items[0] : null;
           return res;
        }
}

const list = async function(limits) {
    var res = await db.prepareListResponse(limits, 'taxonomy');
    var results = await db.query({table: 'taxonomy', sql: `SELECT taxonomy.id, taxonomy.wsc_lsid, taxonomy.valid, `
     + `taxonomy.valid_id, taxonomy.order, taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `taxonomy.author, taxonomy.year `
     + `FROM taxonomy`, nestTables: true, limits});    
     res.items = results.map(r => {    
        return {
                id: r.taxonomy.id,
                lsid: r.taxonomy.wsc_lsid,
                synchronized: !!r.taxonomy.wsc_lsid,
                valid: r.taxonomy.valid == 1,
                validTaxon: { id: r.taxonomy.valid_id },
                order: r.taxonomy.order,
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
        validTaxon: { id: r.taxonomy.valid_id },
        order: r.taxonomy.order,
        family: r.taxonomy.family,
        genus: r.taxonomy.genus,
        species: r.taxonomy.species,
        subspecies: r.taxonomy.subspecies,
        author: r.taxonomy.author,
        year: r.taxonomy.year
    }}
}

/*
Data manipulating methods should not be called from the API for certain record - AraneaetTaxonomy will be synchronized with the World Spider Catalog database

REJECT updates and creations where order == Araneae (in validate)

CONSTRUCT full name in prepareForSql

*/


const validate = async function(taxon) {
    if(!taxon.order || taxon.order.length == 0) {
        return 'Order cannot be empty.';
    }

    if(!taxon.family || taxon.family.length == 0) {
        return 'Family cannot be empty.';
    }

    if(taxon.id) {
        // updating check the original record
        var r = await db.query({table: 'taxonomy', sql: 'SELECT id, wsc_lsid FROM taxonomy WHERE id = ?', values: [taxon.id], nestTables: false});
        if(r.wsc_lsid != null) {
            return 'Unable to update taxon synchronized with WSC'
        }    
    } else {
        // check if both order aranae and wsc_lsid are not present
        if(taxon.order.toLowerCase().trim() == 'araneae') {
            return 'Unable to create taxon in the Araneae order - taxons are synchronized with the WSC.'
        }
        if(taxon.lsid) {
            return 'Unable to create taxon with the LSID filled in - taxons are synchronized automatically.'
        } 
    }

    return true;
}

const validateDelete = async function(id) {
    var r = await db.query({table: 'taxonomy', sql: 'SELECT id, wsc_lsid FROM taxonomy WHERE id = ?', values: [id], nestTables: false});
    //console.dir(r);
    if(r.wsc_lsid != null) {
        return 'Unable to update taxon synchronized with WSC'
    }
    return true;
}

const prepareForSql = function(taxon) {
    if(taxon.taxon) {
        Object.assign(taxon, getTaxonFromFullName(taxon.taxon));
    }
    
    // trim + capitalize first letter in names
    ['order', 'family', 'genus', 'species', 'subspecies'].forEach(k => {
        if(!taxon[k]) {
            return;
        }
        // this comes from autocomplete from add new taxon view - creates object such as: {order: {order: "Opiliones"}, family: {family: "Kimulidae"}, genus: "Genux", species: "Specux" }
        if(taxon[k][k]) {
            taxon[k] = taxon[k][k];
        }
        var trimmed = taxon[k].trim();
        if(trimmed.length == 0) {
            taxon[k] = null;
            return;
        }
        taxon[k] = trimmed.slice(0,1).toUpperCase() + trimmed.slice(1).toLowerCase();
    });

    // validity
    if(taxon.validTaxon && taxon.validTaxon.id) {
        taxon.valid_id = taxon.validTaxon.id;
        taxon.valid = 0;
    } else {
        taxon.valid = 1;
    }
    delete(taxon.validTaxon);
    delete(taxon.lsid);
    delete(taxon.originalName);
    delete(taxon.taxon);
    delete(taxon.synchronized);
    // full name
    taxon.full_name = getFullName(taxon);
    
}

const create = async function(body, auth) {
    return await db.createEntity({ body, table: 'taxonomy', auth, prepareForSql, validate});
}

const update = async function(params, body, auth) {
    return await db.updateEntity({params, body, table: 'taxonomy', auth, prepareForSql, validate});
}

const remove = async function(params, auth) {
    return await db.deleteEntity({params, table: 'taxonomy', auth, validate: validateDelete });
}



const getTaxonFromFullName = function(fullName) {
    var parts = fullName.split(' ');
    var taxon = {};
    ['genus', 'species', 'subspecies'].forEach((p, i) => {
        taxon[p] = i < parts.length && !['sp', 'sp.'].includes(parts[i].toLowerCase()) ? parts[i] : null
    });
    return taxon;
}

const synonyms = {
    //'wsc.lsid': 'taxonomy.wsc_lsid',
    'lsid': 'wsc_lsid',
    'fullName': 'taxonomy.full_name',
    'taxonomy.fullName': 'taxonomy.full_name'
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('taxonomy','taxonomy', synonyms);
    return {
        list,
        get,
        create,
        update,
        remove,
        getFullName,
        getTaxonFromFullName,
        validName
    }
}