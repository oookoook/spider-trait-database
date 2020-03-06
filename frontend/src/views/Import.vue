<template>
 <v-container>
   <!-- <h2>My imported datasets</h2> -->
   <auth-section>
   <v-dialog v-model="showNew">
   <new-dataset @hide="showNew=false"></new-dataset>
   </v-dialog>
   <list-provider list="imports" v-slot="i">
    <imports-table :items="i.items" 
    :loading="i.loading" 
    :total="i.total" 
    :autocomplete-items="i.autocompleteItems" 
    :autocomplete-loading="i.autocompleteLoading" 
    @update="i.update" 
    @autocomplete="i.autocomplete" 
    @showNew="showNew = true" />
  </list-provider>
   </auth-section>
</v-container>
</template>

<script>

import AuthSection from '../components/AuthSection'
import NewDataset from '../components/NewDataset'
import ImportsTable from '../components/ImportsTable'
import ListProvider from '../components/ListProvider'

export default {
  name: 'import',
  components: {
    AuthSection,
    NewDataset,
    ImportsTable,
    ListProvider
  },
  props: [],
  data () {
    return {
      showNew: false
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
