const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');


const settings = require('../settings');
const auth = require('../util/auth');
const db = require('../util/db-client');
const mail = require('../util/mail')(settings);


const traits = require('./traits')(db);
const methods = require('./methods')(db);
const references = require('./references')(db);
const locations = require('./locations')(db);
const taxonomy = require('./taxonomy')(db);
const datasets = require('./datasets')(db);
const data = require('./data')(db);
const imports = require('./import')(db, mail);

const et = require('./enums');
const enums = {
  dataTypes: et('dataTypes', 'data_type', db, ['trait']),
  lifeStages: et('lifeStages','life_stage', db),
  measures: et('measures', 'measure', db),
  sexes: et('sexes', 'sex', db),
  traitCategories: et('traitCategories', 'trait_category', db, ['trait']),
  countries: require('./countries')(db)
}

const jobs = require('./jobs');



router.use(auth.resourcesAuth);

router.use(db.limits);

var uploadOpts = { useTempFiles: true, tempFileDir : settings.files.tmpDir, limits: { fileSize: settings.files.import.sizeLimitMB * 1024 * 1024 }};

const err = (e) => {
  console.error(`${new Date().toISOString()}: ${e}`);
  console.error(e);
}

router.route('/autocomplete/:endpoint')
  .get(function(req, res) {
    db.getAutocomplete(req.params.endpoint, req.query.valueField, req.query.textField, 
      req.query.search, req.query.count ? parseInt(req.query.count) : null, req.query.searchByValue == 'true', req.query.searchFromStart == 'true').then(r => res.json({ items: r })).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/traits')
  .get(function (req, res) {
      traits.list(req.recordLimit).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    traits.create(req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/traits/:id')
  .get(function (req, res) {
    traits.get(req.params).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    traits.update(req.params, req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    traits.remove(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/methods')
  .get(function (req, res) {
    methods.list(req.recordLimit).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    methods.create(req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/methods/:id')
  .get(function (req, res) {
    methods.get(req.params).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    methods.update(req.params, req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    methods.remove(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/references')
  .get(function (req, res) {
    references.list(req.recordLimit).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    references.create(req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/references/:id')
  .get(function (req, res) {
    references.get(req.params).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    references.update(req.params, req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    references.remove(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/locations')
  .get(function (req, res) {
    locations.list(req.recordLimit).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    locations.create(req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/locations/:id')
  .get(function (req, res) {
    locations.get(req.params).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    locations.update(req.params, req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    locations.remove(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/taxonomy')
  .get(function (req, res) {
    taxonomy.list(req.recordLimit).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    taxonomy.create(req.body).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })


router.route('/taxonomy/:id')
  .get(function (req, res) {
    taxonomy.get(req.params).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    taxonomy.update(req.params, req.body).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    taxonomy.remove(req.params).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  
router.route('/datasets')
  .get(function (req, res) {
    datasets.list(req.recordLimit).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .post(requiresAuth(), auth.isContributor, function (req, res) {
    datasets.create(req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/datasets/:id')
  .get(function (req, res) {
    datasets.get(req.params).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .put(requiresAuth(), auth.isContributor, function (req, res) {
    datasets.update(req.params, req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .delete(requiresAuth(), auth.isContributor, function (req, res) {
    datasets.remove(req.params, req.resourcesAuth, settings.files.sourceDir).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })


router.route('/data/family/:family/genus/:genus/species/:species/original-name/:origname/trait-category/:traitcat/trait/:trait/method/:method/location/:location/country/:country/dataset/:dataset/authors/:authors/reference/:reference/row-link/:rowl')
  .get(function (req, res) {
    data.list(req.params, req.recordLimit, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  });

router.route('/data/export/csv/family/:family/genus/:genus/species/:species/original-name/:origname/trait-category/:traitcat/trait/:trait/method/:method/location/:location/country/:country/dataset/:dataset/authors/:authors/reference/:reference/row-link/:rowl')
  .get(function (req, res) {
    data.csv(req.params, req.recordLimit, settings.files.tmpDir, req.resourcesAuth).then(r => res.download(r)).catch(e => { err(e); res.sendStatus(400); })
  });
 
router.route('/data/export/excel/family/:family/genus/:genus/species/:species/original-name/:origname/trait-category/:traitcat/trait/:trait/method/:method/location/:location/country/:country/dataset/:dataset/authors/:authors/reference/:reference/row-link/:rowl')
  .get(function (req, res) {
    data.excel(req.params, req.recordLimit, settings.files.tmpDir, req.resourcesAuth).then(r => res.download(r)).catch(e => { err(e); res.sendStatus(400); })
  });

router.route('/data/stats/:type/family/:family/genus/:genus/species/:species/original-name/:origname/trait-category/:traitcat/trait/:trait/method/:method/location/:location/country/:country/dataset/:dataset/authors/:authors/reference/:reference/row-link/:rowl')
    .get(function (req, res) {
      data.stats(req.params, req.query).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
     });     

router.route('/import/')
// gets the not imported datasets  
.get(requiresAuth(), auth.isContributor, function (req, res) {      
    datasets.list(req.recordLimit, req.resourcesAuth, true).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  // Datasets are created in the datasets endpoint, but this is added for convenience
  .post(requiresAuth(), auth.isContributor, function (req, res) {
    datasets.create(req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })



router.route('/import/:id')
  // gets the not imported dataset info
  .get(requiresAuth(), auth.isContributor, function (req, res) {      
    datasets.get(req.params, req.resourcesAuth, true).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .put(requiresAuth(), auth.isContributor, function (req, res) {
    // used for sending the dataset to approval and for approving the dataset. If the dataset is approved,
    // all the records are transferred from the import table to the data table - that's why this is not handled by the datasets endpoint 
    imports.changeState(req.params, req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .delete(requiresAuth(), auth.isContributor, function (req, res) {
    // this is handled by the dataset endpoint, added for convenience
    datasets.remove(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })



router.route('/import/:id/data')
  // gets data for a given dataset
  .get(requiresAuth(), auth.isContributor, function (req, res) {
    imports.list(req.params, req.recordLimit, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .put(requiresAuth(), auth.isContributor, fileUpload(uploadOpts), function (req, res) {
    // uploads a file to already existing dataset
    // returns only a jobId that can be used to track the progress
    // in the background transfers rows from the file to the import table
    imports.uploadFile(req.params, req.body, req.files, req.resourcesAuth, settings.files.sourceDir).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .delete(requiresAuth(), auth.isContributor, function (req, res) {
    // delete all the records for a given dataset in the import table
    imports.deleteRecords(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  });

  router.route('/import/:id/data/export')
  // gets data for a given dataset in CSV
  .get(requiresAuth(), auth.isContributor, function (req, res) {
    imports.exportCsv(req.params, req.resourcesAuth,  settings.files.tmpDir).then(r => res.download(r)).catch(e => { err(e); res.sendStatus(400); })
  })

  router.route('/import/:id/data/source')
  // gets original file for a given dataset
  .get(requiresAuth(), auth.isContributor, function (req, res) {
    imports.getSourceFile(req.params, req.resourcesAuth,  settings.files.sourceDir).then(r => res.download(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  
  router.route('/import/:id/validate')
  // allow ad-hoc validation
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    imports.startValidation(req.params, req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route('/import/:id/row/:row')
  .get(requiresAuth(), auth.isContributor, function (req, res) {
    imports.getRow(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
   })
  .put(requiresAuth(), auth.isContributor, function (req, res) {
    imports.updateRow(req.params, req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
   })
  .delete(requiresAuth(), auth.isContributor, function (req, res) {
    imports.deleteRow(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  });

router.route('/import/:id/column/:column')
  .get(requiresAuth(), auth.isContributor, function (req, res) {
  // used for getting the distinct entities that must be created
  imports.getColumn(req.params, req.recordLimit, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .put(requiresAuth(), auth.isContributor, function (req, res) {
    // used for batch value replacements
    imports.updateColumn(req.params, req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
   })
   router.route('/import/:id/column/:column/:value')
   .delete(requiresAuth(), auth.isContributor, function (req, res) {
    imports.deleteColumn(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
   });

router.route('/jobs/')
    .get(requiresAuth(), auth.isContributor, function (req, res) {
      // used for getting the list of running jobs
      jobs.list(req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
     });

router.route('/jobs/:id')
    .get(requiresAuth(), auth.isContributor, function (req, res) {
      // used for getting the distinct entities that must be created
      jobs.get(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
     })
     .delete(requiresAuth(), auth.isContributor, function (req, res) {
      jobs.remove(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
    });

Object.keys(enums).forEach(e => {
  router.route(`/${e}`)
  .get(function (req, res) {
    enums[e].list(req.recordLimit).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    enums[e].create(req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })

router.route(`/${e}/:id`)
  .get(function (req, res) {
    enums[e].get(req.params).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    enums[e].update(req.params, req.body, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    enums[e].remove(req.params, req.resourcesAuth).then(r => res.json(r)).catch(e => { err(e); res.sendStatus(400); })
  })
})

module.exports = router;