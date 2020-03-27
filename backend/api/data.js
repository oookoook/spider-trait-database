var db = null;

const csvu = require('../util/csv');

var join = `data `
+ `LEFT JOIN taxonomy ON data.taxonomy_id = taxonomy.id `
+ `LEFT JOIN trait ON data.trait_id = trait.id `
+ `LEFT JOIN trait_category ON trait.trait_category_id = trait_category.id `
+ `LEFT JOIN measure ON data.measure_id = measure.id `
+ `LEFT JOIN sex ON data.sex_id = sex.id `
+ `LEFT JOIN life_stage ON data.life_stage_id = life_stage.id `
+ `LEFT JOIN method ON data.method_id = method.id `
+ `LEFT JOIN location ON data.location_id = location.id `
+ `LEFT JOIN habitat_global ON location.habitat_global_id = habitat_global.id `
+ `LEFT JOIN country ON location.country_id = country.id `
+ `LEFT JOIN dataset ON data.dataset_id = dataset.id `
+ `LEFT JOIN reference ON data.reference_id = reference.id`;

const getCondition = function(params) {
    var p = ['family','genus', 'species', 'traitcat', 'trait', 'country', 'habitat', 'dataset', 'authors', 'reference', 'rowl'];
    var f = ['taxonomy.family', 'taxonomy.genus', 'taxonomy.species', 'trait.trait_category_id', 'data.trait_id', 'country.id', 
    'habitat_global.id', 'dataset.id', 'dataset.authors', 'data.reference_id', 'data.row_link']

    var cl = ['1=1'];
    var val = [];
    p.forEach((item, index) => {
        if(params[item] != '*') {
            cl.push(`${f[index]} = ?`); 
            val.push(f[index].indexOf('_id') > 0 || f[index].indexOf('_link') > 0 ? parseInt(params[item]) : decodeURIComponent(params[item]));
        }
    });
    return { clause: cl.join(' AND '), values: val};
} 

const list = async function(params, limits) {
    var cond = getCondition(params);
    var res = await db.prepareListResponse(limits, 'data', cond.clause, cond.values, join);
    var results = await db.query({ table: 'data', sql: `SELECT data.*, taxonomy.wsc_id, taxonomy.wsc_lsid, taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `trait.id, trait.abbrev, trait.name, trait_category.id, trait_category.name, `
     + `measure.id, measure.name, sex.id, sex.name, life_stage.id, life_stage.name, method.id, method.abbrev, method.name, `
     + `event_date_text, event_date_start, event_date_end, `
     + `location.id, location.locality, habitat_global.id, habitat_global.name, country.id, country.alpha3_code, country.name, `
     + `dataset.id, dataset.name, dataset.authors, reference.id, reference.abbrev `
     + `FROM ${join} WHERE ${cond.clause}`
     , values: cond.values, nestTables: true, limits, hasWhere: true});    
     res.items = results.map(r => {    
        return {
                id: r.data.id,
                originalName: r.data.original_name,
                value: r.data.value_numeric ? r.data.value_numeric : r.data.value,
                frequency: r.data.frequency,
                sampleSize: r.data.sample_size,
                eventDate: { 
                    text: r.data.event_date_text,
                    start: r.data.event_date_start ? r.data.event_date_start.toJSON() : null,     
                    end: r.data.event_date_end ? r.data.event_date_end.toJSON() : null
                },
                taxonomy: {
                    wsc: {
                        id: r.taxonomy.wsc_id,
                        lsId: r.taxonomy.wsc_lsid,
                    },
                    /*
                    family: taxonomy.family, 
                    genus: taxonomy.genus, 
                    species: taxonomy.species, 
                    subspecies: taxonomy.subspecies,
                    */
                    originalName: r.data.original_name,
                    id: r.taxonomy.id
                },
                trait: {
                    id: r.trait.id,
                    abbrev: r.trait.abbrev,
                    name: r.trait.name,
                    category: r.trait_category
                },
                measure: r.measure,
                sex: r.sex,
                lifeStage: r.life_stage,
                method: r.method,
                location: {
                    id: r.location.id,
                    abbrev: r.location.abbrev,
                    locality: r.location.locality,
                    country: {
                        id: r.country.id,
                        name: r.country.name,
                        code: r.country.alpha3_code
                    },
                    habitatGlobal: r.habitat_global,
                },
                dataset: r.dataset,
                reference: r.reference,
                rowLink: r.data.row_link
            }
        });
    return res;
}

const csv =  async function(params, limits, tmpDir) {
    var cond = getCondition(params);
    var res = await db.prepareListResponse(limits, 'data', cond.clause, cond.values, join);
    limits.limit = res.count;
    var c = await db.getConnection();
    var dstream = db.squery(c, { table: 'data', sql: `SELECT data.id, taxonomy.wsc_lsid, data.original_name as originalName, `
     + `taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `trait.abbrev as trait, trait.name as traitFullName, trait_category.name as traitCategory, data.value, data.value_numeric, `
     + `measure.name as measure, sex.name as sex, life_stage.name as lifeStage, data.frequency, data.sample_size as sampleSize, method.abbrev as method, method.name as methodFullName, `
     + `event_date_text as eventDateText, event_date_start as eventDateStart, event_date_end as eventDateEnd, `
     + `location.abbrev as location, location.lat as decimalLatitude, location.lon as decimalLongitude, location.precision as coordinatePrecision, location.altitude, location.locality as verbatimLocality, `
     + `country.alpha3_code as countryCode, country.name as countryName, habitat_global.name as habitatGlobal, habitat_global.number as habitatGlobalNumber,`
     + `location.habitat as habitatVerbatim, location.microhabitat as microhabitatVerbatim, location.stratum as stratumVerbatim, location.note as notePosition, `
     + `dataset.id as dataset, dataset.name as datasetName, reference.abbrev as reference, reference.full_citation as referenceFull, reference.doi as referenceDOI, data.row_link as rowLinks `
     + `FROM ${join} WHERE ${cond.clause}`
     , values: cond.values, nestTables: false, limits, hasWhere: true});
    
    var f = await csvu.get(tmpDir, `spider-traits-${Date.now()}.csv`, dstream, c);
    db.releaseConnection(c);
    return f;
}

const synonyms = {
    /*
    'trait.id': 'trait.id',
    'trait.abbrev': 'trait.abrev',
    'trait.name': 'trait.name',
    'taxonomy.family': 'taxonomy.family', 
    */
    'rowLink': 'row_link',
    'originalName': 'original_name',
    'location.habitatGlobal.id': 'habitat_global.id',
    'location.habitatGlobal.name': 'habitat_global.name',
    'location.habitatGlobal.category': 'habitat_global.category',
    'location.habitatGlobal.number': 'habitat_global.number',
    'location.country.id': 'country.id',
    'location.country.code': 'country.alpha3_code',
    'location.country.name': 'country.name',
    'trait.category.id':'trait_category.id',
    'trait.category.name':'trait_category.name',
    'lifeStage.name':'life_stage.name',
    'taxon': 'original_name',
    'location': 'location.abbrev',
    'method': 'method.abbrev',
    'reference': 'reference.abbrev',
    'trait': 'trait.abbrev',
    'dataset': 'dataset.name'
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('data','data', synonyms);
    return {
        list,
        csv
    }
}