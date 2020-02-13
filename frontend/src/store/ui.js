export default {
    state: {
      notification: {
        active: false,
        text: null,
        color: 'info'
      },
    },
    getters: {
      notification(state) {
          return state.notification;
      }, 
    },
    mutations: {
      notification(state, payload) {
        state.notification = payload.value;
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
    }
  }
  