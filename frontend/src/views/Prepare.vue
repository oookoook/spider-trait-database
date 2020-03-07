<template>
  <v-container fluid>
    <auth-section v-slot="{isEditor}">
      <data-editor :editor="isEditor" :id="id" />
    </auth-section>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import IdFromRoute from '../mixins/id-from-route' 
import DataEditor from '../components/DataEditor'
import AuthSection from '../components/AuthSection'

export default {
  name: 'prepare',
  mixins: [IdFromRoute],
  components: {
    DataEditor,
    AuthSection
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
