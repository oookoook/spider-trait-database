<template>
  <v-container>
  <entity-provider list="locations" :id="id" v-slot="i">
    <location-detail :item="i.item" />
  </entity-provider>
  
  <list-provider v-if="id" list="data" v-slot="i">
    <data-preview-table entity="location" :id="id" :items="i.items" :loading="i.loading" :total="i.total" @update="i.update"/>
  </list-provider>
  
  </v-container>
</template>

<script>
import IdFromRoute from '../mixins/id-from-route' 
import EntityProvider from '../components/EntityProvider'
import ListProvider from '../components/ListProvider'
import LocationDetail from '../components/LocationDetail'
import DataPreviewTable from '../components/DataPreviewTable'
export default {
  name: 'method',
  mixins: [IdFromRoute],
  components: {
    EntityProvider,
    LocationDetail,
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
