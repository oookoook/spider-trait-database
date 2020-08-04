import Vue from 'vue';

export default {
    state: {
      notification: {
        active: false,
        text: null,
        color: 'info'
      },
      publications: ''
    },
    getters: {
      notification(state) {
          return state.notification;
      }, 
      publications(state) {
        return state.publications
      }
    },
    mutations: {
      notification(state, payload) {
        state.notification = payload.value;
      },
      publications(state, payload) {
        state.publications = payload.value;
      }
    },
    actions: {
      notify(context, payload) {
        var n = {
          text: payload.text,
          color: !payload.error ? 'info' : 'error',
          active: true
        };
        context.commit('notification', {
          value: n
        });
      },
      async getPublications(context, payloar) {
        try {
          var md  = await Vue.http.get('https://raw.githubusercontent.com/oookoook/spider-trait-database/master/docs/publications.md');
          context.commit('publications', { value: md.body });
        } catch (err) {
          console.error(err);
          context.dispatch('notify', {error: true, text: 'Unable to load publications.' });
        }
      }
    }
  }
  