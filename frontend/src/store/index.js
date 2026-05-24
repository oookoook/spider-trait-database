import Vue from 'vue'
import Vuex from 'vuex'

import VuexPersist from 'vuex-persist'
const vuexPersist = new VuexPersist({
  storage: window.localStorage,
  // save only the user and jobs
  modules: ['jobs', 'user']
  //reducer: (state) => ['lastRoute', 'user', 'lastAction', 'job', 'errors'].includes(mutation.type)
})

Vue.use(Vuex)

import user from './user'
import ui from './ui'
import api from './api'
import data from './data'
import editor from './editor'
import jobs from './jobs'
import doi from './doi'
import EntityModule from './entity-module'


export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  modules: {
    user,
    ui,
    api,
    traits: EntityModule('traits'),
    taxonomy: EntityModule('taxonomy'),
    locations: EntityModule('locations'),
    methods: EntityModule('methods'),
    datasets: EntityModule('datasets'),
    references: EntityModule('references'),
    dataTypes: EntityModule('dataTypes'),
    lifeStages: EntityModule('lifeStages'),
    measures: EntityModule('measures'),
    sexes: EntityModule('sexes'),
    traitCategories: EntityModule('traitCategories'),
    countries: EntityModule('countries'),
    imports: EntityModule('import'),
    orders: EntityModule('orders'),
    editor,
    data,
    jobs,
    doi
  }
})
