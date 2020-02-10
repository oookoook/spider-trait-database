<template>
  <v-card>
    <v-card-title>
      Locations
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
    
    <template v-slot:item.locality="{ item }">
      <entity-link-cell :text="item.locality" tooltip="View the location detail" :link="`/locations/${item.id}`" />
    </template>
    

    <template v-slot:item.actions="{ item }">
      <entity-link-cell tooltip="Set as filter in the data explorer" :link="`data/location/${item.id}`" icon="mdi-location" />
    </template>
    </v-data-table>
  </v-card>
</template>

<script>

import ListTable from '../mixins/list-table'

export default {
  name: 'LocationsTable',
  mixins: [ ListTable ],
  data () {
    return {
      searchFields: [
        { text: 'Country', valueField: 'country.id', textField: ['country.code', 'country.name'], searchField: ['country.name']},
        { text: 'Global habitat (IUCN)', valueField: 'habitatGlobal.id', textField: 'habitatGlobal.name'},
        { text: 'Locality', valueField: 'locality' }
      ],
      headers: [
        { text: 'Locality', value: 'locality' },
        { text: 'Country code', value: 'country.code' },
        { text: 'Country name', value: 'country.name' },
        { text: 'Global habitat (IUCN)', value: 'habitatGlobal.name' },
        { text: 'Actions', value: 'actions'}
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
