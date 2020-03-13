<template>
 <v-container fluid>
   <!-- <h2>My imported datasets</h2> -->
   <auth-section v-slot="{user}">
   <imports-manager :user="user" />
   </auth-section>
</v-container>
</template>

<script>

import AuthSection from '../components/AuthSection'
import ImportsManager from '../components/ImportsManager'


export default {
  name: 'import',
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
