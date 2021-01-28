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
+ `LEFT JOIN country ON data.country_id = country.id `
+ `LEFT JOIN dataset ON data.dataset_id = dataset.id `
+ `LEFT JOIN reference ON data.reference_id = reference.id`;

const statsTypes = ['group-by', 'distinct'];


const paramList = ['order','family','genus', 'species', 'origname', 'traitcat', 'trait', 'method', 'location','country', 'dataset', 'authors', 'reference', 'rowl'];
const columnList = ['taxonomy.order','taxonomy.family', 'taxonomy.genus', 'data.taxonomy_id', 'data.original_name', 'trait.trait_category_id', 'data.trait_id', 'method.id', 'location.id', 'country.id', 
'dataset.id', 'dataset.authors', 'data.reference_id', 'data.row_link'];

const getCondition = function(params) {
    var p = paramList;
    var f = columnList;

    var cl = ['1=1'];
    var val = [];
    p.forEach((item, index) => {
        if(params[item] != '*' && !statsTypes.includes(params[item])) {
            cl.push(`${f[index]} = ?`); 
            val.push(f[index].indexOf('_id') > 0 || f[index].indexOf('_link') > 0 ? parseInt(params[item]) : decodeURIComponent(params[item]));
        }
    });
    return { clause: cl.join(' AND '), values: val};
} 

const list = async function(params, limits) {
    var cond = getCondition(params);
    //console.dir(cond);
    var res = await db.prepareListResponse(limits, 'data', cond.clause, cond.values, join);
    var results = await db.query({ table: 'data', sql: `SELECT data.*, taxonomy.wsc_lsid, taxonomy.order, taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `trait.id, trait.abbrev, trait.name, trait_category.id, trait_category.name, `
     + `measure.id, measure.name, sex.id, sex.name, life_stage.id, life_stage.name, method.id, method.abbrev, method.name, `
     //+ `event_date_text, event_date_start, event_date_end, note, `
     + `location.id, location.abbrev, country.id, country.alpha3_code, country.name,`
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
                treatment: r.data.treatment,
                eventDate: { 
                    text: r.data.event_date_text,
                    start: r.data.event_date_start ? r.data.event_date_start.toJSON() : null,     
                    end: r.data.event_date_end ? r.data.event_date_end.toJSON() : null
                },
                taxonomy: {
                    lsid: r.taxonomy.wsc_lsid,
                    order: r.taxonomy.order,
                    family: r.taxonomy.family, 
                    genus: r.taxonomy.genus, 
                    species: r.taxonomy.species, 
                    subspecies: r.taxonomy.subspecies,
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
                },
                altitude: r.data.altitude,
                locality: r.data.locality,
                habitat: r.data.habitat,
                microhabitat: r.data.microhabitat,
                country: {
                    id: r.country.id,
                    name: r.country.name,
                    code: r.country.alpha3_code
                },
                dataset: r.dataset,
                reference: {
                    id: r.reference.id,
                    abbrev: r.reference.abbrev,
                },
                note: r.data.note,
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
     + `taxonomy.order, taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `trait.abbrev as trait, trait.name as traitFullName, trait_category.name as traitCategory, data.value, data.value_numeric, `
     + `measure.name as measure, sex.name as sex, life_stage.name as lifeStage, data.frequency, data.sample_size as sampleSize, `
     + `data.treatment as treatment, method.abbrev as method, method.name as methodFullName, `
     + `event_date_text as dateText, event_date_start as dateStart, event_date_end as dateEnd, data.note, `
     + `location.abbrev as location, location.lat as decimalLatitude, location.lon as decimalLongitude, data.altitude, data.locality as verbatimLocality, `
     + `country.alpha3_code as countryCode, country.name as countryName, `
     + `data.habitat as habitatVerbatim, data.microhabitat as microhabitatVerbatim, `
     + `dataset.name as datasetName, reference.abbrev as reference, reference.full_citation as referenceFull, reference.doi as referenceDOI, data.row_link as rowLinks `
     + `FROM ${join} WHERE ${cond.clause}`
     , values: cond.values, nestTables: false, limits, hasWhere: true});
    
    var f = await csvu.get(tmpDir, `watdb-${Date.now()}.csv`, dstream, c);
    db.releaseConnection(c);
    return f;
}

const excel =  async function(params, limits, tmpDir) {
    var cond = getCondition(params);
    var res = await db.prepareListResponse(limits, 'data', cond.clause, cond.values, join);
    limits.limit = res.count;
    var records = await db.query({ table: 'data', sql: `SELECT data.id, taxonomy.wsc_lsid, data.original_name as originalName, `
     + `taxonomy.order, taxonomy.family, taxonomy.genus, taxonomy.species, taxonomy.subspecies, `
     + `trait.abbrev as trait, trait.name as traitFullName, trait_category.name as traitCategory, data.value, data.value_numeric, `
     + `measure.name as measure, sex.name as sex, life_stage.name as lifeStage, data.frequency, data.sample_size as sampleSize, `
     + `data.treatment as treatment, method.abbrev as method, method.name as methodFullName, `
     + `event_date_text as dateText, event_date_start as dateStart, event_date_end as dateEnd, data.note, `
     + `location.abbrev as location, location.lat as decimalLatitude, location.lon as decimalLongitude, data.altitude, data.locality as verbatimLocality, `
     + `country.alpha3_code as countryCode, country.name as countryName, `
     + `data.habitat as habitatVerbatim, data.microhabitat as microhabitatVerbatim, `
     + `dataset.name as datasetName, reference.abbrev as reference, reference.full_citation as referenceFull, reference.doi as referenceDOI, data.row_link as rowLinks `
     + `FROM ${join} WHERE ${cond.clause}`
     , values: cond.values, nestTables: false, limits, hasWhere: true});
    
    var f = await csvu.excel(tmpDir, `watdb-${Date.now()}.xlsx`, records);
    
    return f;
}

