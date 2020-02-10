<template>
  <v-card>
    <v-card-title>
      References
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
      <entity-link-cell :text="item.abbrev" tooltip="View the reference detail" :link="`/references/${item.id}`" />
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        {{ item.fullCitation }}
      </td>
    </template>

    <template v-slot:item.doi="{ item }">
      <entity-link-cell :text="item.doi" tooltip="View the source paper" external :link="getDOILink(item.doi)" />
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
  name: 'MethodsTable',
  mixins: [ ListTable ],
  data () {
    return {
      searchFields: [
        { text: 'Reference', valueField: 'id', textField: ['abbrev','fullCitation'], searchField: ['fullCitation'] },
      ],
      headers: [
        { text: 'Reference ID', value: 'abbrev' },
        { text: 'Full citation', value: 'data-table-expand' },
        { text: 'DOI', value: 'doi' },
        { text: 'Actions', value: 'actions'}
      ]
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getDOILink(doi) {
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
