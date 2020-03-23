<template>
    <span>
    <v-tooltip top v-if="tooltip || toolbar || menu">
      <template v-slot:activator="{ on }">
        <v-btn @click="click" 
        :icon="tooltip" 
        :text="toolbar" 
        :fab="menu" 
        :dark="menu" 
        :small="menu || small" 
        :color="color"
        v-on="on"
        :href="link"
        :target="link ? '_blank' : null"
        ><v-icon>{{ icon }}</v-icon></v-btn>
      </template>
      <span>{{ text }}</span>
    </v-tooltip>
    <v-btn v-else text @click="click" :color="color" :href="link"><v-icon left>{{ icon }}</v-icon> {{ text }}</v-btn>
    </span>
</template>

<script>

export default {
  name: 'ActionButton',
  components: {
  },
  props: { icon: { type: String, default: 'mdi-plus-circle' }, text: { type: String, default: 'Add new' }, 
  color: String, tooltip: Boolean, toolbar: Boolean, menu: Boolean, small: Boolean, download:String },
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
