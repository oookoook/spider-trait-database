// TODO poper props

var entityProps = [
  { 
    name: 'taxonomy.wscLsid',
    text: 'WSC LSID', 
    displayValue: (i) => i.taxonomy.wscLsid, 
    isValid: (i, e) => !!i.taxonomy.id || 'Taxon must be assigned to the record',
    autocomplete: { endpoint: 'taxonomy', valueField: 'wsc.lsid' }
  },
  { 
    name: 'taxonomy.originalName',
    text: 'Original name', 
    displayValue: (i) => i.taxonomy.originalName, 
    isValid: (i, e) => !!i.taxonomy.id || 'Taxon must be assigned to the record',
    autocomplete: { endpoint: 'taxonomy', valueField: 'taxonomy.originalName' }
  },
  { 
    name: 'trait.abbrev',
    text: 'Trait ID', 
    displayValue: (i) => i.trait.abbrev, 
    isValid: (i, e) => !!i.trait.id || (!e && i.trait.name && i.trait.description) || 'Trait must be assigned to the record',
    autocomplete: { endpoint: 'traits', valueField: 'abbrev', textField: ['abbrev', 'name'] }
  },
  { 
    name: 'trait.name',
    text: 'Trait name', 
    displayValue: (i) => i.trait.name,
    isValid: (i, e) => {
      if(i.trait.abbrev && i.trait.name && !e) {
        return 'Do not provide Trait Name when Trait ID is set.'
      }
      if(!i.trait.abbrev && !i.trait.name) {
        return 'Provide Trait Name when Trait ID is not set.'
      }
      return true;
    }
  },
  { 
    name: 'trait.description',
    text: 'Trait description', 
    displayValue: (i) => i.trait.description, 
    //foreignMatchValue: (i) => i.taxonomy.wscLsid,
    isValid: (i, e) => {
      if(i.trait.abbrev && i.trait.description && !e) {
        return 'Do not provide Trait Description when Trait ID is set.'
      }
      if(!i.trait.abbrev && !i.trait.description) {
        return 'Provide Trait Description when Trait ID is not set.'
      }
    }
  },
  { 
    name: 'method.abbrev',
    text: 'Method ID', 
    displayValue: (i) => i.method.abbrev, 
    isValid: (i, e) => !!i.method.id || (!e && i.method.name && i.method.description) || 'Method must be assigned to the record',
    autocomplete: { endpoint: 'methods', valueField: 'name', textField: ['name'] }
  },
  { 
    name: 'method.name',
    text: 'Method name', 
    displayValue: (i) => i.method.name, 
    isValid: (i, e) => {
      if(i.method.abbrev && i.method.name && !e) {
        return 'Do not provide Method Name when Method ID is set.'
      }
      if(!i.method.abbrev && !i.method.name) {
        return 'Provide Method Name when Method ID is not set.'
      }
      return true;
    }
  },
  { 
    name: 'method.description',
    text: 'Method description', 
    displayValue: (i) => i.method.description, 
    isValid: (i, e) => {
      if(i.method.abbrev && i.method.description && !e) {
        return 'Do not provide Method Description when Method ID is set.'
      }
      if(!i.method.abbrev && !i.method.description) {
        return 'Provide Method Description when Method ID is not set.'
      }
    }
  },
  { 
    name: 'value',
    text: 'WSC LSID', 
    displayValue: (i) => i.value.numeric != null ? i.value.numeric : i.value.raw, 
    isValid: (i, e) => !i.value.requiresNumeric || i.value.numeric != null || "Value is not a valid number"
  },
  { 
    name: 'measure',
    text: 'Measure', 
    displayValue: (i) => i.measure.raw, 
    isValid: (i, e) => !i.measure.raw || !!i.measure.id || 'Value does not match any of the possible values',
    autocomplete: { endpoint: 'data', valueField: 'measure.name' }
  },
  { 
    name: 'sex',
    text: 'Sex', 
    displayValue: (i) => i.sex.raw, 
    isValid: (i, e) => !i.sex.raw || !!i.sex.id || 'Value does not match any of the possible values',
    autocomplete: { endpoint: 'data', valueField: 'sex.name' }
  },
  { 
    name: 'lifeStage',
    text: 'Life stage', 
    displayValue: (i) => i.lifeStage.raw, 
    isValid: (i, e) => !i.lifeStage.raw || !!i.lifeStage.id || 'Value does not match any of the possible values',
    autocomplete: { endpoint: 'data', valueField: 'lifeStage.name' }
  },
  { 
    name: 'frequency',
    text: 'Frequency', 
    displayValue: (i) => i.frequency.numeric != null ? i.frequency.numeric : i.frequency.raw, 
    isValid: (i, e) => !i.frequency.raw || i.frequency.numeric != null || 'Value is not a valid number',
  },
  { 
    name: 'sampleSize',
    text: 'Sample size', 
    displayValue: (i) => i.sampleSize.numeric != null ? i.sampleSize.numeric : i.sampleSize.raw, 
    isValid: (i, e) => !i.sampleSize.raw || i.sampleSize.numeric != null || 'Value is not a valid number',
  },
  { 
    name: 'eventDate.text',
    text: 'Event Date', 
    displayValue: (i) => i.eventDate.text, 
    isValid: (i, e) => true
  },
  /*
  { 
    name: 'eventDate.start',
    text: 'Event start', 
    displayValue: (i) => i.taxonomy.wscLsid, 
    foreignMatchValue: (i) => i.taxonomy.wscLsid,
    isValid: (i, e) => i.taxonomy.id || 'Taxon must be assigned to the record',
    autocomplete: { endpoint: 'taxonomy', valueField: 'country.code', textField: ['country.code', 'country.name'] }
  },
  { 
    name: 'eventDate.end',
    text: 'Event end', 
    displayValue: (i) => i.taxonomy.wscLsid, 
    foreignMatchValue: (i) => i.taxonomy.wscLsid,
    isValid: (i, e) => i.taxonomy.id || 'Taxon must be assigned to the record',
    autocomplete: { endpoint: 'taxonomy', valueField: 'country.code', textField: ['country.code', 'country.name'] }
  },
  */
  { 
    name: 'reference.fullCitation',
    text: 'Reference (Full)', 
    displayValue: (i) => i.reference.fullCitation, 
    isValid: (i, e) => !!i.reference.id || (!e && i.reference.fullCitation) || 'Reference must be set',
    
  },
  { 
    name: 'reference.abbrev',
    text: 'Reference (Abbrev.)', 
    displayValue: (i) => i.reference.abbrev, 
    isValid: (i, e) => !!i.reference.id || (!e && i.reference.fullCitation) || 'Reference must be set',
    autocomplete: { endpoint: 'references', valueField: 'abbrev', textField: ['abbrev', 'fullCitation'] }
  },
  { 
    name: 'reference.doi',
    text: 'Reference DOI', 
    displayValue: (i) => i.reference.doi, 
    isValid: (i, e) => true
  },
  { 
    name: 'location.abbrev',
    text: 'Location ID', 
    displayValue: (i) => i.taxonomy.wscLsid, 
    isValid: (i, e) => !!i.location.id || !e || 'Location must be set',
    autocomplete: { endpoint: 'locations', valueField: 'abbrev', textField: ['abbrev', 'country.code', 'locality', 'habitatGlobal.name'] }
  },
  { 
    name: 'location.lat',
    text: 'Latitude', 
    displayValue: (i) => i.location.lat.conv || location.lat.raw, 
    isValid: (i, e) => !i.location.lat.raw || !!i.location.lat.conv || 'Value cannot be converted to a valid latitude.',
  },
  { 
    name: 'location.lon',
    text: 'Longitude', 
    displayValue: (i) => i.location.lon.conv || location.lon.raw, 
    isValid: (i, e) => !i.location.lon.raw || !!i.location.lon.conv || 'Value cannot be converted to a valid longitude.',
  },
  { 
    name: 'location.precision',
    text: 'Coordinate precision',  
    displayValue: (i) => i.location.precision.numeric != null ? i.location.precision.numeric : i.location.precision.raw, 
    isValid: (i, e) => !i.location.precision.raw || i.location.precision.numeric != null || 'Value is not a valid number',
  },
  { 
    name: 'location.altitude',
    text: 'Altitude',  
    displayValue: (i) => i.location.altitude.numeric != null ? i.location.altitude.numeric : i.location.altitude.raw, 
    isValid: (i, e) => !i.location.altitude.raw || i.location.altitude.numeric != null || 'Value is not a valid number',
  },
  { 
    name: 'location.locality',
    text: 'WSC LSID', 
    displayValue: (i) => i.location.locality, 
    isValid: (i, e) => true,
  },
  { 
    name: 'location.country',
    text: 'Country', 
    displayValue: (i) => i.location.country.raw, 
    isValid: (i, e) => !i.location.country.raw || !!i.location.country.id || 'Value does not match any existing code',
    autocomplete: { endpoint: 'locations', valueField: 'country.code', textField: ['country.code', 'country.name'] }
  },
  { 
    name: 'location.habitatGlobal',
    text: 'Global habitat', 
    displayValue: (i) => i.location.habitatGlobal.raw, 
    isValid: (i, e) => !i.location.habitatGlobal.raw || !!i.location.habitatGlobal.id || 'Value does not match any of the possible values',
    autocomplete: { endpoint: 'locations', valueField: 'habitatGlobal.name' }
  },
  { 
    name: 'location.habitat',
    text: 'Habitat', 
    displayValue: (i) => i.location.habitat, 
    isValid: (i, e) => true,
  },
  { 
    name: 'location.microhabitat',
    text: 'Microhabitat', 
    displayValue: (i) => i.location.microhabitat, 
    isValid: (i, e) => true,
  },
  { 
    name: 'location.stratum',
    text: 'Stratum', 
    displayValue: (i) => i.location.stratum, 
    isValid: (i, e) => true,
  },
  { 
    name: 'location.note',
    text: 'Note', 
    displayValue: (i) => i.location.note, 
    isValid: (i, e) => true,
  },
  { 
    name: 'rowLink',
    text: 'Row link', 
    displayValue: (i) => i.rowLink, 
    isValid: (i, e) => true,
  },
  

];


