<template>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon :color="color" v-on="on">{{ icon }}</v-icon>
      </template>
      <span>{{ text }}</span>
    </v-tooltip>
</template>

<script>

export default {
  name: 'InfoIcon',
  components: {
  },
  props: { icon: { type: String, default: 'mdi-plus-circle' }, text: { type: String, default: 'This should help you' }, color: String},
  data () {
    return {

    }
  },
  methods: {
  }
}
</script>
<style scoped>

</style>
