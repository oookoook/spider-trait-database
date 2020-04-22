const fs = require('fs')
const csv = require('@fast-csv/parse')
const mysql = require('mysql');

var taxons = {};
var genera = {};

const getFullName = (r) => {
    var t = [ r.genus ]
    if(r.specific_epithet && r.specific_epithet != '\\N') {
        t.push(r.specific_epithet);
    }
  
    if(r.subspecific_epithet && r.subspecific_epithet != '\\N') {
        t.push(r.subspecific_epithet);
    }
    
    return t.join(' ');
}

const registerTaxon = (row) => {
    taxons[row.wsc_id] = row.species_lsid;
}

const registerGenus = (row) => {
    if(!genera[row.genus_lsid]) {
        genera[row.genus_lsid] = {
            // replacing the lsid so the same function for creating the sql can be used
            species_lsid: row.genus_lsid,
            family: row.family,
            genus: row.genus,
            sp_author: row.gen_author,
            sp_author_year: row.gen_author_year
        };
    }
}

const getValidLSID = (validId) => {
    if(!validId) {
        return null;
    }
    return taxons[validId];
}

const e = (v) => {  
    if(v == '' || v == '\\N') {
        v = null;
    }
    return mysql.escape(v);
}

const getSQL = (row) => {
    return `INSERT INTO taxonomy SET wsc_lsid=${e(row.species_lsid)}`
    + `, valid_wsc_lsid=${e(getValidLSID(row.valid_wsc_id))}`
    + `, valid=${e(row.valid_wsc_id ? 0 : 1)} `
    + `, family=${e(row.family)}`
    + `, genus=${e(row.genus)}`
    + `, species=${e(row.specific_epithet)}`
    + `, subspecies=${e(row.subspecific_epithet)}`
    + `, full_name=${e(getFullName(row))}`
    + `, author=${e(row.sp_author)}`
    + `, year=${e(row.sp_author_year)}`
}

(async () => {
var vfile = process.argv[2];
var rfile = process.argv[3];

if(!vfile || !fs.existsSync(vfile)) {
    console.error('Invalid filename - valid');
    return -1;
}

if(!rfile || !fs.existsSync(rfile)) {
    console.error('Invalid filename - replaced');
    return -1;
}

await new Promise((resolve, reject) => {
csv.parseFile(vfile, { headers: true, encoding: 'utf8' })
    .on('error', error => console.error(error))
    .on('data', row => { registerTaxon(row); registerGenus(row); console.log(getSQL(row)) })
    .on('end', rowCount => { resolve() });
});
// generate the sql for the replaced names

await new Promise((resolve, reject) => {
    csv.parseFile(rfile, { headers: true, encoding: 'utf8' })
        .on('error', error => console.error(error))
        .on('data', row => { registerGenus(row); console.log(getSQL(row)) })
        .on('end', rowCount => { resolve() });
    });

// generate the sql for the genera
Object.values(genera).forEach(g => {
    console.log(getSQL(g));    
});


// update the database to link the records using ids
console.log('UPDATE taxonomy a LEFT JOIN taxonomy b ON a.wsc_lsid = b.valid_wsc_lsid SET b.valid_id = a.id '
+'WHERE b.valid_id IS NULL AND b.valid = 0');
})();