const converter = require('../converter');
const fs = require('fs');
const u = require('../taxonomy-updater');

const run = async () => {
    //console.log('Running update...');
    var input = process.argv[2];
    var from = converter.parseNumber(input);
    //console.log(from);
    var d = new Date(from);
    //console.log(d);
    if(!from) {
        console.error('No start date provided. Exiting...');
        return -1;
    } 
    
    
    try { 
        await u.update(d);
        console.log(Date.now());
        console.log(new Date().toISOString());
        console.log('completed');
    } catch(e) {
        console.log(from);
        console.log(d.toISOString());
        console.error(`${new Date().toISOString()}: ${e}`);
        return -1;
    }

    
    
}

run();