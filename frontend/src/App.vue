<template>
  <v-app dark>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>
        <router-link style="color:white;text-decoration:none" to="/"><v-icon left>mdi-spider</v-icon>World Spider Trait database</router-link>
        <!--<v-icon left>mdi-spider</v-icon>Spider Trait Database-->
        </v-toolbar-title>


      <v-divider vertical class="mx-5"></v-divider>
      <v-toolbar-items>
      <v-btn
        to="/data"
        text
      ><v-icon left>mdi-magnify</v-icon> Data Explorer 
      </v-btn>

      <v-menu right bottom offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on"><v-icon left>mdi-format-list-bulleted-square</v-icon>Lists<v-icon right>mdi-chevron-down</v-icon></v-btn>
      </template>
      <v-list>
        <v-list-item to="/datasets">
          <v-list-item-icon><v-icon>mdi-table</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Datasets</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/references">
          <v-list-item-icon><v-icon>mdi-bookmark-multiple-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>References</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/locations">
          <v-list-item-icon><v-icon>mdi-map-marker</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Locations</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/traits">
          <v-list-item-icon><v-icon>mdi-comment-question-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Traits</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/taxonomy">
          <v-list-item-icon><v-icon>mdi-file-tree</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Taxa</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/methods">
          <v-list-item-icon><v-icon>mdi-chart-bell-curve</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Methods</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/enums" v-if="isEditor">
          <v-list-item-icon><v-icon>mdi-chevron-right</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Enumerations</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>      

    <v-menu right bottom offset-y v-if="isContributor">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on"><v-icon left>mdi-share</v-icon> Contribute<v-icon right>mdi-chevron-down</v-icon></v-btn>
      </template>
      <v-list>
        <v-list-item to="/import">
          <v-list-item-icon><v-icon>mdi-upload</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Import datasets</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/approve" v-if="isEditor">
          <v-list-item-icon><v-icon>mdi-stamper</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Approve and manage datasets</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/contribute">
          <v-list-item-icon><v-icon>mdi-share</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Data contribution help</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isEditor" href="https://github.com/oookoook/spider-trait-database/blob/master/docs/approve.md" target="_blank">
          <v-list-item-icon><v-icon>mdi-stamper</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Data approval help</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item v-if="user" href="https://github.com/oookoook/spider-trait-database/blob/master/docs/editor-howto.md" target="_blank">
          <v-list-item-icon><v-icon>mdi-lifebuoy</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Data editor How To</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>    
    <v-btn v-else
        to="/contribute"
        text
      ><v-icon left>mdi-share</v-icon> Contribute 
    </v-btn>

    <v-btn v-if="isAdmin"
        to="/admin"
        text
      ><v-icon left>mdi-cogs</v-icon> Administration 
    </v-btn>
    <v-menu right bottom offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on"><v-icon left>mdi-help</v-icon> More<v-icon right>mdi-chevron-down</v-icon></v-btn>
      </template>
      <v-list>
        <v-list-item to="/about">
          <v-list-item-icon><v-icon>mdi-frequently-asked-questions</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>About</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/publications">
          <v-list-item-icon><v-icon>mdi-bookmark-multiple-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Publications</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/api">
          <v-list-item-icon><v-icon>mdi-code-json</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>APIs</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/policy">
          <v-list-item-icon><v-icon>mdi-shield-check-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Policy statement</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item href="https://github.com/oookoook/spider-trait-database" target="_blank">
          <v-list-item-icon><v-icon>mdi-github</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Source code</v-list-item-title></v-list-item-content>
        </v-list-item>

      </v-list>
    </v-menu>
      </v-toolbar-items>

      <v-spacer></v-spacer>
      <v-toolbar-items>
      <v-btn v-if="!user"
        :href="loginUrl"
        text
      ><v-icon left>mdi-account-arrow-right-outline</v-icon>  Log in 
      </v-btn>
      <template v-else>
      <v-btn
        text readonly
      ><v-icon left>mdi-account</v-icon>  {{user.name}} 
      </v-btn>
      <v-btn 
        text
        :href="logoutUrl"
      ><v-icon>mdi-logout</v-icon>
      </v-btn>
      </template>
      </v-toolbar-items>
    </v-app-bar>
    <v-snackbar app
      v-model="notification.active"
      :timeout="5000"
      :color="notification.color"
      top>
      {{ notification.text }}
      <v-btn
        text
        @click="notification.active = false"
      >
        Close
      </v-btn>
    </v-snackbar>

    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer dark color="primary" class="mt-16">
      <v-row class="mx-5 my-4 text-body-2">
        <v-col cols="12" sm="4" class="d-inline-flex align-start flex-row">
          <a target="_blank" href="https://muni.cz/en">
          <v-img contain :src="require('./assets/muni-white.png')" height="47" max-width="164" class="mr-5"/>
          </a>
          <a target="_blank" href="https://muni.cz/en" v-if="showLargeLogo">
          <v-img contain :src="require('./assets/muni-lg-text-eng-white.png')" height="47" max-width="183" class="ml-5"/>
          </a>
        </v-col>
        <v-col cols="12" sm="4" class="d-flex align-center flex-row">
          <!--
          The core team (in alphabetical order): Klaus Birkhofer, Pedro Cardoso,<br />
          Ludmila Cernecka, Marie Herberstein, Lizzy Lowe, Stefano Mammola,<br />
          Stano Pekar, Caroline Sayuri, and Jonas Wolff.
          -->
          <div class="subtitle-2">
          Pekár et al. 2021. The world spider trait database v1.0. Masaryk University, Brno
          <!-- , doi: -->
          </div>
        </v-col>
        <v-col cols="12" sm="4" class="d-flex align-start align-sm-end justify-center flex-column">
          <v-row class="mx-1 mb-1 align-center subtitle-2">
            <span><a href="https://www.sci.muni.cz/zoolecol/inverteb/?teams=prof-stano-pekar-ph-d" target="_blank" class="white--text">Pekár</a>, <a href="https://nastojte.cz" target="_blank" class="white--text">Kučera</a> 2020</span>
          </v-row>
          <v-row class="mx-1 align-center">
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" title="Creative Commons Attribution 4.0 International (CC BY 4.0)">
          <v-img class="mr-2" width="30" height="30" :src="require('./assets/cc.svg')" alt="CC" />
          </a>
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" title="Creative Commons Attribution 4.0 International (CC BY 4.0)">
          <v-img width="30" height="30" :src="require('./assets/by.svg')" alt="BY" />
          </a>
          </v-row>
          
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Auth from './mixins/auth'
export default {
  name: 'App',
  mixins: [Auth],
  components: {
  },

  data: () => ({
  }),
  computed: {
    showLargeLogo() {
      switch (this.$vuetify.breakpoint.name) {
          case 'xs': return true; 
          case 'sm': 
          case 'md': return false;
          case 'lg': 
          case 'xl': return true;
      }
    },
    ...mapGetters(['notification'])
  }
}
</script>
