<template>
  <v-card>
    <v-card-title>
      Locations
      <action-button tooltip color="primary" v-if="isEditor" to="/locations/new" />
      <v-spacer></v-spacer>
      <!--
      <list-filter 
      :search-fields="searchFields" 
      :autocomplete-loading="autocompleteLoading" 
      :autocomplete-items="autocompleteItems" 
      @autocomplete="autocomplete"
      v-model="search"/>
      -->
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
    
    <template v-slot:item.abbrev="{ item }">
      <entity-link-cell :text="item.abbrev" tooltip="View the location detail" :link="`/locations/${item.id}`" />
    </template>
    
    <template v-slot:item.coords="{ item }">
      <entity-link-cell v-if="item.coords" tooltip="View in Google Maps" :link="getGMapsLink(item.coords)" icon="mdi-crosshairs-gps" external />
    </template>

    <template v-slot:item.actions="{ item }">
      <entity-link-cell tooltip="Set as filter in the data explorer" :link="`data/location/${item.id}`" icon="mdi-filter" />
    </template>
    </v-data-table>
  </v-card>
</template>

<script>


import ListTable from '../mixins/list-table'
import Locations from '../mixins/locations'
export default {
  name: 'LocationsTable',
  mixins: [ ListTable, Locations ],
  data () {
    return {
      searchFields: [
        //{ text: 'Country', valueField: 'country.id', textField: ['country.code', 'country.name'], searchField: ['country.name']},
      ],
      headers: [
        { text: 'Abbreviation', value: 'abbrev' },
        //{ text: 'Country code', value: 'country.code' },
        //{ text: 'Country name', value: 'country.name' },
        { text: 'Coordinates', value: 'coords' },
        //{ text: 'Global habitat (IUCN)', value: 'habitatGlobal.name' },
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
