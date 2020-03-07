<template>
  <v-container fluid>
<auth-section editor>
   <list-provider list="imports" v-slot="i">
    <imports-table editor
    :items="i.items" 
    :loading="i.loading" 
    :total="i.total"  
    @update="i.update"  
    @showNew="newDataset()" />
  </list-provider>
   </auth-section>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import AuthSection from '../components/AuthSection'
import ImportsTable from '../components/ImportsTable'
import ListProvider from '../components/ListProvider'

export default {
  name: 'approve',
  components: {
    AuthSection,
    ImportsTable,
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
    newDataset() {
      this.$router.push('/import/new');
    }
  },
  created () {

  },
  mounted () {
  }
}
</script>
<style scoped>

</style>
