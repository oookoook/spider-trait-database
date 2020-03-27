import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import colors from 'vuetify/lib/util/colors'

import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

// https://coolors.co/00af3f-2274a5-f75c03-f1c40f-d90368

export default new Vuetify({
    theme: {
      themes: {
        light: {
        primary: '#00AF3F',
        secondary: '#F1C40F',
        accent: colors.green.lighten5
        }
      }
    }
  })
