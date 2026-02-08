const db = require('./db-client');
const { getFullName } = require('./taxonomy-common');
const axios = require('axios');
const settings = require('../settings');

const apiKey = settings.wsc.key;

const getIdsFromWsc = async function(type, date) {
    //https://wsc.nmbe.ch/api/updates?apiKey=xyz
    // URL: https://wsc.nmbe.ch/api/updates?type=<value (optional)>&date=<YYYY-MM-DD (optional)>&apiKey=<valid API key>
    console.log(`[getIdsFromWsc] Fetching ${type} updates from date: ${date}`);
    var lsids = [];
    var page = 1;
    var hasLast = true;
    do {
        console.log(`[getIdsFromWsc] Fetching ${type} page ${page}...`);
        try {
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
            console.log(`[getIdsFromWsc] Page ${page} fetched, ${res.data.updates.length} updates received (total so far: ${lsids.length})`);
            page+=1;
            hasLast = res.data._links.last != null;
        } catch(e) {
            console.error(`[getIdsFromWsc] ERROR fetching ${type} page ${page}: ${e.message}`);
            if(e.response) {
                console.error(`[getIdsFromWsc] Response status: ${e.response.status}, data: ${JSON.stringify(e.response.data)}`);
            }
            throw e;
        }
    } while(hasLast);
    
    console.log(`[getIdsFromWsc] Completed fetching ${type} updates: ${lsids.length} total LSIDs`);
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
        console.log(`[getTaxonFromWsc] Fetching taxon data for LSID: ${lsid}`);
        var res = await axios.get(`https://wsc.nmbe.ch/api/lsid/${lsid}`, {
            params: {
                apiKey
            }
        });
        console.log(`[getTaxonFromWsc] Successfully fetched taxon: ${lsid}`);
        return res.data;
    } catch(e) {
        console.error(`[getTaxonFromWsc] ERROR fetching taxon ${lsid}: ${e.message}`);
        if(e.response) {
            console.error(`[getTaxonFromWsc] Response status: ${e.response.status}, URL: ${e.config?.url}`);
            console.error(`[getTaxonFromWsc] Response data: ${JSON.stringify(e.response.data)}`);
        }
        return null;
    }
    
    //console.log(res.data);
}

const p = (v) => v && v.length > 0 ? v : null; 
const pb = (v) => v ? v.replace(/\(|\)/g, '') : null;
const pa = (v) => v && v.length > 0 ? v.substr(0, v.length - 6) : null;
const py = (v) => v && v.length > 0 ? parseInt(v.substr(v.length-4,4)) : null;
const ph = (v) => v.substr(v.indexOf('urn'));

const updateTaxon = async function(conn, t) {
    if(!t) {
        console.log('[updateTaxon] No taxon provided, skipping');
        return;
    }
    console.log(`[updateTaxon] Processing taxon: ${t.taxon.lsid}`);
    var id = await getExistingRecord(conn, t.taxon.lsid);

    var record = {
        order: 'Araneae',
        family: p(t.taxon.family),
        genus: p(t.taxon.genus),
        species: p(t.taxon.species),
        subspecies: p(t.taxon.subspecies),
        author: pa(pb(t.taxon.author)),
        year: py(pb(t.taxon.author)),
        valid: 1
    }

    if(t.validTaxon) {
        record.valid_wsc_lsid = ph(t.validTaxon['_href']);
        // null the valid id if this is a synonym or homonym - fill it later, the valid record might not have been inserted yet at this moment
        record.valid_id = null;
        record.valid = 0;
    }

    record.full_name = getFullName(record);

    if(!id) {
        console.log(`[updateTaxon] Inserting new taxon: ${record.full_name} (${t.taxon.lsid})`);
        record.wsc_lsid = t.taxon.lsid;
        await db.cquery(conn, {table: 'taxonomy', sql:'INSERT INTO taxonomy SET ?', values: [record]});
        console.log(`[updateTaxon] Successfully inserted: ${record.full_name}`);
    } else {
        console.log(`[updateTaxon] Updating existing taxon: ${record.full_name} (id: ${id})`);
        await db.cquery(conn, {table: 'taxonomy', sql:'UPDATE taxonomy SET ? WHERE id=?', values: [record, id]});
        console.log(`[updateTaxon] Successfully updated: ${record.full_name}`);
    }
    //console.dir(record);
}

