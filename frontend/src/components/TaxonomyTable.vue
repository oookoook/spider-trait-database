<template>
  <v-card>
    <v-card-title>
      Taxonomy
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
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
    >
    
    <template v-slot:item.taxon="{ item }">
      <entity-link-cell :abbrev="getTaxon(item)" :text="item.wsc.lsid" tooltip="View the taxon detail" :link="`/taxonomy/${item.id}`" />
    </template>
    

    <template v-slot:item.actions="{ item }">
    <entity-link-cell icon="mdi-spider" tooltip="View in the World Spider Catalog (opens in a new tab)" external :link="`https://wsc.nmbe.ch/species/${item.wsc.id}`" />

    <entity-link-cell tooltip="Set as filter in the data explorer" :link="`data/species/${item.id}`" icon="mdi-filter" />
    </template>
    </v-data-table>
  </v-card>
</template>

<script>

import ListTable from '../mixins/list-table'

export default {
  name: 'TaxonomyTable',
  mixins: [ ListTable ],
  data () {
    return {
      searchFields: [
        { text: 'Family', valueField: 'family' }, 
        { text: 'Genus', valueField: 'genus' },
        { text: 'Taxon', valueField: 'id', textField: ['genus', 'species', 'subspecies'], searchField: ['species']},
        { text: 'Author', valueField: 'author' },
        { text: 'LSID', valueField: 'id', textField: 'wsc.lsid' }
      ],
      headers: [
        { text: 'Taxon', value: 'taxon', sortable: false },
        { text: 'Genus', value: 'genus' },
        { text: 'Species', value: 'species' },
        { text: 'Subspecies', value: 'subspecies' },
        { text: 'Family', value: 'family' },
        /* { text: 'LSID', value: 'wsc.lsid'}, */
        { text: 'Author', value: 'author'},
        { text: 'Year', value: 'year'},
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
    getTaxon(item) {
      var t = [ item.genus, item.species];
      if(item.subspecies) {
        t.push(item.subspecies);
      }
      //console.dir(t);
      return t.join(' ');
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
