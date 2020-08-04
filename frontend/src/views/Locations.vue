<template>
<v-container fluid>
  <list-provider list="locations" v-slot="i">
    <locations-table :items="i.items" 
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
import LocationsTable from '../components/LocationsTable'
import ListProvider from '../components/ListProvider'

export default {
  name: 'locations',
  components: {
    LocationsTable,
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
