import props from './entity-props' 

export default (endpoint) => {
    return {
    namespaced: true,
    state: {
      list: [],
      total: 0,
      entity: null,
      autocomplete: [],
      search: null,
      props: props(endpoint)
    },
    mutations: {
      list(state, payload) {
        state.list = payload.value;
      },
      total(state, payload) {
        state.total = payload.value;
      },
      entity(state, payload) {
          state.entity = payload.value;
      },
      autocomplete(state, payload) {
        state.autocomplete = payload.value;
      },
      search(state, payload) {
          state.search = payload.value;
      }
    },
    getters: {
    },
    actions: {
        
        list: async function(context, payload) {
            console.log(`${endpoint}/list`);
            payload.endpoint = endpoint;
            payload.currCount = context.state.total;                
            var data = await context.dispatch('list', payload, { root: true });
            if(data) {    
                if(data.count) {
                    context.commit('total', { value: data.count});
                }
                context.commit('list', { value: data.items});
            }
        },
        get: async function(context, payload) {
            console.log(`${endpoint}/get`);
            payload.endpoint = endpoint;
            payload.params = payload.id;
            var data = await context.dispatch('get', payload, { root: true });
            if(data) {
                context.commit('entity', { value: data.item });
            }
        },
        autocomplete: async function(context, payload) {
            console.log(`${endpoint}/autocomplete`);
            //console.dir(payload);
            payload.endpoint = `autocomplete/${endpoint}`;
            var data = await context.dispatch('get', payload, { root: true });
            if(data) {
                context.commit('autocomplete', { value: data.items });
            }
            
        },
        create: async function(context, payload) {
            console.log(`${endpoint}/create`);
            //console.dir(payload);
            var p = {};
            p.endpoint = `${endpoint}`;
            p.auth = true;
            p.body = payload;
           
            var data = await context.dispatch('post', p, { root: true });
                // the api module returns false uf user is not authenticated
            if(data) {
                return data;
            }
        },
        update: async function(context, payload) {
            console.log(`${endpoint}/update`);
            //console.dir(payload);
            var p = {};
            p.endpoint = `${endpoint}`;
            p.params = payload.id;
            p.auth = true;
            p.body = payload;

            var r = await context.dispatch('put', p, { root: true });
            return r;
        },
        delete: async function(context, payload) {
            console.log(`${endpoint}/delete`);
            //console.dir(payload);
            var p = {};
            p.endpoint = `${endpoint}`;
            p.auth = true;
            p.params = payload.id;

            var r = await context.dispatch('delete', p, { root: true });
            return r;
        }
    },
  }
};