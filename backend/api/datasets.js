var db = null;

const fs = require('fs').promises;
const path = require('path');
const doi = require('../util/doi');

const getWhere = function(auth, showImport, remove) {
    if(!auth || !showImport) {
        return 'imported = 3';
    }

    if(auth.isEditor && showImport) {
        return '1=1';
    }
    if(auth.isContributor && showImport) {
        var q = remove ? 'imported < 3 AND ' : '';
        return `${q}sub = ${db.escape(auth.sub)}`;
    }
}

const setState = function(r) {
    r.state = 'approved';
     if(r.imported == 0) {
         r.state = 'created';
     } else if(r.imported == 1) {
        r.state = 'rejected';
     } else if(r.imported == 2) {
         r.state = 'reviewed';
     }
     delete(r.imported);
}

const list = async function(limits, auth, showImport) {
    var where = getWhere(auth,showImport);
    var res = await db.prepareListResponse(limits, 'dataset', where);
    
    //console.dir(res);
    var results = await db.query({table: 'dataset', sql: `SELECT dataset.id, dataset.name, dataset.authors, dataset.uploader, `
                        +`dataset.email, dataset.date, dataset.doi, dataset.message, dataset.notes, dataset.imported, dataset.records, dataset.restricted `
                        + `FROM dataset WHERE ${where}`, limits, hasWhere: true });    
     
     res.items = results;
     res.items.forEach(r => {
         setState(r);
         // JavaScript dates are serialized badly in JSON
         //console.log(r.date);
         r.restricted = r.restricted == 1,
         r.date = r.date.toJSON();
     });

    return res;
}

const get = async function(params, auth, showImport) {
    var id = params.id;
    var where = getWhere(auth,showImport);
    var results = await db.query({table: 'dataset', sql: `SELECT * FROM dataset WHERE id = ? AND ${where}`, values: [id]});
     var r = results[0];
     
     if(!r) {
         throw 'Dataset does not exist';
     }

     r.valid = {};
     if(showImport) {

        var validR = await db.query({table: 'import', sql: `SELECT COUNT(import.valid) as invalid FROM `
        + `import LEFT JOIN dataset ON import.dataset_id = dataset.id WHERE dataset.id = ? AND ${where} AND valid=0`, values: [id]});
        r.valid.approve = validR[0].invalid == 0;
        var validRR = await db.query({table: 'import', sql: `SELECT COUNT(import.valid_review) as invalid FROM `
        + `import LEFT JOIN dataset ON import.dataset_id = dataset.id WHERE dataset.id = ? AND ${where} AND valid_review=0`, values: [id]});
        r.valid.review = validRR[0].invalid == 0;
    }
     
    r.authorsEmail = r[`authors_email`];
    delete(r[`authors_email`]);
     setState(r);
     // JavaScript dates are serialized badly in JSON
     r.date = r.date.valueOf();
     r.restricted = r.restricted == 1;
     
     if(r.doi && auth.isEditor) {
         r.doiEditUrl = doi.getEditUrl(r.doi);
     }
     
     return {
         item: r
     }
}

const prepareForCreate = function(dataset, auth) {
    dataset.imported = 0;
    dataset.sub = auth.sub;
    //dataset.name = db.unique(dataset.name);
    dataset.date = new Date();
    dataset['authors_email'] = dataset.authorsEmail;
    if(dataset.restricted === null) {
        delete(dataset.restricted);
    }
    delete(dataset.authorsEmail);
}

const prepareForUpdate = function(dataset, auth) {
    // state cant be changed here
    delete(dataset.state);
    delete(dataset.sub);
    delete(dataset.valid);
    delete(dataset.date);
    delete(dataset.doi);
    delete(dataset.doiEditUrl);
    //dataset.name = db.unique(dataset.name);
    dataset['authors_email'] = dataset.authorsEmail;
    if(dataset.restricted === null) {
        delete(dataset.restricted);
    }
    delete(dataset.authorsEmail);
    
}

