<template>
  <span style="white-space:nowrap;">
    <span v-if="!abbrev">{{text}}</span>
    <v-tooltip top v-else>
      <template v-slot:activator="{ on }">
        <span style="text-decoration-line: underline; text-decoration-style: dotted" v-on="on">{{ abbrev }}</span>
      </template>
      <span>{{ text }}</span>
    </v-tooltip><v-tooltip top v-if="!noLink">
      <template v-slot:activator="{ on }">
        <v-btn v-if="!external" :target="newTab? '_blank' : '_self'" :to="link" icon v-on="on"><v-icon :color="color">{{ icon }}</v-icon></v-btn>
        <v-btn v-else :href="link" target="_blank" icon v-on="on"><v-icon :color="color">{{ icon }}</v-icon></v-btn>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </span>
</template>

<script>

export default {
  name: 'EntityLinkCell',
  components: {
  },
  props: { 
    external: Boolean,
    newTab: Boolean, 
    link: String, 
    icon: { type: String, default: 'mdi-eye-outline' }, 
    abbrev: String, text: String, 
    tooltip: { type: String, default: 'View detail' },
    color: String,
    noLink: Boolean 
  },
  data () {
    return {

    }
  }
}
</script>
<style scoped>

</style>
