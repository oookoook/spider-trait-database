<template>
    <span>
    <v-tooltip top v-if="tooltip" >
      <template v-slot:activator="{ on }">
        <v-btn @click="click" icon v-on="on"><v-icon :color="color">{{ icon }}</v-icon></v-btn>
      </template>
      <span>{{ text }}</span>
    </v-tooltip>
    <v-btn v-else text @click="click" :color="color"><v-icon left>{{ icon }}</v-icon> {{ text }}</v-btn>
    </span>
</template>

<script>

export default {
  name: 'ActionButton',
  components: {
  },
  props: { icon: { type: String, default: 'mdi-plus-circle' }, text: { type: String, default: 'Add new' }, color: String, tooltip: Boolean },
  data () {
    return {

    }
  },
  methods: {
    click(evt) {
      this.$emit('click', evt);
    }
  }
}
</script>
<style scoped>

</style>
