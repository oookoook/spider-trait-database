<template>
  <v-container>
    <auth-section admin>
    <h2>Administration</h2>
    <p>This page contains links to services for user and resource management.</p>
    <v-expansion-panels
      v-model="panel"
      multiple
    >
    <v-expansion-panel>
    <v-expansion-panel-header><h3><v-icon color="primary" left>mdi-account-multiple</v-icon> User management</h3></v-expansion-panel-header>
    <v-expansion-panel-content>
      <h4>Creating a new user</h4>
        <p>If the new user has no affiliation with Masaryk University (i.e. tehy don't have the UČO), a new Guest account has to be created. If the user has an affiliation
          with MUNI, you can skip this step.
          You can create a new user in the <a href="https://inet.muni.cz/app/iam/guest" target="_blank">INET</a> system. Save the password that the system shows to you and send it to the account owner. The new user
        will be assigned an unique idetifier (UČO) that will be used for assigning user privileges.</p>
        <v-row class="pb-3"><action-button color="primary" text="Create user account(s)" icon="mdi-account-plus-outline" link="https://inet.muni.cz/app/iam/guest" /></v-row>
      <h4>Assigning user privileges</h4>
        <p>Every user ho should be able to contribute data or approve them has to be assigned to one of the following user groups. Users in the higher-privilege groups
          automatically gain privileges of the lower groups (e.g. editor can also contribute, admin can also edit and contribute). It is sufficient to add the user to only one group.</p>
        <p>The actual user management happens in the Perun identity management system. Following links lead to a page where users can be added or removed from the user groups using their
          uniqe identifier (UČO).</p>
        <!--
        <v-list>
        <v-list-item href="https://perun.aai.muni.cz/organizations/363/groups/6484/members" target="_blank">
          <v-list-item-icon>
            <v-icon>mdi-share</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Contributors</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="https://perun.aai.muni.cz/organizations/363/groups/6483/members" target="_blank">
          <v-list-item-icon>
            <v-icon>mdi-stamper</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Editors</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="https://perun.aai.muni.cz/organizations/363/groups/6482/members" target="_blank">
          <v-list-item-icon>
            <v-icon>mdi-cogs</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Administrators</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
    </v-list>
    -->
    <v-row>
      <!-- links to the new IDM version
    <action-button color="primary" text="Contributors" icon="mdi-share" link="https://perun.aai.muni.cz/organizations/363/groups/6484/members" />
    <action-button color="primary" text="Editors" icon="mdi-stamper" link="https://perun.aai.muni.cz/organizations/363/groups/6483/members" />
    <action-button color="primary" text="Administrators" icon="mdi-cogs" link="https://perun.aai.muni.cz/organizations/363/groups/6482/members" />  
     -->

     <action-button color="primary" text="Contributors" icon="mdi-share" link="https://idm.ics.muni.cz/fed/gui/#grp/detail?id=6484&amp;active=1;" />
    <action-button color="primary" text="Editors" icon="mdi-stamper" link="https://idm.ics.muni.cz/fed/gui/#grp/detail?id=6483&amp;active=1;" />
    <action-button color="primary" text="Administrators" icon="mdi-cogs" link="https://idm.ics.muni.cz/fed/gui/#grp/detail?id=6482&amp;active=1;" />  
    </v-row>

      </v-expansion-panel-content>
    </v-expansion-panel>  
    <v-expansion-panel>
    <v-expansion-panel-header><h3><v-icon color="primary" left>mdi-server</v-icon> Resource management</h3></v-expansion-panel-header>
    <v-expansion-panel-content>
    <p>The OpenStack management interface for the virtual machine the web runs on is available from 
      <a href="https://dashboard.cloud.muni.cz/" target="_blank">https://dashboard.cloud.muni.cz/</a>.</p>
      <p>If you are able to see this page, you should be also able to log in there. The access is automatically granted to all members of the Admin group.</p>
    </v-expansion-panel-content>
    </v-expansion-panel>  
    <v-expansion-panel>
    <v-expansion-panel-header><h3><v-icon color="primary" left>mdi-code-tags</v-icon> Source code</h3></v-expansion-panel-header>
    <v-expansion-panel-content>
    <p>The source code of the app is available at <a href="https://github.com/oookoook/spider-trait-database" target="_blank">https://github.com/oookoook/spider-trait-database</a>.</p>
    </v-expansion-panel-content>
    </v-expansion-panel>
    </v-expansion-panels>
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
      panel: [0]
    }
  },
  computed: {

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
