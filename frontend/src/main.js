import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import resource from 'vue-resource';

import VueGtag from "vue-gtag";

Vue.use(resource);

Vue.use(VueGtag, {
  config: { id: process.env.VUE_APP_GA_ID }
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
