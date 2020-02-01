import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './user'
import ui from './ui'
import api from './api'
import traits from './traits'
import data from './data'

export default new Vuex.Store({
  modules: {
    user,
    ui,
    api,
    traits,
    data
  }
})
