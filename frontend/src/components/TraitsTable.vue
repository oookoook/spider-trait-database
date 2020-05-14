<template>
  <v-card>
    <v-card-title>
      Traits 
      <action-button tooltip color="primary" v-if="isEditor" to="/traits/new" />
      <v-spacer></v-spacer>
      <list-filter 
      :search-fields="searchFields" 
      :autocomplete-loading="autocompleteLoading" 
      :autocomplete-items="autocompleteItems" 
      @autocomplete="autocomplete"
      v-model="search"/>
      <!--
      <v-text-field
        v-model="search"
        clearable
        append-outer-icon="mdi-magnify"
        label="Search by trait name"
        single-line
        hide-details
        @click:append-outer="needsCount = true; update()"
      ></v-text-field>
      -->
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
      <entity-link-cell :text="item.abbrev" tooltip="View the trait detail" :link="`/traits/${item.id}`" />
    </template>

    <template v-slot:item.actions="{ item }">
    <entity-link-cell tooltip="Set as filter in the data explorer" :link="`data/trait/${item.id}`" icon="mdi-filter" />
    </template>
    <!--
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">{{item.description}}</td>
    </template>
    -->
    </v-data-table>
  </v-card>
</template>

<script>

import ListTable from '../mixins/list-table'

export default {
  name: 'TraitsTable',
  mixins: [ ListTable ],
  data () {
    return {
      searchFields: [
        { text: 'Category', valueField: 'category.id', textField: 'category.name', showAll: true }, 
        { text: 'Trait name', valueField: 'id', textField: ['abbrev','name'], searchField: ['name'] }],
      headers: [
        { text: 'Abbreviation', value: 'abbrev' },
        { text: 'Category', value: 'category.name' },
        { text: 'Trait Name', value: 'name' },
        { text: 'Description', value: 'description'},
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
