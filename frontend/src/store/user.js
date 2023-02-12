import axios from 'axios';

const sessionTimeout = parseInt(process.env.VUE_APP_SESSION_TIMEOUT);


export default {
    state: {
      user: null,
      lastRoute: null,
      lastAction: null,
      apiKey: null
    },
    mutations: {
      user(state, payload) {
        state.user = payload.value;
      },
      lastRoute(state, payload) {
        state.lastRoute = payload.value;
      },
      lastAction(state, payload) {
        state.lastAction = payload.value;
      },
      apiKey(state, payload) {
        state.apiKey = payload.value;
      }
    },
    getters: {
        user(state) {
            return state.user;
        },
        apiKey(state) {
          return state.apiKey;
        },
        loginUrl(state) {
          return `${process.env.VUE_APP_BACKEND}user/login`;
        },
        logoutUrl(state) {
          return `${process.env.VUE_APP_BACKEND}user/logout`;
        },
        lastRoute(state) {
          return state.lastRoute;
        },
        lastAction(state) {
          return state.lastAction;
        },
        isEditor(state) {
          return state.user && state.user.isEditor;
        },
        isAdmin(state) {
          return state.user && state.user.isAdmin;
        },
        isContributor(state) {
          return state.user && state.user.isContributor;
        },
        isLoggedIn(state) {
          return state.user;
        }
    },
    actions: {
      async getUserInfo(context, payload) {
        try {
          var result = await axios.get(`${process.env.VUE_APP_BACKEND}user/info`);
          context.commit('user', { value: result.data });
          context.commit('lastAction', { value: Date.now().valueOf() });
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
      async logout(context, payload) {
        context.commit('user', { value: null });
        //context.commit('lastAction', { value: Date.now().valueOf() });
      },

      async getApiKey(context, payload) {
        try {
          var result = await axios.get(`${process.env.VUE_APP_BACKEND}user/key`);
          context.commit('apiKey', { value: result.data.key });
        } catch (err) {
          console.error(err);
          throw err;
        }
      },

      verifySession(context, payload) {
        var lastAction = context.getters.lastAction;
        var user = context.getters.user;
        if(user && (lastAction + sessionTimeout) > Date.now()) {
            return true;
        } else if (user) {
            // log off the user in the frontend
            context.commit('user', {value: null});
            context.dispatch('notify', { error: true, text: 'You were logged out.'});
            console.error('Unauthenticated user - timeout');
            return false;
        } else if(payload.required) {
            context.dispatch('notify', { error: true, text: 'Please log in to perform this action.'});
            console.error('Unauthenticated user');
            return false;
        }
    }
    },
    modules: {
    }
  }