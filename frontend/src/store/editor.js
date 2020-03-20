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
        o.text = p.text;
        o.value = p.name;
        return o;
      });
    },
    distinctEntityHeaders: (state) => (entity) => {
      return state.entityProps.filter(p=> p.entity == entity).map(p => {
        var o = p.table || {};
        o.text = p.text;
        o.value = p.name;
        return o;
      });
    },
    isEntityValid: (state) => (entity, item, editor) => {
      if(editor === 'create' && item[entity].id != null) {
        // the item is already created
        return false;
      }
      return state.entityProps.filter(p=> p.entity == entity).reduce((total, p) => p.isValid(item, editor) && total, true);
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
    distinctList: async function (context, payload) {
      var p = {};
      p.endpoint = `import`;
      payload.currCount = context.state.distinctTotal;

      p.params = `${payload.filter.dataset}/column/${payload.filter.column}`;
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
        if(payload.filter.entity) {
          // asses validity of the values
          data.items.forEach(i => {
            var v = context.getters.isEntityValid(payload.filter.column, i, payload.filter.editor ? 'create' : false);

            i.valid = { 
              invalid: v !== true && v !== false,
              created: v === false,
              message: v === false,
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
    },
    createMultiple: async function(context, payload) {
      var j = { id: null, title: 'Creating entities...', state: { progress: 0, total: payload.entities.length, errors: [] }};
      for(var i = 0; i < payload.entities.length; i++) {
        var e = payload.entities[i];
        //console.dir(payload);
        var p = {};
        p.endpoint = `${payload.endpoint}`;
        p.auth = true;
        p.body = e;
        await context.dispatch('createJob', { job: j }, { root: true });
        var data = await context.dispatch('post', p, { root: true });
        // the api module returns false uf user is not authenticated
        
        if(data && data.id) {
          j.state.progress++;
          
        } else if(data && data.error == 'validation') {
          j.state.errors.push(`${JSON.stringify(e)}: ${data.validation}`);
        }
        else {
          j.state.errors.push(`${JSON.stringify(e)}: Server error`);
        }
        await context.dispatch('updateJob', { job: j}, { root: true });
      }
      j.state.completed = true;
      await context.dispatch('updateJob', { job: j}, { root: true });
    }

  },
}
