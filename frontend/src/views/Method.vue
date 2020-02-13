<template>
  <v-container>
  <entity-provider list="methods" :id="id" v-slot="i">
    <trait-detail :item="i.item" />
  </entity-provider>
  
  <list-provider v-if="id" list="data" entity="method" :id="id" v-slot="i">
    <data-preview-table  :items="i.items" :loading="i.loading" :total="i.total" @update="i.update"/>
  </list-provider>
  
  </v-container>
</template>

<script>
import IdFromRoute from '../mixins/id-from-route' 
import EntityProvider from '../components/EntityProvider'
import ListProvider from '../components/ListProvider'
import MethodDetail from '../components/MethodDetail'
import DataPreviewTable from '../components/DataPreviewTable'
export default {
  name: 'method',
  mixins: [IdFromRoute],
  components: {
    EntityProvider,
    MethodDetail,
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
