<template>
  <v-container>
    
    <h2>REST API</h2>
    <p>The WSTDB provides an REST API for programmatic access.</p>
    <p>Visit the <a href="https://github.com/oookoook/spider-trait-database/blob/master/docs/api.md" target="_blank">API documentation page</a> for more details. You can also inspect the API using the browser Developer tools.</p>
    <p>To fully use the API (e.g. view items with restricted access), you have to have an user account.</p>
    <auth-section>
    <p>You will need to provide a <a href="https://en.wikipedia.org/wiki/Basic_access_authentication" target="_blank">Basic auth in HTTP Authorization header</a> with your login and dedicated API key which you can view here.</p>
    <p>The <code>Authorization</code> header consists of your user name and API key joined by semicolon. The whole string is then Base64-encoded and prefixed with <code>Basic</code> keyword. The following table provides all the required information.</p>
    <v-btn color="primary" @click="getApiKey"><v-icon left>mdi-code-json</v-icon> View API credentials</v-btn>
    <v-simple-table v-if="user && apiKey">
      <thead>
        <tr><td>Description</td><td>Value</td></tr>
      </thead>
      <tbody>
        <tr><td>User name</td><td><code>{{ user.sub }}</code></td></tr>
        <tr><td>API Key</td><td><code>{{ apiKey }}</code></td></tr>
        <tr><td>Base64-encoded header</td><td><code>{{ 'Basic ' + header }}</code></td></tr>
      </tbody>
    </v-simple-table>
    <v-skeleton-loader type="table" v-if="loading" />
    </auth-section>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ActionButton from '../components/ActionButton'
import AuthSection from '../components/AuthSection'

export default {
  name: 'admin',
  components: {
    ActionButton,
    AuthSection
  },
  props: [],
  data () {
    return {
      loading: false
    }
  },
  computed: {
    header() {
      return btoa(`${this.user.sub}:${this.apiKey}`)
    },
    ...mapGetters(['user', 'apiKey'])
  },
  watch: {

  },
  methods: {
    getApiKey() {
      this.loading = true;
      this.$store.dispatch('getApiKey', {}).then(()=> {this.loading = false;});
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped>

</style>
