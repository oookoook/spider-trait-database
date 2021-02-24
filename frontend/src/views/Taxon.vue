<template>
  <!-- TODO rework to suport edits -->
  <entity-detail entity="species" list="taxonomy" v-slot="{item, showUpdate, onEdit}">
    <taxon-detail
          :item="item"
          :show-update="showUpdate"
          @edit="onEdit"
    />
  </entity-detail>
  
  <!--
  <v-container>
  <entity-provider list="taxonomy" :id="id" v-slot="i">
    <taxon-detail :item="i.item" />
  </entity-provider>
  
  <list-provider v-if="id" list="data" entity="species" :id="id"  v-slot="i">
    <v-card>
      <v-card-title>Data preview</v-card-title>
      <data-preview-table :items="i.items" :loading="i.loading" :total="i.total" @update="i.update"/>
    </v-card>
  </list-provider>
  
  </v-container>
  -->
</template>

<script>

import IdFromLsid from '../mixins/id-from-lsid' 
/*
import IdFromRoute from '../mixins/id-from-route' 
import EntityProvider from '../components/EntityProvider'
import ListProvider from '../components/ListProvider'
import TaxonDetail from '../components/TaxonDetail'
import Taxons from '../mixins/taxons'
import DataPreviewTable from '../components/DataPreviewTable'
*/
import EntityDetail from '../components/EntityDetail'
import TaxonDetail from '../components/TaxonDetail'

export default {
  name: 'taxon',
  components: {
    EntityDetail,
    TaxonDetail
  },
  
  mixins: [IdFromLsid],
  /*
  components: {
    EntityProvider,
    TaxonDetail,
    ListProvider,
    DataPreviewTable
  },
  */
  props: [],
  data () {
    return {
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
