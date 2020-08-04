<template>
  <v-container fluid>
  <list-provider list="taxonomy" v-slot="i">
    <taxonomy-table :items="i.items" 
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
import TaxonomyTable from '../components/TaxonomyTable'
import ListProvider from '../components/ListProvider'

export default {
  name: 'taxonomy',
  components: {
    TaxonomyTable,
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
