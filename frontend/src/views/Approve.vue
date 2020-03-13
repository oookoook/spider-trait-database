<template>
  <v-container fluid>
  <auth-section editor>
   <imports-manager editor />
   </auth-section>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import AuthSection from '../components/AuthSection'
import ImportsManager from '../components/ImportsManager'

export default {
  name: 'approve',
  components: {
    AuthSection,
    ImportsManager
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
