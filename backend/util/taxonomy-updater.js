const db = require('./db-client');
const axios = require('axios');
const settings = require('../settings');

const apiKey = settings.wsc.key;

const getIdsFromWsc = async function(type, date) {
    //https://wsc.nmbe.ch/api/updates?apiKey=xyz
    // URL: https://wsc.nmbe.ch/api/updates?type=<value (optional)>&date=<YYYY-MM-DD (optional)>&apiKey=<valid API key>
    var lsids = [];
    var page = 1;
    var hasLast = true;
    do {
        var res = await axios.get('https://wsc.nmbe.ch/api/updates', {
        params: {
            type,
            apiKey,
            date,
            page
        }
    });
    //console.log(res.data);
    lsids = lsids.concat(res.data.updates);
    page+=1;
    hasLast = res.data._links.last != null;
    } while(hasLast);
    
    
    return lsids;
}

const getExistingRecord = async function(conn, lsid) {
    var r = await db.cquery(conn, {table: 'taxonomy', sql:'SELECT id FROM taxonomy WHERE wsc_lsid = ?', values: [lsid]});
    if(r.length == 0) {
        return false;
    }
    if(r.length > 1) {
        console.error(`Multiple records for lsid ${lsid}`);    
    }
    //console.dir(r);
    return r[0].id;
}

const getTaxonFromWsc = async function(lsid) {
    /*
    {
    "taxon": {
        "species": "cryptethum",
        "subspecies": "",
        "author": "Chamberlin, 1940",
        "taxonRank": "species",
        "status": "SYNONYM",
        "genus": "Aphonopelma",
        "genusObject": {
            "genus": "Aphonopelma",
            "author": "Pocock, 1901",
            "genLsid": "urn:lsid:nmbe.ch:spidergen:00195"
        },
        "family": "Theraphosidae",
        "familyObject": {
            "family": "Theraphosidae",
            "author": "Thorell, 1869",
            "famLsid": "urn:lsid:nmbe.ch:spiderfam:0010"
        },
        "distribution": "USA",
        "lsid": "urn:lsid:nmbe.ch:spidersp:001720",
        "referenceObject": {
            "reference": "",
            "doi": "",
            "pageDescription": ""
        }
    },
    "validTaxon": {
        "_href": "https:\/\/wsc.nmbe.ch\/api\/lsid\/urn:lsid:nmbe.ch:spidersp:001724"
    }
    }    
    */

    /*
    https://wsc.nmbe.ch/api/lsid/<LSID>?apiKey=<valid API key>
    */
    try {
    var res = await axios.get(`https://wsc.nmbe.ch/api/lsid/${lsid}`, {
        params: {
            apiKey
        }
    });
    
    return res.data;
    } catch(e) {
        console.error(`${lsid}: ${e}`);
        return null;
    }
    
    //console.log(res.data);
}

const p = (v) => v && v.length > 0 ? v : null; 
const pb = (v) => v ? v.replace(/\(|\)/g, '') : null;
const pa = (v) => v && v.length > 0 ? v.substr(0, v.length - 6) : null;
const py = (v) => v && v.length > 0 ? parseInt(v.substr(v.length-4,4)) : null;
const ph = (v) => v.substr(v.indexOf('urn'));

const gfn = (r) => {
    var t = [ r.genus ]
    if(r.species) {
        t.push(r.species);
    }
  
    if(r.subspecies) {
        t.push(r.subspecies);
    }
    
    return t.join(' ');
}

const updateTaxon = async function(conn, t) {
    var id = await getExistingRecord(conn, t.taxon.lsid);

    var record = {
        family: p(t.taxon.family),
        genus: p(t.taxon.genus),
        species: p(t.taxon.species),
        subspecies: p(t.taxon.subspecies),
        author: pa(pb(t.taxon.author)),
        year: py(pb(t.taxon.author))
    }

    if(t.validTaxon) {
        record.valid_wsc_lsid = ph(t.validTaxon['_href']);
        // null the valid id if this is a synonym or homonym - fill it later, the valid recort might not have been inserted yet at this moment
        record.valid_id = null;
        record.valid = 0;
    }

    record.full_name = gfn(record);

    if(!id) {
        record.wsc_lsid = t.taxon.lsid;
        await db.cquery(conn, {table: 'taxonomy', sql:'INSERT INTO taxonomy SET ?', values: [record]});
    } else {
        await db.cquery(conn, {table: 'taxonomy', sql:'UPDATE taxonomy SET ? WHERE id=?', values: [record, id]});
    }
    //console.dir(record);
}

const updateTaxonLinks =async function(conn) {
    await db.cquery(conn, {table: 'taxonomy', sql: 'UPDATE taxonomy a LEFT JOIN taxonomy b ON a.wsc_lsid = b.valid_wsc_lsid SET b.valid_id = a.id '
    +'WHERE b.valid_id IS NULL AND b.valid = 0' });

    // update all the existing records in the data table
    // that are linked to invalid taxonomy records
    await db.cquery(conn, {table: 'taxonomy', sql: 'UPDATE data INNER JOIN taxonomy ON data.taxonomy_id = taxonomy.id SET data.taxonomy_id = taxonomy.valid_id '
    +'WHERE taxonomy.valid = 0' });
}

const update = async function(from) {
    // date object is passed as from, this conversion just works fine and returns a date object
    var d = new Date(from);

    if(!(d instanceof Date && !isNaN(d))) {
        throw 'Invalid start date';
    }

    var lsids = await getIdsFromWsc('genus', d.toISOString().substr(0,10));
    lsids = lsids.concat(await getIdsFromWsc('species', d.toISOString().substr(0,10)));
    //console.dir(lsids);
    var conn = await db.getConnection();
    for(var i = 0; i < lsids.length; i++) {
        console.log(`Updating ${lsids[i]}`);
        var t = await getTaxonFromWsc(lsids[i]); 
        if(t) {
            await updateTaxon(conn, t);
        }
    }

    await updateTaxonLinks(conn);

    db.releaseConnection(conn);
    console.log('Update completed.');
    return;
}

module.exports = {
    update
}

