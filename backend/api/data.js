var db = null;

const fcsv = require('fast-csv');
const settings = require('../settings');
const path = require('path');

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
    var results = await db.query({ table: 'data', sql: `SELECT data.*, taxonomy.wsc_lsid, taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `trait.id, trait.abbrev, trait.name, trait_category.id, trait_category.name, `
     + `measure.id, measure.name, sex.id, sex.name, life_stage.id, life_stage.name, method.id, method.abbrev, method.name, `
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
                    start: r.data.event_date_start.valueOf(), 
                    end: r.data.event_date_end.valueOf()
                },
                taxonomy: r.taxonomy,
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
                    locality: r.location.locality,
                    country: {
                        id: r.country.id,
                        name: r.country.name,
                        code: r.country.alpha3_code
                    },
                    habitatGlobal: r.habitat_global,
                },
                dataset: r.dataset,
                reference: r.reference
            }
        });
    return res;
}

const csv =  async function(params, limits) {
    var cond = getCondition(params);
    var res = await db.prepareListResponse(limits, 'data', cond.clause, cond.values, join);
    limits.limit = res.count;

    // TODO column names
    // TODO full location
    // TODO full reference

    var results = await db.query({ table: 'data', sql: `SELECT data.*, taxonomy.wsc_lsid, taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `trait.id, trait.abbrev, trait.name, trait_category.id, trait_category.name, `
     + `measure.id, measure.name, sex.id, sex.name, life_stage.id, life_stage.name, method.id, method.abbrev, method.name, `
     + `location.id, location.locality, habitat_global.id, habitat_global.name, country.id, country.alpha3_code, country.name, `
     + `dataset.id, dataset.name, dataset.authors, reference.id, reference.abbrev `
     + `FROM ${join} WHERE ${cond.clause}`
     , values: cond.values, nestTables: false, limits, hasWhere: true});
    
    var p = path.resolve(settings.export.tmpDir, `spider-traits-${new Date().valueOf()}.csv`);
    await new Promise((resolve, reject) => {
        fcsv.writeToPath(p, results, {headers: true})
        .on('error', err => reject(err))
        .on('finish', () => resolve(path));
    });
    return p;
}

module.exports = function(dbClient) {
    db = dbClient;
    return {
        list,
        csv
    }
}