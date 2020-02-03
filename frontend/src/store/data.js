const endpoint = 'data';

const getParams = function(payload) {
    var f = payload.filter;
    var filters = ['family', 'genus', 'species', 'trait-category', 'trait', 'country', 'habitat', 'dataset', 'authors','reference','row-link'];
    return filters.map(i => `${i}/${f[i] ? f[i] : '*'}`).join('/');
    // `family/:family/genus/:genus/species/:species/trait-category/:traitcat/trait/:trait/country/:country/habitat/:habitat/dataset/:dataset/authors/:authors/reference/:reference/row-link/:rowl`

};

export default {
    namespaced: true,
    state: {
      list: [],
      total: 0,
      exportLink: null
    },
    mutations: {
      list(state, payload) {
        state.list = payload.value;
      },
      total(state, payload) {
        state.total = payload.value;
      },
      exportLink(state,payload) {
        state.exportLink = payload.value;
      }
    },
    getters: {
        exportLink(state, getters, rootState, rootGetters) {
            return `${rootGetters.baseUrl}/data/export/${state.exportLink}`;
        }
    },
    actions: {
        
        list: async function(context, payload) {
            console.log(`${endpoint}/list`);
            payload.endpoint = endpoint;
            payload.currCount = context.state.total;
            payload.params = getParams(payload);
            context.commit('exportLink', { value: payload.params });
            console.log(payload.params);
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
        }
    },
  }