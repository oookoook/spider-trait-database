export default {
    state: {
      user: null,
      lastRoute: null,
      loginTime: null,
    },
    mutations: {
      user(state, payload) {
        state.user = payload.value;
      },
      lastRoute(state, payload) {
        state.lastRoute = payload.value;
      },
      loginTime(state, payload) {
        state.loginTime = payload.value;
      }
    },
    getters: {
        user(state) {
            return state.user;
        },
        loginUrl(state) {
          return `${process.env.VUE_APP_BACKEND}user/login?returnPath=${encodeURIComponent(state.lastRoute)}`;
        }
    },
    actions: {
      async getUserInfo(context, payload) {
        try {
          var result = await Vue.http.get(`${process.env.VUE_APP_BACKEND}user/info`);
          context.commit('user', { value: result.body });
          context.commit('loginTime', { value: new Date().valueOf() });
        } catch (err) {
          console.error(err);
      }
      }
    },
    modules: {
    }
  }