<template>
  <v-app dark>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>Spider Trait Database</v-toolbar-title>


      <v-divider vertical class="mx-5"></v-divider>

      <v-btn
        to="/data"
        text
      ><v-icon left>mdi-magnify</v-icon> View data 
      </v-btn>

      <v-menu right bottom offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on"><v-icon left>mdi-format-list-bulleted-square</v-icon> Browse<v-icon right>mdi-chevron-down</v-icon></v-btn>
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
      </v-list>
    </v-menu>      

    <v-menu right bottom offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on"><v-icon left>mdi-share</v-icon> Contribute<v-icon right>mdi-chevron-down</v-icon></v-btn>
      </template>
      <v-list>
        <v-list-item to="/upload">
          <v-list-item-icon><v-icon>mdi-upload</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Upload</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item to="/prepare">
          <v-list-item-icon><v-icon>mdi-table-edit</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Prepare data</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>


      <v-spacer></v-spacer>

      <v-btn
        href="/user/login"
        text
      ><v-icon left>mdi-account-arrow-right-outline</v-icon>  Log in 
      </v-btn>
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
export default {
  name: 'App',

  components: {
  },

  data: () => ({
  }),
  computed: {
    ...mapGetters(['notification'])
  }
}
</script>
