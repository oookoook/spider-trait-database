<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ item.name }} </v-card-title>
      <v-card-subtitle><v-breadcrumbs class="px-0" :items="breadcrumbs"/></v-card-subtitle>
      <v-card-text v-if="item">
      {{ item.notes }}
      </v-card-text>
        <v-list  v-if="item" three-line>
          <list-item title="DOI" icon="mdi-protocol" >
            <a v-if="item.doi" :href="`https://doi.org/${item.doi}`">{{ item.doi}}</a>
            <span v-else>Not assigned</span>
          </list-item>
          <list-item title="Uploader" :text="item.uploader" icon="mdi-account" />
          <list-item v-if="showUpdate" title="Uploader contact" :text="item.email" icon="mdi-at" :link="`mailto:${item.email}`" link-icon="mdi-email-outline" link-tooltip="Send an email to the uploader" external/>
          <list-item title="First author ORCID" v-if="item.orcid" :text="item.orcid" icon="mdi-email-edit-outline" />
          <list-item title="Uploaded" :text="new Date(item.date).toISOString().substring(0,10)" icon="mdi-calendar" />
          <list-item title="Record count" :text="item.records" icon="mdi-numeric" />
          <list-item title="State" icon="mdi-checkbox-marked-outline" ><span style="text-transform: capitalize;">{{item.state}}</span></list-item>
          <list-item title="Restricted access" :icon="item.restricted ? 'mdi-lock-outline' : 'mdi-lock-open-outline'"><span v-if="item.restricted" class="warning--text">Restricted</span><span v-else>Free</span></list-item>    
          <list-item title="Author email(s)" v-if="showUpdate && item.authorsEmail" :text="item.authorsEmail" icon="mdi-email-edit-outline" />
          <!--<list-item title="Author(s)" :text="item.authors" icon="mdi-account-edit-outline" />-->
          <v-subheader inset class="overline">Authors</v-subheader>
          <list-item v-for="(a,i) in parseAuthors(item.authors)" :title="a.name" :key="`author${i}`" icon="mdi-account-edit-outline" :text="getAuthorText(a)" :link="getAuthorLink(a)" link-tooltip="View ORCID profile" external />
        </v-list>
        <v-card-actions  v-if="item">
          <v-btn text :to="`/data/dataset/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
          <v-btn v-if="showUpdate" text color="warning" @click="$emit('edit')"><v-icon left>mdi-pencil-outline</v-icon>Edit</v-btn>
          <v-btn v-if="showUpdate" text color="warning" :to="`/prepare/transfer/${item.id}`"><v-icon left>mdi-table-edit</v-icon>Edit the data</v-btn>
          <action-button icon="mdi-protocol" :loading="doiLoading" v-if="showUpdate && doiCreationAllowed" @click="createDoi" color="primary" text="Create DOI" />
          <action-button icon="mdi-refresh" :loading="doiLoading" v-if="showUpdate && item.doi" @click="updateFromDoi" color="warning" text="Update dataset from DOI" />
          <action-button icon="mdi-protocol" :loading="doiLoading" v-if="showUpdate && item.doiEditUrl" :link="item.doiEditUrl" external color="warning" text="Edit DOI record" />
        </v-card-actions>
      <!--  -->
  </v-card>
</template>

<script>

import ListItem from '../components/ListItem'
import ActionButton from '../components/ActionButton.vue'
import AuthorsParser from '../mixins/authors-parser'

export default {
  name: 'DatasetDetail',
  components: {
    ListItem,
    ActionButton
  },
  mixins: [AuthorsParser],
  props: { item: Object, loading: Boolean, showUpdate: Boolean, breadcrumbs: Array },
  data () {
    return {
      doiLoading: false,
    }
  },
  computed: {
    doiCreationAllowed() {
      if(!this.item) {
        return false;
      }
      return !this.item.doi /*&& !!this.value.orcid */ && !!this.item.authors && this.item.state == 'approved';
    }
  },
  watch: {

  },
  methods: {
    async createDoi() {
      this.doiLoading = true;
      console.debug('create doi called');
      let r = await this.$store.dispatch('doi/create', { id: this.item.id });
      console.debug('create doir result', r);
      await this.$store.dispatch(`datasets/get`, { id: this.item.id });
      this.$store.dispatch('notify', { text: 'DOI record created. '});
      this.doiLoading = false;
      // button should appear automatically
      //window.open(this.item.doiEditUrl, '_blank');
    },
    updateFromDoi() {
      this.doiLoading = true;
      console.debug('create doi called');
      this.$store.dispatch('doi/get', { id: this.item.id }).then((d) => {
        if(d.name != this.item.name || d.authors != this.item.authors) {
          return this.$store.dispatch(`datasets/update`, d)
        } else {

          return Promise.resolve(true);
        }
      }).then((r) => {
            if(r.id) {
              // update was performed
              this.$store.dispatch('notify', { text: 'Dataset was updated. '});
              return this.$store.dispatch(`datasets/get`,{ id: this.item.id });
            } else {
              this.$store.dispatch('notify', { text: 'Dataset is up-to-date. '});
              return Promise.resolve(true);
            }
      }).then(() => {
        this.doiLoading = false;
      })

    },
    getAuthorText(a) {
      let info = [];
      if(a.affiliation) {
        info.push(a.affiliation);
      }
      if(a.orcid) {
        info.push(`ORCID ${a.orcid}`);
      }
      return info.join(', ');
    },
    getAuthorLink(a) {
      if(!a.orcid) {
        return null;
      }
      return `https://orcid.org/${a.orcid}`;
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
