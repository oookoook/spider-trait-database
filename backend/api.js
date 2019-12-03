const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const auth = require('./auth');
const db = require('./db-client');

const traits = require('./api/traits')(db);
const methods = require('./api/methods')(db);
const references = require('./api/references')(db);
const locations = require('./api/locations')(db);
const taxonomy = require('./api/taxonomy')(db);
const datasets = require('./api/datasets')(db);
const data = require('./api/data')(db);
const importx = require('./api/import')(db);

router.use(auth.resourcesAuth);

router.use(db.limits);

router.route('/traits')
  .get(function (req, res) {
      traits.list(req.recordLimit).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    traits.create(req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/traits/:id')
  .get(function (req, res) {
    traits.get(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    traits.update(req.params, req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    traits.remove(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/methods')
  .get(function (req, res) {
    methods.list(req.recordLimit).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    methods.create(req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/methods/:id')
  .get(function (req, res) {
    methods.get(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    methods.update(req.params, req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    methods.remove(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/references')
  .get(function (req, res) {
    references.list(req.recordLimit).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    references.create(req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/references/:id')
  .get(function (req, res) {
    references.get(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    references.update(req.params, req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    references.remove(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/locations')
  .get(function (req, res) {
    locations.list(req.recordLimit).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    locations.create(req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/locations/:id')
  .get(function (req, res) {
    locations.get(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    locations.update(req.params, req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    locations.remove(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/taxonomy')
  .get(function (req, res) {
    taxonomy.list(req.recordLimit).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .post(requiresAuth(), auth.isEditor, function (req, res) {
    taxonomy.create(req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/taxonomy/:id')
  .get(function (req, res) {
    taxonomy.get(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .put(requiresAuth(), auth.isEditor, function (req, res) {
    taxonomy.update(req.params, req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .delete(requiresAuth(), auth.isEditor, function (req, res) {
    taxonomy.remove(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/datasets')
  .get(function (req, res) {
    datasets.list(req.recordLimit).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .post(requiresAuth(), auth.isContributor, function (req, res) {
    datasets.create(req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/datasets/:id')
  .get(function (req, res) {
    datasets.get(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .put(requiresAuth(), auth.isContributor, function (req, res) {
    datasets.update(req.params, req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .delete(requiresAuth(), auth.isContributor, function (req, res) {
    datasets.remove(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })

router.route('/data')
  .get(function (req, res) {
    data.list(req.recordLimit).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  });

router.route('/data/export')
  .get(function (req, res) {
    data.export().then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  });

router.route('/import')
  .get(function (req, res) {      
    importx.list(req.recordLimit).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .post(requiresAuth(), auth.isContributor, function (req, res) {
      // uploads new file
});

router.route('/import/:id')
  .get(function (req, res) {
    importx.get(req.params, req.recordLimit).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  })
  .put(requiresAuth(), auth.isContributor, function (req, res) {
  })
  .delete(requiresAuth(), auth.isContributor, function (req, res) {
  });

  router.route('/import/:id/row/:row')
  .get(function (req, res) {
    importx.getRow(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
   })
  .put(requiresAuth(), auth.isContributor, function (req, res) {
    importx.updateRow(req.params, req.body).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
   })
  .delete(requiresAuth(), auth.isContributor, function (req, res) {
    importx.deleteRow(req.params).then(r => res.json(r)).catch(e => { console.log(e); res.sendStatus(400); });
  });

module.exports = router;