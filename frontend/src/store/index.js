import Vue from 'vue'
import Vuex from 'vuex'

import VuexPersist from 'vuex-persist'
const vuexPersist = new VuexPersist({
  storage: window.localStorage,
  // save only the lastRoute and user info
  filter: (mutation) => ['lastRoute', 'user', 'lastAction'].includes(mutation.type)
})

Vue.use(Vuex)

import user from './user'
import ui from './ui'
import api from './api'
import data from './data'
import editor from './editor'
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
    imports: new EntityModule('import'),
    editor,
    data
  }
})
