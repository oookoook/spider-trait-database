import entityProps from './import-props'

export default {
  namespaced: true,
  state: {
    list: [],
    distinctList: [],
    total: 0,
    distinctTotal: 0,
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
    distinctList(state, payload) {
      state.distinctList = payload.value;
    },
    distinctTotal(state, payload) {
      state.distinctTotal = payload.value;
    },
    autocomplete(state, payload) {
      state.autocomplete[payload.entity] = payload.value;
    },
  },
  getters: {
    downloadLink: (state, getters, rootState, rootGetters) => (id) => {
      return `${rootGetters.baseUrl}import/${id}/data/export`;
    },
    autocomplete: (state) => (entity) => state.autocomplete[entity],
    entityProps: (state) => state.entityProps,
    propsDict: (state) => {
      var d = {};
      state.entityProps.forEach(p => d[p.name] = p);
      return d;
    },
    headers: (state) => {
      return state.entityProps.map(p => {
        var o = p.table || {};
        o.text = p.text.replace(' ','\xa0');
        o.value = p.name;
        return o;
      });
    },
    entityHeaders: (state) => (entity) => {
      return state.entityProps.filter(p=> p.entity == entity).map(p => {
        var o = p.table || {};
        o.text = p.text;
        o.value = p.name;
        return o;
      });
    },
    distinctEntityProps: (state) => (entity) => {
      return state.entityProps.filter(p=> p.entity == entity).map(p => p.name);
    },
    entityMatch: (state, getters) => (entity) => {
      return getters.propsDict[`${entity}.abbrev`];
    },
    //distinctEntityItems: (state) => state.distinctList,map(i => ),
    isEntityValid: (state) => (entity, item, editor) => {
      if(editor === 'create' && item[entity].id != null) {
        // the item is already created
        return false;
      }
      //return state.entityProps.filter(p=> p.entity == entity).reduce((total, p) => { var r = p.isValid(item, editor); console.log(`${p.name} ${r}`); return r && total }, true);
      var r = state.entityProps.filter(p=> p.entity == entity).reduce((total, p) => {
        if(typeof total == 'string') {
          return total;
        }
        // the v is either true or string
        var v =  p.isValid(item, editor);
        return v;
      }, true);
      return r;
    },
    entityEndpoint: (state) => (entity) => {
      switch(entity) {
        case 'taxonomy': return 'taxonomy';
        default: return `${entity}s`;
      }
    }
  },
  actions: {

    list: async function (context, payload) {
      //console.log(`${endpoint}/list`);
      payload.endpoint = 'import';
      payload.currCount = context.state.total;
      payload.params = `${payload.id}/data`;
      payload.auth = true;
      var data = await context.dispatch('list', payload, {
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
      payload.endpoint = `autocomplete/${payload.endpoint}`;
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
      //console.dir(payload);
      var p = { body: {}};
      p.endpoint = `import`;
      p.params = `${payload.dataset}/column/${payload.column}`;
      p.auth = true;
      if (payload.multipleColumns) {
        p.body.valueColumns = payload.valueColumns;
        p.body.oldValues = payload.oldValues;
        p.body.multipleColumns = true;
      } else {
        p.body.valueColumn = payload.valueColumn;
        p.body.oldValue = payload.oldValue;
      }
      p.body.newValue = payload.newValue;
      if(payload.validation != null & payload.validation == false) {
        p.body.validation = false;
      }
      var data = await context.dispatch('put', p, {
        root: true
      });
      if (data) {
        if(data.job) {
          data.job.title='Updating data...';
          await context.dispatch('createJob', data, {
            root: true
          });
        }
        return data.affected;
      }
    },
    deleteColumn: async function (context, payload) {
      var p = {};
      p.endpoint = `import`;
      p.params = `${payload.dataset}/column/${payload.column}/${encodeURIComponent(payload.value)}`;
      p.auth = true;
      var data = await context.dispatch('delete', p, {
        root: true
      });
      if (data) {
        return true;
      }
    },
    distinctList: async function (context, payload) {
      
      payload.endpoint = `import`;
      payload.currCount = context.state.distinctTotal;

      payload.params = `${payload.filter.dataset}/column/${payload.filter.column}`;
      payload.auth = true;

      var data = await context.dispatch('list', payload, {
        root: true
      });
      if (data) {
        if (data.count) {
          context.commit('distinctTotal', {
            value: data.count
          });
        }
        if(payload.filter.entity) {
          // asses validity of the values
          data.items.forEach(i => {
            var v = context.getters.isEntityValid(payload.filter.column, i, payload.filter.editor ? 'create' : false);
            //console.dir(v);
            i.valid = { 
              invalid: v !== true && v !== false,
              created: v === false,
              message: v, //v === false,
              selectable: v === true  
            };
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
      var p = {};
      p.endpoint = `import`;
      p.params = `${payload.id}`;
      p.auth = true;
      p.body = payload;
      // payload.message and payload.state are provided from the component
      var data = await context.dispatch('put', p, {
        root: true
      });
      if (data) {
        if(data.job) {
          await context.dispatch('createJob', data, {
            root: true
          });
        }
        return true;
      }
    },
    createMultiple: async function(context, payload) {
      // freeing up the memory
      context.commit('distinctList', {value: []});
      context.commit('distinctTotal', {value: 0});
      var j = { id: null, title: 'Creating entities...', state: { progress: 0, total: payload.entity.values.length, completed: false, aborted: false, errors: [] }};
      for(var i = 0; i < payload.entity.values.length; i++) {
        var e = payload.entity.values[i];
        //console.dir(payload);
        var p = {};
        p.endpoint = `${payload.endpoint}`;
        p.auth = true;
        p.body = e;
        await context.dispatch('createJob', { job: j }, { root: true });
        var data = await context.dispatch('post', p, { root: true });
        
        if(data && data.id && data.entity) {
          // use the entity.abbrev and do the column changes (disable validation for the requests)
          var pc = Object.assign({}, payload.columns);
          var o = {};
          o[payload.entity.name] = data.entity;
          pc.newValue = payload.entity.match.displayValue(o);
          pc.oldValues = payload.entity.oldValues[i];
          await context.dispatch(`editColumn`, pc);
          j.state.progress++;
        } else if(data && data.error == 'validation') {
          j.state.errors.push(`${JSON.stringify(e)}: ${data.validation}`);
        }
        else {
          j.state.errors.push(`${JSON.stringify(e)}: Server error`);
        }
        if(j.state.progress % 10 == 0) {
          await context.dispatch('updateJob', { job: j}, { root: true });
        }
      }
      j.state.completed = true;
      await context.dispatch('updateJob', { job: j}, { root: true });
    },

    validate: async function(context, payload) {
      var p = {};
      p.endpoint = `import`;
      p.params = `${payload.id}/validate`;
      p.auth = true;
      p.body = payload.all ? {all: true} : null;
      // payload.message and payload.state are provided from the component
      var data = await context.dispatch('put', p, {
        root: true
      });
      if (data) {
        if(data.job) {
          data.job.title = 'Validating...';
          await context.dispatch('createJob', data, {
            root: true
          });
        }
        return true;
      }  
    }
  },
}
