export default {
    namespaced: true,
    state: {
      list: [],
      total: 0,
      entity: null
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
      }
    },
    getters: {
        list(state) {
            return state.list;
        },
        total(state) {
            return state.total;
        },
        entity(state) {
            return state.entity;
        }
    },
    actions: {
        
        list: async function(context, payload) {
            console.log('traits/list');
            
            payload.endpoint = 'traits';
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
            console.log('traits/get');
            payload.endpoint = 'traits';
            payload.params = payload.id;
            try {
                var data = await context.dispatch('get', payload, { root: true });
                context.commit('entity', { value: data.item });
            } catch(err) {
                console.error(err);
                throw(err);
            }
        }
    },
  }