export default {
  namespaced: true,
  state: {
    list: [],
    total: 0,
    autocomplete: {},
    entityProps
  },
  mutations: {
    list(state, payload) {
      state.list = payload.value;
    },
    total(state, payload) {
      state.total = payload.value;
    },
    autocomplete(state, payload) {
      state.autocomplete[payload.entity] = payload.value;
    },
    job(state, payload) {
      state.job = payload.value;
    }
  },
  getters: {
    autocomplete: (state) => (entity) => state.autocomplete[entity],
    job: (state) => state.job,
    entityProps: (state) => state.entityProps,
    propsDict: (state) => {
      var d = {};
      state.entityProps.forEach(p => d[p.name] = p);
      return d;
    },
    headers: (state) => {
      return state.entityProps.map(p => {
        var o = p.table || {};
        o.text = p.text;
        o.value = p.name;
        return o;
      });
    },

  },
  actions: {

    list: async function (context, payload) {
      //console.log(`${endpoint}/list`);
      payload.endpoint = 'import';
      payload.currCount = context.state.total;
      payload.params = `${payload.id}/data`;
      payload.auth = true;
      var data = await context.dispatch('list', payload.params, {
        root: true
      });
      if (data) {
        if (data.count) {
          context.commit('total', {
            value: data.count
          });
        }
        context.commit('list', {
          value: data.items
        });
      }
    },
    autocomplete: async function (context, payload) {
      payload.endpoint = `autocomplete/import`;
      var data = await context.dispatch('get', payload, {
        root: true
      });
      if (data) {
        context.commit('autocomplete', {
          value: data.items,
          entity: payload.entity
        });
      }
    },
    upload: async function (context, payload) {
      var p = {};
      p.endpoint = `import`;
      p.params = `${payload.dataset}/data`;
      p.auth = true;
      // https://github.com/pagekit/vue-resource/blob/develop/docs/recipes.md
      p.body = new FormData();
      p.body.append('dataset', payload.file);
      var start = Date.now();
      context.dispatch('createJob', {
        title: 'Uploading...'
      }, {
        root: true
      });
      var data = await context.dispatch('put', p, {
        root: true
      });
      if (data) {
        // first update after the file is updated
        context.dispatch('updateJob', {
          job: data.job
        }, {
          root: true
        });
      } else {
        context.dispatch('updateJob', {
          job: null
        }, {
          root: true
        });
      }

    },

    download: async function (context, payload) {
      var p = {};
      p.endpoint = `import`;
      p.params = `${payload.dataset}/data/export`;
      p.auth = true;
      var data = await context.dispatch('get', p, {
        root: true
      });
      if (data) {
        return true;
      }
    },

    editRow: async function (context, payload) {
      var p = {};
      p.endpoint = `import`;
      p.params = `${payload.dataset}/row/${payload.id}`;
      p.auth = true;
      p.body = payload.changes;
      var data = await context.dispatch('put', p, {
        root: true
      });
      if (data) {
        return true;
      }
    },
    deleteRow: async function (context, payload) {
      var p = {};
      p.endpoint = `import`;
      p.params = `${payload.dataset}/row/${payload.id}`;
      p.auth = true;
      var data = await context.dispatch('delete', p, {
        root: true
      });
      if (data) {
        return true;
      }
    },
    editColumn: async function (context, payload) {
      var p = {};
      p.endpoint = `import`;
      p.params = `${payload.dataset}/column/${payload.column}`;
      p.auth = true;
      if (p.multipleColumns) {
        p.valueColumns = payload.valueColumns;
        p.oldValues = payload.oldValues;
        p.multipleColumns = true;
      } else {
        p.valueColumn = payload.valueColumn;
        p.oldValue = payload.oldValue;
      }
      p.newValue = payload.newValue;
      var data = await context.dispatch('put', p, {
        root: true
      });
      if (data) {
        await context.dispatch('createjob', data, {
          root: true
        });
        return data.affected;
      }
    },
    getDistinct: async function (context, payload) {
      var p = {};
      p.endpoint = `import`;
      payload.currCount = context.state.distinctTotal;

      p.params = `${payload.dataset}/column/${payload.column}`;
      p.auth = true;

      var data = await context.dispatch('list', payload, {
        root: true
      });
      if (data) {
        if (data.count) {
          context.commit('distinctTotal', {
            value: data.count
          });
        }
        context.commit('distinctList', {
          value: data.items
        });
      }
    },
    deleteData: async function (context, payload) {
      var p = {};
      p.endpoint = `import`;
      p.params = `${payload.id}/data`;
      p.auth = true;
      var data = await context.dispatch('delete', p, {
        root: true
      });
      if (data) {
        return true;
      }
    },
    changeState: async function(context, payload) {
      p.endpoint = `import`;
      p.params = `${payload.id}`;
      payload.auth = true;
      // payload.message and payload.state are provided from the component
      var data = await context.dispatch('put', p, {
        root: true
      });
      if (data) {
        if(data.job) {
          await context.dispatch('createjob', data, {
            root: true
          });
        }
        return true;
      }
    }
  },
}
