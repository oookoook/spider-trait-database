<template>
<v-container fluid>
  <list-provider list="methods" v-slot="i">
    <methods-table :items="i.items" 
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
import MethodsTable from '../components/MethodsTable'
import ListProvider from '../components/ListProvider'

export default {
  name: 'methods',
  components: {
    MethodsTable,
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
