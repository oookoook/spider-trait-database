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
      <p>The identity management for the WAT DB is performed using the Perun Indetity Management System provided by Masaryk University. A detailed documentation for the Perun Identity Management system is available at the <a href="https://it.muni.cz/en/services/group-and-access-management-at-muni" target="_blank">Masaryk University IT services catalog</a>.</p>
      <h4>Creating a new user</h4>
        
        <p>If a new user has no affiliation with Masaryk University (i.e., he/she does not have a UCO number), a new Guest account 
        has to be created. The administrator can create a new user in the <a href="https://perun.aai.muni.cz/organizations/363/sponsoredMembers" target="_blank">Perun</a> system. The password that the system generates should 
        be saved and sent to the account owner. The new user will be assigned a unique identifier (UCO) that will be used for assigning 
        user privileges.</p>
        <p>Every new user has to be assigned to one of the following user groups: contributor, editor, or administrator. 
        It is sufficient to add the user to only one group.</p>

      <p>The current user management takes place in the Perun identity management system. The following links lead to a page where users 
        can be added or removed from user groups using their unique identifier (UCO).</p>
        <v-row class="pb-3"><action-button color="primary" text="Create user account(s)" icon="mdi-account-plus-outline" link="https://perun.aai.muni.cz/organizations/363/sponsoredMembers" /></v-row>
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
     <!-- links to the new IDM version -->
    <action-button color="primary" text="Contributors" icon="mdi-share" link="https://perun.aai.muni.cz/organizations/363/groups/6484/members" />
    <action-button color="primary" text="Editors" icon="mdi-stamper" link="https://perun.aai.muni.cz/organizations/363/groups/6483/members" />
    <action-button color="primary" text="Administrators" icon="mdi-cogs" link="https://perun.aai.muni.cz/organizations/363/groups/6482/members" />  
     
    <!-- links to the old IDM version
     <action-button color="primary" text="Contributors" icon="mdi-share" link="https://idm.ics.muni.cz/fed/gui/#grp/detail?id=6484&amp;active=1;" />
    <action-button color="primary" text="Editors" icon="mdi-stamper" link="https://idm.ics.muni.cz/fed/gui/#grp/detail?id=6483&amp;active=1;" />
    <action-button color="primary" text="Administrators" icon="mdi-cogs" link="https://idm.ics.muni.cz/fed/gui/#grp/detail?id=6482&amp;active=1;" />  
    -->
    </v-row>

      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
    <v-expansion-panel-header><h3><v-icon color="primary" left>mdi-bookmark-multiple</v-icon> Publications list</h3></v-expansion-panel-header>
    <v-expansion-panel-content>
    <p>The source code of the Publications page is available at <a href="https://github.com/oookoook/spider-trait-database/blob/master/docs/publications.md" target="_blank">GitHub</a>.</p>
    <p>To edit the content of the home page, you must have a GitHub account. Then contact the <a href="mailto:adam@nastojte.cz">repository owner</a> to give you the rights allowing page editing.</p>
    <p>This page uses the <a href="https://www.markdownguide.org/basic-syntax/" target="_blank">MarkDown</a> syntax. After making any changes, the page is automatically updated in the application.</p>
    </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
    <v-expansion-panel-header><h3><v-icon color="primary" left>mdi-google-analytics</v-icon> Visitor statistics</h3></v-expansion-panel-header>
    <v-expansion-panel-content>
    <p>Usage statistics for this site (e.g. number of visits) are available from <a href="https://analytics.google.com/analytics" target="_blank">Google Analytics</a>.</p>
      <p>Access can be granted administrators of the project. An Google account (e.g. GMail or Google Suite account) is required.</p>
    </v-expansion-panel-content>
    </v-expansion-panel>  
    <v-expansion-panel>
    <v-expansion-panel-header><h3><v-icon color="primary" left>mdi-server</v-icon> Resource management</h3></v-expansion-panel-header>
    <v-expansion-panel-content>
    <p>The OpenStack management interface for the virtual machine on which the web runs is available from 
      <a href="https://dashboard.cloud.muni.cz/" target="_blank">https://dashboard.cloud.muni.cz/</a>.</p>
      <p>If you are see this page, you should be also able to log in. The access is automatically granted to all members of the Admin group.</p>
    </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
    <v-expansion-panel-header><h3><v-icon color="primary" left>mdi-database-check</v-icon> Database backups</h3></v-expansion-panel-header>
    <v-expansion-panel-content>
    <p>The database backups are performed using the Bacula tool and stored on the tape storage at the ICS MU. More information and guidelines (in Czech) are available at 
      <a href="https://it.muni.cz/sluzby/zalohovani-bacula" target="_blank">https://it.muni.cz/sluzby/zalohovani-bacula</a>.</p>
      <p>Full database backup takes place every second Friday of a month. In all the other days an incremental backup is made (predefined policy no. 2). The backups are retained for one year on the tape storage.</p>
      <p>The database backup information and scripts are located in the <a href="https://github.com/oookoook/spider-trait-database/tree/master/db#setting-up-the-database-backups" target="_blank">GitHub source code repository</a>.</p>
      <p>Refer to <a href="https://mariadb.com/kb/en/incremental-backup-and-restore-with-mariabackup/" target="_blank">MariaDB documentation</a> for instructions on backup restore procedure.</p>
    </v-expansion-panel-content>
    </v-expansion-panel>  
    <v-expansion-panel>
    <v-expansion-panel-header><h3><v-icon color="primary" left>mdi-code-tags</v-icon> Source code</h3></v-expansion-panel-header>
    <v-expansion-panel-content>
    <p>The source code of the app is available from <a href="https://github.com/oookoook/spider-trait-database" target="_blank">https://github.com/oookoook/spider-trait-database</a>.</p>
    <p><!-- For editing the content of the home page, you have to have a GitHub account. Then contact the <a href="mailto:adam@nastojte.cz">repository owner</a> to add you the rights to edit the source code.-->The content of the home page can be edited in the <a href="https://github.com/oookoook/spider-trait-database/blob/master/frontend/src/views/Home.vue" target="_blank"> Home.vue</a> file. After making changes to the source code, a new version must be deployed.</p>
    <p>To deploy a new version of the app, perform the following steps:</p>
    <ul>
      <li>Get the private SSH key from the <a href="https://github.com/oookoook/spider-trait-database-admin" target="_blank">private project repository</a>. Contact any of the repository admins to get an access.</li>
      <li>Connect to the production server using SSH and the downloaded SSH key, e.g. <code>ssh -i ~/spider-trait-database.pem centos@spidertraits.sci.muni.cz</code>.</li>
      <li>Run the following command in the terminal: <code>cd /opt/spidertraits/spider-trait-database/ &amp;&amp; ./build</code></li>
      <li>Once deployment ends, you can close the SSH connection.</li>
    </ul>
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
