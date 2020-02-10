<template>
  <v-card>
    <v-card-title>
      Datasets
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
    
    <template v-slot:item.name="{ item }">
      <entity-link-cell :text="item.name" tooltip="View the dataset detail" :link="`/dataset/${item.id}`" />
    </template>
    
  <template v-slot:item.uploader="{ item }">
      <entity-link-cell :text="item.uploader" tooltip="Send an email to the uploader" icon="mdi-email-outline" :link="`mailto:${item.email}`" />
    </template>

    <template v-slot:item.uploaded="{ item }">
      {{ new Date(item.uploaded) }}
    </template>

    <template v-slot:item.approved="{ item }">
      <v-icon>{{ item.imported ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline' }}</v-icon>
    </template>

    <template v-slot:item.actions="{ item }">
    <entity-link-cell tooltip="Set as filter in the data explorer" :link="`data/dataset/${item.id}`" icon="mdi-filter" />
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
        { text: 'Dataset name', valueField: 'id', textField: 'name' },
        { text: 'Authors', valueField: 'id', textField: 'authors' },
        { text: 'Uploader', valueField: 'id', textField: 'uploader' },
      ],
      headers: [
        { text: 'Dataset Name', value: 'name' },
        { text: 'Authors', value: 'authors' },
        { text: 'Uploader', value: 'uploader'},
        { text: 'Uploaded', value: 'uploaded'},
        { text: 'Approved', value: 'approved'},
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
