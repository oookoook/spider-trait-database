<template>
<v-container fluid>
  <list-provider list="traits" v-slot="i">
    <traits-table :items="i.items" :loading="i.loading" :total="i.total" @update="i.update"/>
  </list-provider>
</v-container>
</template>

<script>
import TraitsTable from '../components/TraitsTable'
import ListProvider from '../components/ListProvider'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'traits',
  components: {
    TraitsTable,
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