const updateTaxonLinks =async function(conn) {
    console.log('[updateTaxonLinks] Starting taxon links update...');
    
    // pair taxons based on valid lsid, fill in valid id
    console.log('[updateTaxonLinks] Pairing taxons based on valid LSID...');
    var result = await db.cquery(conn, {table: 'taxonomy', sql: `UPDATE taxonomy a LEFT JOIN taxonomy b ON a.wsc_lsid = b.valid_wsc_lsid SET b.valid_id = a.id 
    WHERE b.valid_id IS NULL AND b.valid = 0` });
    console.log(`[updateTaxonLinks] Paired ${result.affectedRows} taxon records`);

    // it might happen that there will be records that have valid_lsid, but no valid_id was found - we need to get the taxon from the WSC
    
    // get valid_wsc_id if not null and get the taxon and insert
    console.log('[updateTaxonLinks] Checking for missing valid taxa...');
    var  missing = await db.cquery(conn, {table: 'taxonomy', sql: 'SELECT DISTINCT valid_wsc_lsid FROM taxonomy WHERE valid = 0 AND valid_wsc_lsid IS NOT NULL AND valid_id is NULL'});
    console.log(`[updateTaxonLinks] Found ${missing.length} missing valid taxa to fetch`);
    for(let i = 0; i < missing.length; i++) {
        let m = missing[i]
        console.log(`[updateTaxonLinks] Processing missing valid taxon ${i+1}/${missing.length}: ${m['valid_wsc_lsid']}`);
        try {
            let t = await getTaxonFromWsc(m['valid_wsc_lsid']);
            await updateTaxon(conn, t);
        } catch(e) {
            console.error(`[updateTaxonLinks] Error updating ${JSON.stringify(m)}: ${e.message}`);
            //console.dir(t);
            console.dir(e);
        }
    };
    console.log(`[updateTaxonLinks] Completed processing ${missing.length} missing valid taxa`);


    // update all the existing records in the data table
    // that are linked to invalid taxonomy records
    // IGNORE so the whole batch doesnt fail if something goes wrong
    console.log('[updateTaxonLinks] Updating data table records linked to invalid taxonomy...');
    var dataResult = await db.cquery(conn, {table: 'taxonomy', sql: 'UPDATE IGNORE data INNER JOIN taxonomy ON data.taxonomy_id = taxonomy.id SET data.taxonomy_id = taxonomy.valid_id '
    +'WHERE taxonomy.valid = 0' });
    console.log(`[updateTaxonLinks] Updated ${dataResult.affectedRows} data records`);

    // do join species + genus and update family for records where genus.family <> species.family
    // updates species after genus was updated (moved to another family)
    console.log('[updateTaxonLinks] Updating species family based on genus family...');
    var familyResult = await db.cquery(conn, {table: 'taxonomy', sql: `UPDATE IGNORE taxonomy sp LEFT JOIN (SELECT * from taxonomy WHERE genus IS NOT NULL AND species IS NULL) gen 
    ON sp.genus = gen.genus SET sp.family = gen.family WHERE sp.family <> gen.family`});
    console.log(`[updateTaxonLinks] Updated ${familyResult.affectedRows} species family records`);
    
    console.log('[updateTaxonLinks] Taxon links update completed');
}

const update = async function(from) {
    console.log('='.repeat(60));
    console.log('[UPDATE] Starting taxonomy update process');
    console.log('='.repeat(60));
    
    // date object is passed as from, this conversion just works fine and returns a date object
    var d = new Date(from);

    if(!(d instanceof Date && !isNaN(d))) {
        throw 'Invalid start date';
    }

    console.log(`[UPDATE] Fetching updates from date: ${d.toISOString().substr(0,10)}`);
    
    console.log('\n--- Step 1/4: Fetching LSIDs from WSC ---');
    var lsids = await getIdsFromWsc('family', d.toISOString().substr(0,10));
    lsids = lsids.concat(await getIdsFromWsc('genus', d.toISOString().substr(0,10)));
    lsids = lsids.concat(await getIdsFromWsc('species', d.toISOString().substr(0,10)));
    console.log(`[UPDATE] Total LSIDs to process: ${lsids.length}`);
    //console.dir(lsids);
    
    console.log('\n--- Step 2/4: Getting database connection ---');
    var conn = await db.getConnection();
    console.log('[UPDATE] Database connection established');
    
    console.log('\n--- Step 3/4: Processing taxa ---');
    try {
        for(var i = 0; i < lsids.length; i++) {
            console.log(`\n[UPDATE] Progress: ${i+1}/${lsids.length} (${Math.round((i+1)/lsids.length*100)}%) - Processing ${lsids[i]}`);
            var t = await getTaxonFromWsc(lsids[i]); 
            if(t) {
                await updateTaxon(conn, t);
            } else {
                console.warn(`[UPDATE] Skipping ${lsids[i]} - no data returned from WSC`);
            }
        }
    } catch (e) {
        console.error('[UPDATE] ERROR during taxa processing:');
        console.error(e);
        throw e;
    }
    
    console.log('\n--- Step 4/4: Updating taxon links ---');
    await updateTaxonLinks(conn);

    console.log('\n--- Cleanup ---');
    db.releaseConnection(conn);
    console.log('[UPDATE] Database connection released');
    db.endPool();
    console.log('[UPDATE] Database pool ended');
    
    console.log('\n' + '='.repeat(60));
    console.log('[UPDATE] Taxonomy update completed successfully!');
    console.log('='.repeat(60));
    return;
}

module.exports = {
    update
}

