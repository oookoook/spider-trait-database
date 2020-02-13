<template>
  <v-container>
  <entity-provider list="references" :id="id" v-slot="i">
    <reference-detail :item="i.item" />
  </entity-provider>
  
  <list-provider v-if="id" list="data" entity="reference" :id="id" v-slot="i">
    <data-preview-table  :items="i.items" :loading="i.loading" :total="i.total" @update="i.update"/>
  </list-provider>
  
  </v-container>
</template>

<script>
import IdFromRoute from '../mixins/id-from-route' 
import EntityProvider from '../components/EntityProvider'
import ListProvider from '../components/ListProvider'
import ReferenceDetail from '../components/ReferenceDetail'
import DataPreviewTable from '../components/DataPreviewTable'
export default {
  name: 'reference',
  mixins: [IdFromRoute],
  components: {
    EntityProvider,
    ReferenceDetail,
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
