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
    traits: new EntityModule('traits'),
    taxonomy: new EntityModule('taxonomy'),
    locations: new EntityModule('locations'),
    methods: new EntityModule('methods'),
    datasets: new EntityModule('datasets'),
    references: new EntityModule('references'),
    dataTypes: new EntityModule('dataTypes'),
    lifeStages: new EntityModule('lifeStages'),
    measures: new EntityModule('measures'),
    sexes: new EntityModule('sexes'),
    traitCategories: new EntityModule('traitCategories'),
    countries: new EntityModule('countries'),
    imports: new EntityModule('import'),
    editor,
    data,
    jobs,
    doi
  }
})
