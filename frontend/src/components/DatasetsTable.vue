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
      :footer-props="footerProps"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
      sort-by="uploaded"
      :sort-desc="true"
    >
    
    <template v-slot:item.name="{ item }">
      <entity-link-cell :text="item.name" tooltip="View the dataset detail" :link="`/datasets/${item.id}`" />
    </template>
    
  <template v-slot:item.uploader="{ item }">
      <entity-link-cell v-if="isEditor" :text="item.uploader" tooltip="Send an email to the uploader" icon="mdi-email-outline" :link="`mailto:${item.email}`" external />
      <span v-else>{{ item.uploader }}</span>
    </template>

    <template v-slot:item.uploaded="{ item }">
      {{ new Date(item.date).toISOString().substr(0,10) }}
    </template>

    <template v-slot:item.restricted="{ item }">
      <info-icon color="warning" text="Restricted access" v-if="item.restricted" icon="mdi-lock-outline"></info-icon>
      <info-icon color="success" text="Free access" icon="mdi-lock-open-outline" v-else></info-icon>
    </template>

    <!--
    <template v-slot:item.approved="{ item }">
      <v-icon>{{ item.imported > 1 ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline' }}</v-icon>
    </template>
  -->
    <template v-slot:item.actions="{ item }">
    <entity-link-cell tooltip="Set as filter in the data explorer" :link="`data/dataset/${item.id}`" icon="mdi-filter" />
    </template>

    </v-data-table>
  </v-card>
</template>

<script>

import ListTable from '../mixins/list-table'
export default {
  name: 'DatasetsTable',
  mixins: [ ListTable ],
  data () {
    return {
      searchFields: [
        { text: 'Dataset name', valueField: 'id', textField: 'name' },
        { text: 'Authors', valueField: 'authors' },
        { text: 'Uploader', valueField: 'uploader' },
      ],
      headers: [
        { text: 'Dataset Name', value: 'name' },
        { text: 'Records', value: 'records'},
        { text: 'Authors', value: 'authors', width: 300 },
        { text: 'Uploader', value: 'uploader', width: 300 },
        { text: 'Uploaded', value: 'uploaded'},
        { text: 'Restricted access', value: 'restricted'},
        //{ text: 'Approved', value: 'approved'},
        { text: 'Actions', value: 'actions', sortable: false }
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