const getMinMaxValue = async function(cond) {
    var r = await db.query({ table: 'data', sql: `SELECT MIN(value_numeric) as min, MAX(value_numeric) as max `
     + `FROM ${join} WHERE ${cond.clause}`
     , values: cond.values, nestTables: false, hasWhere: true});
     return r.length ? { min: r[0].min, max: r[0].max } : null;
}

const stats =  async function(params, query) {
    var cond = getCondition(params);
    var select = null;
    var hasDistinct = false;
    var distinctColumn = null;
    var hasGroup = false;
    var groupByColumn = null;
    var group = '';
    var hasData  =  false;
    var min, max, binSize;
    // valid values: 'count','hist-real', hist-int, 'hist-percent, hist-category
    var statsType = params.type;
    // there might be columns marked as group-by or distinct
    if(statsType == 'count') {
    paramList.forEach((e, i) => {
            if(params[e] == 'group-by') {
                hasGroup = true;
                groupByColumn = columnList[i];
            }
            if(params[e] == 'distinct') {
                hasDistinct = true;
                distinctColumn = columnList[i];
            }
    });
    }

    switch(statsType) {
        //https://stackoverflow.com/questions/1764881/getting-data-for-histogram-plot
        case 'count': 
            break;
        case 'hist-percent':
            // get 10 buckets from 0 to 1
            groupByColumn = 'FLOOR(value_numeric * 10) as bin';
            break;
        case 'hist-real':
            // count the bucket size  
            var mm = await getMinMaxValue(cond);
            if(mm) {
                hasData = true;
                min = mm.min;
                max = mm.max;
                if(min != max) {
                  var diff = max - min;
                  binSize = diff / 10;  
                } else {
                    binSize = 1;
                }
            } else {
                min = 0;
                max = 1;
                binSize = 1;
            }
            hasGroup = true;
            groupByColumn = `${min}+FLOOR((value_numeric-${min})/${binSize})*${binSize} as bin`;  
            break;
        case 'hist-int':
            // c ount the bucket size  
            var mm = await getMinMaxValue(cond);
            if (mm) {
                min = mm.min;
                max = mm.max;
                if(min != max) {
                    var diff = max - min;
                    binSize = Math.round(diff / 10);  
                } else {
                    binSize = 1;
                }
                var diff = max - min;
                
            } else {
                min = 0;
                max = 1;
                binSize = 1;    
            }
            hasGroup = true;
            groupByColumn = `${min}+FLOOR((value_numeric-${min})/${binSize})*${binSize} as bin`;
            break;
        case 'hist-category':
            hasGroup = true;
            hasDistinct = false;
            groupByColumn = 'value as bin';
            break;
    }

    if(hasDistinct) {
        select = `COUNT(DISTINCT(${distinctColumn})) as count`;
    } else {
        select =  'COUNT(*) as count';
    }
    if(hasGroup) {
        select = groupByColumn + ', '+ select;
        group = `GROUP BY 1 ORDER BY 1`;
    }
    var sql = `SELECT ${select} FROM ${join} WHERE ${cond.clause} ${group}`;
    //console.log(sql);
    var records = await db.query({ table: 'data', sql, values: cond.values, nestTables: false, hasWhere: true});
    
    var data = { items: records }
    if(min && max && binSize) {
        data.min = min;
        data.max = max;
        data.binSize = binSize;
    }
    return data;
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
    'country.code': 'country.alpha3_code',
    'trait.category.id':'trait_category.id',
    'trait.category.name':'trait_category.name',
    'lifeStage.name':'life_stage.name',
    'taxon': 'taxonomy.wsc_lsid',
    'location': 'location.abbrev',
    'method': 'method.abbrev',
    'reference': 'reference.abbrev',
    'reference.fullCitation':  'reference.full_citation',
    'trait': 'trait.abbrev',
    'dataset': 'dataset.name',
    //'taxonomy.wsc.lsid': 'taxonomy.wsc_lsid',
    'taxonomy.lsid': 'taxonomy.wsc_lsid',
    'taxonomy.fullName': 'taxonomy.full_name',
    'sampleSize': 'sample_size',
    'eventDate.text': 'event_date_text',
    'eventDate.start': 'event_date_start',
    'eventDate.end': 'event_date_end',
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('data','data', synonyms);
    return {
        list,
        csv,
        excel,
        stats
    }
}