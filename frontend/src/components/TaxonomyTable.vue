<template>
  <v-card>
    <v-card-title>
      Taxa
      <action-button tooltip color="primary" v-if="isEditor" to="/taxonomy/new" />
      <v-spacer></v-spacer>
      <list-filter 
      :search-fields="searchFields" 
      :autocomplete-loading="autocompleteLoading" 
      :autocomplete-items="autocompleteItems" 
      @autocomplete="autocomplete"
      v-model="search"/>
    </v-card-title>
  <v-data-table
      :headers="headers"
      :footer-props="footerProps"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
    >
    
    <template v-slot:item.taxon="{ item }">
      <entity-link-cell :abbrev="getTaxon(item)" :text="item.lsid || 'No LSID available'" tooltip="View the taxon detail" :link="`/taxonomy/${item.id}`" />
    </template>
    
    <template v-slot:item.valid="{ item }">
      <entity-link-cell v-if="!item.valid" tooltip="View the valid taxon" :link="`/taxonomy/${item.validTaxon.id}`" icon="mdi-content-duplicate" color="warning"/>
      <info-icon v-else color="success" icon="mdi-check" text="This a valid taxon" />
    </template>

    <template v-slot:item.actions="{ item }">
    <entity-link-cell icon="mdi-spider" tooltip="View in the World Spider Catalog (opens in a new tab)" external :link="getWscLink(item)" />

    <entity-link-cell tooltip="Set as filter in the data explorer" :link="`data/species/${item.id}`" icon="mdi-filter" />
    </template>
    </v-data-table>
  </v-card>
</template>

<script>

import ListTable from '../mixins/list-table'
import InfoIcon from './InfoIcon'
import Taxons from '../mixins/taxons'

export default {
  name: 'TaxonomyTable',
  mixins: [ ListTable, Taxons ],
  components: { InfoIcon },
  data () {
    return {
      searchFields: [
        { text: 'Order', valueField: 'order' },
        { text: 'Family', valueField: 'family' }, 
        { text: 'Genus', valueField: 'genus' },
        { text: 'Taxon', valueField: 'id', textField: ['fullName'], searchField: ['fullName']},
        { text: 'Author', valueField: 'author' },
        { text: 'LSID', valueField: 'id', textField: 'lsid' }
      ],
      headers: [
        { text: 'Taxon', value: 'taxon', sortable: false },
        { text: 'Valid', value: 'valid' },
        { text: 'Author', value: 'author'},
        { text: 'Year', value: 'year'},
        { text: 'Order', value: 'order' },
        { text: 'Family', value: 'family' },
        
        //{ text: 'Genus', value: 'genus' },
        //{ text: 'Species', value: 'species' },
        //{ text: 'Subspecies', value: 'subspecies' },
        
        /* { text: 'LSID', value: 'wsc.lsid'}, */
        
        
        /*{ text: 'Reference', value: 'reference'},*/
        { text: 'Actions', value: 'actions', sortable: false}
      ]
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
