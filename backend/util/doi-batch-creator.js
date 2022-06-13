// node ./doi-batch-creator 0 10
const db = require('../util/db-client');
let ds = require('../api/datasets')(db);
let doiapi = require('./doi');

(async () => {
    let list = await ds.list({offset: parseInt(process.argv[2]), limit: parseInt(process.argv[3]), count: true }, null, false);
    //console.dir(list);
    console.log('ds db count', list.count);
    let dsl = [...list.items];
    
    if(list.count > list.items.length && process.argv[4] == 'all') {
      console.log('More datasets available');
      list = await ds.list({offset: dsl.length, limit: list.count }, null, false);
      dsl = [...dsl, ...list.items];  
    }
    
    console.log('ds loaded count', dsl.length);

    for(let i = 0; i < dsl.length; i++) {
        let dsi = dsl[i];
        if(!dsi.doi && dsi.state == 'approved') {
            //console.log(doiapi.convertDataset(dsi, null, 'publish'));
            let doi = await ds.createDoi({ id: dsi.id, event: 'publish' }, {}, { isEditor: true });
            console.log(`DOI created for  ${dsi.id} ${dsi.name}: ${JSON.stringify(doi)}`);
        } else {
            console.log(`DOI already exists for ${dsi.id} ${dsi.name}`);
        }
    }

    db.endPool();
})()