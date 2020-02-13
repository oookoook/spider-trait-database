<template>
  <v-container>
  <entity-provider list="datasets" :id="id" v-slot="i">
    <dataset-detail :item="i.item" />
  </entity-provider>
  
  <list-provider v-if="id" list="data" v-slot="i" entity="dataset" :id="id" >
    <data-preview-table :items="i.items" :loading="i.loading" :total="i.total" @update="i.update"/>
  </list-provider>
  
  </v-container>
</template>

<script>
import IdFromRoute from '../mixins/id-from-route' 
import EntityProvider from '../components/EntityProvider'
import ListProvider from '../components/ListProvider'
import DatasetDetail from '../components/DatasetDetail'
import DataPreviewTable from '../components/DataPreviewTable'
export default {
  name: 'dataset',
  mixins: [IdFromRoute],
  components: {
    EntityProvider,
    DatasettDetail,
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
