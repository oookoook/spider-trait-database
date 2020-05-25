<template>
  <v-app dark>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>
        <router-link style="color:white;text-decoration:none" to="/"><v-icon left>mdi-spider</v-icon>Spider Trait Database</router-link>
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
          <v-list-item-content><v-list-item-title>Taxonomy</v-list-item-title></v-list-item-content>
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

    <v-menu right bottom offset-y v-if="user">
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
          <v-list-item-content><v-list-item-title>Approve datasets</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn v-if="isAdmin"
        to="/admin"
        text
      ><v-icon left>mdi-cogs</v-icon> Administration 
    </v-btn>
    <v-menu right bottom offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on"><v-icon left>mdi-help</v-icon> Help<v-icon right>mdi-chevron-down</v-icon></v-btn>
      </template>
      <v-list>
        <v-list-item to="/about">
          <v-list-item-icon><v-icon>mdi-frequently-asked-questions</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>About project</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item href="https://github.com/oookoook/spider-trait-database/blob/master/docs/data-submission.md" target="_blank">
          <v-list-item-icon><v-icon>mdi-share</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Data submission</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item v-if="user" href="https://github.com/oookoook/spider-trait-database/blob/master/docs/editor-howto.md" target="_blank">
          <v-list-item-icon><v-icon>mdi-lifebuoy</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Data editor How To</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/terms">
          <v-list-item-icon><v-icon>mdi-format-list-numbered</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Terms of service</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/policy">
          <v-list-item-icon><v-icon>mdi-shield-check-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Policy statement</v-list-item-title></v-list-item-content>
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
    <v-snackbar absolute
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

    <v-content>
      <router-view></router-view>
    </v-content>
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
    ...mapGetters(['notification'])
  }
}
</script>
