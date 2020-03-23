const fcsv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');


const get = async function(tmpDir, filename, dstream, connection) {
    var p = path.resolve(tmpDir, filename);
    
    await new Promise((resolve, reject) => {

    var cstream = fcsv.format({headers: true})
        .on('error', err => reject(err))
        
    
    const fstream = fs.createWriteStream(p, { encoding: 'utf8' });
    fstream.on('finish', () => { console.log('writing ended'); resolve(path); });
    cstream.pipe(fstream);

    dstream
        .on('error', function(err) {
        // Handle error, an 'end' event will be emitted after this as well
        console.log(err);
        })
        .on('fields', function(fields) {
        // the field packets for the rows to follow
        })
        .on('result', function(row) {
        // Pausing the connnection is useful if your processing involves I/O
        connection.pause();
        cstream.write(row);    
        connection.resume();
      })
      .on('end', function() {
        // all rows have been received
        cstream.end();
      });
        
    });
    console.log(p);
    return p;
}

const convert = async function(f) {
  var wb = XLSX.readFile(f);
    /* generate array of arrays */
    var sheetName = wb.SheetNames[0];
    if(wb.SheetNames.includes('Data')) {
        sheetName = 'Data';
    }
    var nf = `${f}.csv`;
    //data = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName], {header:1});
    // wait for the file to convert
    await new Promise(
        function(resolve, reject) {
            var stream = XLSX.stream.to_csv(wb.Sheets[sheetName], {header:1, dateNF:'YYYY-MM-DD'});
            stream.pipe(fs.createWriteStream(nf));
            stream.on('error', (err) => {
                reject(err);
            });
            stream.on('end', () => {
                resolve();
            });
        });
    return nf;
}

module.exports = {
    get,
    convert
}