// validate reference - check if abbrev is unique
const validate = async function(dataset) {
    if(!dataset.name || dataset.name.length == 0) {
        return 'Dataset name cannot be empty.';
    }

    var r = await db.query({table: 'dataset', sql: 'SELECT id FROM dataset WHERE name = ?', values: [dataset.name], nestTables: false});
    let v = (r.length == 0 || (dataset.id && r[0].id == dataset.id)) ? true : 'Dataset name is already used.';
    if(v !== true) {
        return v;
    }
    // this is update
    
    if(dataset.id) {
        let s = await db.query({table: 'dataset', sql: 'SELECT name, authors, orcid, doi FROM dataset WHERE id = ?', values: [dataset.id], nestTables: false});
        let d = s[0];
        if(d.doi != null) { //&& await doi.isPublished(dataset.id)
            let doii = await doi.getDoi(d.doi);
            if(
            dataset.name != doii.spidertraits.name
            || dataset.authors != doii.spidertraits.authors
            //|| dataset.orcid != d.orcid
            ) {
                v = 'Name or Authors do not match the DOI information.'
            }
        }
    }
    return v;
}

const create = async function(body, auth) {
    return await db.createEntity({ body, table: 'dataset', auth, prepareForSql: prepareForCreate, validate });
}

const update = async function(params, body, auth) {
    return await db.updateEntity({params, body, table: 'dataset', auth, prepareForSql: prepareForUpdate, validate });
}

const getDoi = async function(params, auth) {
    let ds = (await get(params, auth)).item;
    if(!ds.doi) {
        throw 'No DOI assigned';
    }
    let doii = await doi.getDoi(ds.doi);
    doii.spidertraits.id=params.id;
    return doii;
}

const createDoi = async function(params, body, auth) {
    let dataset = (await get(params, auth)).item;
    if(dataset.doi) {
        throw 'DOI already created';
    }
    /*
    if(!dataset.orcid) {
        throw 'ORCID must be set';
    }
    */
    if(!dataset.state == 'approved') {
        throw 'Dataset is not approved';
    }
    let doiInfo = await doi.createDoi(doi.convertDataset(dataset, params.year, params.event));
    await db.updateEntity({params, body: {id: dataset.id, doi: doiInfo.id }, table: 'dataset', auth, prepareForSql: (dataset) => dataset});
    return doiInfo;
}

const remove = async function(params, auth, sourceDir) {
    // delete all the records in the import and data tables
    var id = parseInt(params.id);
    var aw = getWhere(auth, true, true);
    
    let doii = await db.query({table: 'dataset', sql: `SELECT doi FROM dataset WHERE id=? AND ${aw}`, values: [id]});
    if(doii[0].doi) {
        let vr = `Cannot delete dataset ${id} with a DOI assigned`
        console.log(vr);
        return { 
            error: 'validation',
            validation: vr
        }
    }
    
    await db.query({table: 'import', sql: `DELETE import FROM import JOIN dataset ON import.dataset_id = dataset.id WHERE dataset_id = ? AND ${aw}`, values: [id] });
    await db.query({table: 'data', sql: `DELETE data FROM data JOIN dataset ON data.dataset_id = dataset.id WHERE dataset_id = ? AND ${aw}`, values: [id] });

    var dsfile = await db.query({table: 'dataset', sql: `SELECT source_file FROM dataset WHERE id=? AND ${aw}`, values: [id]});
    console.dir(dsfile);
    if(dsfile[0]['source_file']) {
        try {
            await fs.unlink(path.resolve(sourceDir, dsfile[0]['source_file']));
        } catch (e) {
            console.error(`unable to delete source file: ${JSON.stringify(dsfile)}`);
        }
    } else {
        console.log(`No source file found for the dataset ${id}`);
    }

    return await db.deleteEntity({params, table: 'dataset', auth });
}

module.exports = function(dbClient) {
    db = dbClient;
    db.addSynonyms('datasets', 'dataset', {'state': `imported`, 'uploaded': 'date' });
    return {
        list,
        get,
        create,
        update,
        remove,
        getDoi,
        createDoi
    }
}