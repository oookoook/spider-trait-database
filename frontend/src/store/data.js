const endpoint = 'data';

const getParams = function(filter) {
  var f = filter;
  if(!f) {
    f= {};
  }
    var filters = ['family', 'genus', 'species', 'trait-category', 'trait', 'country', 'habitat', 'dataset', 'authors','reference','row-link'];
    return filters.map(i => `${i}/${f[i] ? encodeURIComponent(f[i]) : '*'}`).join('/');
    // `family/:family/genus/:genus/species/:species/trait-category/:traitcat/trait/:trait/country/:country/habitat/:habitat/dataset/:dataset/authors/:authors/reference/:reference/row-link/:rowl`

};

export default {
    namespaced: true,
    state: {
      list: [],
      total: 0,
      link: getParams(),
      autocomplete: {},
    },
    mutations: {
      list(state, payload) {
        state.list = payload.value;
      },
      total(state, payload) {
        state.total = payload.value;
      },
      link(state,payload) {
        state.link = payload.value;
      },
      autocomplete(state, payload) {
        state.autocomplete[payload.entity] = payload.value;
      }
    },
    getters: {
        exportLink(state, getters, rootState, rootGetters) {
            return `${rootGetters.baseUrl}data/export/${state.link}`;
        },
        shareLink(state, getters, rootState, rootGetters) {
          var port = window.location.port ? `:${window.location.port}` : '';
          return `${window.location.protocol}//${window.location.hostname}${port}/data/${state.link}`;
        },
        routeLink(state) {
          return state.link;
        },
        autocomplete: (state) => (entity) => state.autocomplete[entity],


    },
    actions: {
        
        list: async function(context, payload) {
            //console.log(`${endpoint}/list`);
            payload.endpoint = endpoint;
            payload.currCount = context.state.total;
            payload.params = getParams(payload.filter);
            context.commit('link', { value: payload.params });
            //console.log(payload.params);
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
        autocomplete: async function(context, payload) {
          //console.log(`data/autocomplete ${payload.entity}`);
          //console.dir(payload);
          payload.endpoint = `autocomplete/data`;
          try {
              var data = await context.dispatch('get', payload, { root: true });
              context.commit('autocomplete', { value: data.items, entity: payload.entity });
          } catch(err) {
              console.error(err);
              throw(err);
          }
      }
    },
  }