const endpoint = 'data';

const getParams = function(filter, order) {
  var f = filter;
  if(!f) {
    f= {};
  }
    var filters = ['family', 'genus', 'species', 'original-name', 'trait-category', 'trait', 'method', 'location', 'country', 'dataset', 'authors','reference','row-link'];
    var path = filters.map(i => `${i}/${f[i] ? encodeURIComponent(f[i]) : '*'}`).join('/');
    return order ? `order/${encodeURIComponent(order)}/${path}` : path;
};

export default {
    namespaced: true,
    state: {
      list: [],
      stats: [],
      homeStats: {},
      total: 0,
      restricted: false,
      restrictedDatasets: null,
      link: getParams(),
      autocomplete: {},
      savedOptions: null,
      order: null
    },
    mutations: {
      list(state, payload) {
        state.list = payload.value;
      },
      stats(state, payload) {
        state.stats = payload.value;
      },
      total(state, payload) {
        state.total = payload.value;
      },
      restricted(state, payload) {
        state.restricted = payload.value;
      },
      restrictedDatasets(state, payload) {
        state.restrictedDatasets = payload.value;
      },
      link(state,payload) {
        state.link = payload.value;
      },
      autocomplete(state, payload) {
        state.autocomplete[payload.entity] = payload.value;
      },
      homeStats(state, payload) {
        state.homeStats = payload.value;
      },
      savedOptions(state, payload) {
        // do nothing - this is just for compatibility with entity module
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
        exportLinkCSV(state, getters, rootState, rootGetters) {
            return `${rootGetters.baseUrl}data/export/csv/${state.link}`;
        },
        exportLinkExcel(state, getters, rootState, rootGetters) {
          return `${rootGetters.baseUrl}data/export/excel/${state.link}`;
      },
        shareLink(state, getters, rootState, rootGetters) {
          var port = window.location.port ? `:${window.location.port}` : '';
          return `${window.location.protocol}//${window.location.hostname}${port}/data/${state.link}`;
        },
        routeLink(state) {
          return state.link;
        },
        restricted(state) {
          return state.restricted;
        },
        restrictedDatasets(state) {
          return state.restrictedDatasets || [];
        },
        autocomplete: (state) => (entity) => state.autocomplete[entity],
        homeStats: (state) => (entity) => state.homeStats[entity] !== null ? state.homeStats[entity] : '...'

    },
    actions: {
        
        list: async function(context, payload) {
            //console.log(`${endpoint}/list`);
            payload.endpoint = endpoint;
            payload.currCount = context.state.total;
            payload.params = getParams(payload.filter, context.state.order);
            context.commit('link', { value: payload.params });
            //console.log(payload.params);
            var data = await context.dispatch('list', payload, { root: true });
            if(data){    
              if(data.count !== null) {
                    context.commit('total', { value: data.count});
                    context.commit('restricted', { value: data.restricted});
                    context.commit('restrictedDatasets', { value: data.restrictedDatasets});
                }
              context.commit('list', { value: data.items});
            }
        },

        stats: async function(context, payload) {
          console.info('reading stats for order', context.state.order);
          payload.endpoint = endpoint + '/stats';
          payload.params = `${payload.type}/${getParams(payload.filter, context.state.order)}`;
          var data = await context.dispatch('get', payload, { root: true });
          if(data){    
            context.commit('stats', { value: data});
          }
        },
        autocomplete: async function(context, payload) {
          //console.log(`data/autocomplete ${payload.entity}`);
          //console.dir(payload);
          payload.endpoint = `autocomplete/data`;
          var data = await context.dispatch('get', payload, { root: true });
          if(data) {
            context.commit('autocomplete', { value: data.items, entity: payload.entity });
          }
        },

        homeStats: async function(context, payload) {
          
          var data = await Promise.all(payload.entities.map(e => {
            var f = {};
            f[e] = 'distinct';
            var p = {endpoint: endpoint + '/stats', params: `count/${getParams(f, context.state.order)}` };

            return context.dispatch('get', p, { root: true });
          }));
          var hs = {};
          payload.entities.forEach((e,i) => {
            //console.dir(data[i]);
            hs[e] = data[i] ? data[i].items[0].count : 0;
          })

          context.commit('homeStats', { value: hs});
        }
          
    },
  }