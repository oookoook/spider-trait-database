import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import colors from 'vuetify/lib/util/colors'

import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
      themes: {
        light: {
        primary: '#00AF3F',
        secondary: colors.amber.darken4,
        accent: colors.deepPurple.lighten5
        }
      }
    }
  })
