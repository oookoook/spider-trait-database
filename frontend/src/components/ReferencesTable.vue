<template>
  <v-card>
    <v-card-title>
      References
      <action-button tooltip color="primary" v-if="isEditor" to="/references/new" />
      <v-spacer></v-spacer>
      <list-filter 
      :search-fields="searchFields" 
      :autocomplete-loading="autocompleteLoading" 
      :autocomplete-items="autocompleteItems" 
      @autocomplete="autocomplete"
      v-model="search"
      />
    </v-card-title>
  <v-data-table
      :headers="headers"
      :footer-props="footerProps"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
      sort-by="fullCitation"
    >
    
    <template v-slot:item.abbrev="{ item }">
      <entity-link-cell new-tab :text="item.abbrev" tooltip="View the reference detail" :link="`/references/${item.id}`" />
    </template>

    <template v-slot:item.doi="{ item }">
      <entity-link-cell v-if="item.doi" :text="item.doi" tooltip="View the source document" external :link="getDOILink(item.doi)" />
    </template>

    <template v-slot:item.actions="{ item }">
    <entity-link-cell tooltip="Set as filter in the data explorer" :link="`data/reference/${item.id}`" icon="mdi-filter" />
    </template>

    </v-data-table>
  </v-card>
</template>

<script>

import ListTable from '../mixins/list-table'

export default {
  name: 'MReferencesTable',
  mixins: [ ListTable ],
  data () {
    return {
      searchFields: [
        { text: 'Reference', valueField: 'id', textField: ['abbrev','fullCitation'], searchField: ['fullCitation'] },
      ],
      headers: [
        { text: 'Abbreviation', value: 'abbrev' },
        { text: 'Full citation', value: 'fullCitation' },
        { text: 'Actions', value: 'actions', sortable: false}
      ]
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getDOILink(doi) {
      if(!doi) {
        return null;
      }
      return doi.replace('doi:', 'https://doi.org/');
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
