export default (endpoint) => {
    return {
    namespaced: true,
    state: {
      list: [],
      total: 0,
      entity: null,
      autocomplete: [],
      search: null
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
            try {
                var data = await context.dispatch('list', payload, { root: true });
                if(data.count) {
                    context.commit('total', { value: data.count});
                }
                context.commit('list', { value: data.items});
            } catch(err) {
                console.error(err);
                throw(err);
            }
        },
        get: async function(context, payload) {
            console.log(`${endpoint}/get`);
            payload.endpoint = endpoint;
            payload.params = payload.id;
            try {
                var data = await context.dispatch('get', payload, { root: true });
                context.commit('entity', { value: data.item });
            } catch(err) {
                console.error(err);
                throw(err);
            }
        },
        autocomplete: async function(context, payload) {
            console.log(`${endpoint}/autocomplete`);
            //console.dir(payload);
            payload.endpoint = `autocomplete/${endpoint}`;
            try {
                var data = await context.dispatch('get', payload, { root: true });
                context.commit('autocomplete', { value: data.items });
            } catch(err) {
                console.error(err);
                throw(err);
            }
        }
    },
  }
};