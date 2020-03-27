<template>
  <v-card>
    <v-card-title>
      Methods
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
    
    <template v-slot:item.abbrev="{ item }">
      <entity-link-cell :text="item.abbrev" tooltip="View the method detail" :link="`/methods/${item.id}`" />
    </template>
    
    <template v-slot:item.reference="{ item }">
      <entity-link-cell v-if="item.reference.id" :text="item.reference.abbrev" tooltip="View the reference detail" :link="`/references/${item.reference.id}`" />
    </template>

    <template v-slot:item.actions="{ item }">
    <entity-link-cell tooltip="Set as filter in the data explorer" :link="`data/method/${item.id}`" icon="mdi-filter" />
    </template>

    </v-data-table>
  </v-card>
</template>

<script>

import ListTable from '../mixins/list-table'

export default {
  name: 'MethodsTable',
  mixins: [ ListTable ],
  data () {
    return {
      searchFields: [
        { text: 'Method name', valueField: 'id', textField: ['abbrev','name'], searchField: ['name'] },
      ],
      headers: [
        { text: 'Method ID', value: 'abbrev' },
        { text: 'Method Name', value: 'name' },
        { text: 'Reference', value: 'reference'},
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
