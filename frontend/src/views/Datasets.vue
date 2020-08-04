<template>
<v-container fluid>
  <list-provider list="datasets" v-slot="i">
    <datasets-table :items="i.items" 
    :loading="i.loading" 
    :total="i.total" 
    :autocomplete-items="i.autocompleteItems" 
    :autocomplete-loading="i.autocompleteLoading"
    :saved-options="i.savedOptions" 
    @update="i.update" 
    @autocomplete="i.autocomplete" />
  </list-provider>
</v-container>
</template>

<script>
import DatasetsTable from '../components/DatasetsTable'
import ListProvider from '../components/ListProvider'

export default {
  name: 'datasets',
  components: {
    DatasetsTable,
    ListProvider
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
