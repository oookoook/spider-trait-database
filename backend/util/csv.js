const get = async function(tmpDir, filename, dstream) {
    var p = path.resolve(tmpDir, filename);
    
    await new Promise((resolve, reject) => {

    var cstream = fcsv.format({headers: true})
        .on('error', err => reject(err))
        .on('finish', () => resolve(path));
    
    const fstream = fs.createWriteStream(p, { encoding: 'utf8' });
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
    return p;
}

module.exports = {
    get
}