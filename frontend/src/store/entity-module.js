import props from './entity-props' 


const normalizeOrderName = (order) => {
    if(!order) {
        return null;
    }
    let normalizedOrder = order.toLowerCase().replace(/ /g, '_');
    // first letter uppercase
    normalizedOrder = normalizedOrder.charAt(0).toUpperCase() + normalizedOrder.slice(1);
    return normalizedOrder;
}


export default (endpoint, useOrder = false) => {
    return {
    namespaced: true,
    state: {
      list: [],
      total: 0,
      entity: null,
      autocomplete: [],
      search: null,
      savedOptions: null,
      order: null,
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
      },
      savedOptions(state, payload) {
          state.savedOptions = payload.value;
      },
      setOrder(state, payload) {
          state.order = payload.value;
      },
      reset(state) {
          state.list = [];
          state.total = 0;
          state.savedOptions = null;
          state.order = null;
      }
    },
    getters: {
    },
    actions: {
        
        list: async function(context, payload) {
            console.log(`${endpoint}/list`);
            payload.endpoint = endpoint;
            payload.currCount = context.state.total;
            if (useOrder && context.state.order) {
                payload.order = normalizeOrderName(context.state.order);
            }
            var data = await context.dispatch('list', payload, { root: true });
            if(data) {    
                if(data.count !== null) {
                    context.commit('total', { value: data.count});
                }
                context.commit('list', { value: data.items});
                return data.items;
            }
        },
        get: async function(context, payload) {
            console.log(`${endpoint}/get`);
            payload.endpoint = endpoint;
            payload.params = payload.id;
            var data = await context.dispatch('get', payload, { root: true });
            if(data) {
                context.commit('entity', { value: data.item });
                return data.item;
            }
            
        },
        autocomplete: async function(context, payload) {
            console.log(`${endpoint}/autocomplete`, context.state.order);
            //console.dir(payload);
            payload.endpoint = `autocomplete/${endpoint}`;
            // dot in the parameter name indicates nested field, so we don't add order in this case
            if (useOrder && context.state.order && payload.query.valueField.indexOf('.') < 0) {
                payload.query.order = normalizeOrderName(context.state.order);
            }
            console.log('autocomplete payload', payload);
            var data = await context.dispatch('get', payload, { root: true });
            if(data) {
                context.commit('autocomplete', { value: data.items });
                return data.items;
            }
        },
        create: async function(context, payload) {
            console.log(`${endpoint}/create`);
            //console.dir(payload);
            var p = {};
            p.endpoint = `${endpoint}`;
            p.auth = true;
            p.body = payload;
            if (useOrder && context.state.order) {
                p.body.order = normalizeOrderName(context.state.order);
            }
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
            if (useOrder && context.state.order) {
                p.body.order = normalizeOrderName(context.state.order);
            }

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