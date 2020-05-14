<template>
  <v-card>
    <v-card-title>
      Countries
      <action-button tooltip color="primary" v-if="isEditor" @click="$emit('create')" />
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
    
    <template v-slot:item.actions="{ item }">
    <action-button tooltip text="Edit" icon="mdi-pencil" color="primary" v-if="isEditor" @click="$emit('edit', item)" />
    </template>

    </v-data-table>
  </v-card>
</template>

<script>

import ListTable from '../mixins/list-table'


export default {
  name: 'CountriesTable',
  mixins: [ ListTable ],
  data () {
    return {
      searchFields: [
        { text: 'Country name', valueField: 'id', textField: ['code','name'], searchField: ['name'] },
      ],
      headers: [
        { text: 'Country Name', value: 'name' },
        { text: 'Code', value: 'code'},
        { text: 'Code (2 leters)', value: 'codeAlpha2'},
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
