import Vue from 'vue'
import Vuex from 'vuex'

import VuexPersist from 'vuex-persist'
const vuexPersist = new VuexPersist({
  storage: window.localStorage,
  // save only the lastRoute
  filter: (mutation) => mutation.type == 'lastRoute'
})

Vue.use(Vuex)

import user from './user'
import ui from './ui'
import api from './api'
import data from './data'
import EntityModule from './entity-module'



export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  modules: {
    user,
    ui,
    api,
    traits: new EntityModule('traits'),
    taxonomy: new EntityModule('taxonomy'),
    locations: new EntityModule('locations'),
    methods: new EntityModule('methods'),
    datasets: new EntityModule('datasets'),
    references: new EntityModule('references'),
    data
  }
})
