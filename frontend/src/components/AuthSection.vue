<template>
  <div>
    <v-card v-if="!user">
      <v-card-title><v-icon color="warning" left>mdi-cancel</v-icon>Authentication required</v-card-title>
      <v-card-text>You must be logged in to access this section of the portal. Please sign in or request access by writing an email to the administrators of the
        Spider Trait Database (<a :href="`mailto:${adminMail}`">{{adminMail}}</a>).
      </v-card-text>
    <v-card-actions>
      <v-btn text :href="loginUrl"><v-icon color="primary" left>mdi-account-arrow-right-outline</v-icon>  Log in </v-btn>
      <v-btn text :href="mailLink" target="_blank"><v-icon left>mdi-email-edit-outline</v-icon>  Request access </v-btn>
    </v-card-actions>
    </v-card>
    <slot v-else>
    </slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AuthSection',
  components: {
  },
  props: [],
  data () {
    return {
      // https://mailtolink.me/
      mailLink: 'mailto:spidertraits@group.muni.cz?subject=Spider%20Traits%3A%20Request%20for%20Access&body=Hello%2C%20I%20would%20like%20to%20request%20the%20access%20for%20the%20Spider%20Traits%20Database%20access.%0D%0A%0D%0A---%20Please%20provide%20more%20detail%20about%20your%20request%20(e.g.%20information%20about%20the%20data%20you%20want%20to%20upload)%3A%20---',
      adminMail: 'spidertraits@group.muni.cz',
    }
  },
  computed: {
    ...mapGetters(['user', 'loginUrl'])
  },
  watch: {

  },
  methods: {

  },
  created () {

  },
  mounted () {
  }
}
</script>
<style scoped>

</style>
