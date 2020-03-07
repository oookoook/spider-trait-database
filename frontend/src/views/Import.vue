<template>
 <v-container>
   <!-- <h2>My imported datasets</h2> -->
   <auth-section>
   <v-dialog v-model="showNew">
   <new-dataset @hide="showNewDialog(false)"></new-dataset>
   </v-dialog>
   <list-provider list="imports" v-slot="i">
    <imports-table :items="i.items" 
    :loading="i.loading" 
    :total="i.total" 
    @update="i.update" 
    @showNew="showNewDialog(true)" />
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
    $route(to, from) {
        this.processRoute();
    }
  },
  methods: {
    processRoute() {
      //this.$route.params.id
      if(this.$route.path.indexOf('new') > -1) {
        this.showNew = true;
      } else {
        this.showNew = false;
      }
    },
    showNewDialog(s) {
      if(s) {
        this.$router.push('/import/new');
      } else {
        this.$router.push('/import');
      }
    }
  },
  created () {

  },
  mounted () {
    this.processRoute();
  }
}
</script>
<style scoped>

</style>
