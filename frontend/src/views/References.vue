<template>
<v-container fluid>
  <list-provider list="references" v-slot="i">
    <references-table :items="i.items" 
    :loading="i.loading" 
    :total="i.total" 
    :autocomplete-items="i.autocompleteItems" 
    :autocomplete-loading="i.autocompleteLoading" 
    @update="i.update" 
    @autocomplete="i.autocomplete" />
  </list-provider>
</v-container>
</template>

<script>
import ReferencesTable from '../components/ReferencesTable'
import ListProvider from '../components/ListProvider'

export default {
  name: 'references',
  components: {
    ReferencesTable,
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
