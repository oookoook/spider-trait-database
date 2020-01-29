export default {
    state: {
      user: null
    },
    mutations: {
      user(state, payload) {
        state.user = payload.value;
      }
    },
    getters: {
        user(state) {
            return state.user;
        },
    },
    actions: {
    },
    modules: {
    }
  }