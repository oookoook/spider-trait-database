import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import VueGtag from "vue-gtag";

Vue.use(VueGtag, {
  config: { id: process.env.VUE_APP_GA_ID,
    params: {
      send_page_view: true
    }
  }
}, router);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
