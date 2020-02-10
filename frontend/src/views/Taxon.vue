<template>
  <v-container>
  <entity-provider list="taxonomy" :id="id" v-slot="i">
    <taxon-detail :item="i.item" />
  </entity-provider>
  
  <list-provider v-if="id" list="data" v-slot="i">
    <data-preview-table entity="species" :id="id" :items="i.items" :loading="i.loading" :total="i.total" @update="i.update"/>
  </list-provider>
  
  </v-container>
</template>

<script>
import IdFromRoute from '../mixins/id-from-route' 
import EntityProvider from '../components/EntityProvider'
import ListProvider from '../components/ListProvider'
import TaxonDetail from '../components/TaxonDetail'
import DataPreviewTable from '../components/DataPreviewTable'
export default {
  name: 'taxon',
  mixins: [IdFromRoute],
  components: {
    EntityProvider,
    TaxonDetail,
    ListProvider,
    DataPreviewTable
  },
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
