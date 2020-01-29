<template>
  <v-card>
      <v-card-title>{{ item.name }}</v-card-title>
      <v-card-subtitle>{{ item.abbrev }}</v-card-subtitle>
  </v-card>
</template>

<script>

export default {
  name: 'TraitDetail',
  components: {
  },
  props: { item: Object },
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
