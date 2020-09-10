<template>
  <v-list-item>
    <v-list-item-icon>
      <v-icon>{{icon}}</v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>{{title}}</v-list-item-title>
      <v-list-item-subtitle><span v-if="text != null">{{text}}</span><slot v-else></slot></v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action v-if="link">
      <v-tooltip top>
      <template v-slot:activator="{ on }">
      <v-btn icon v-if="!external" :to="link" v-on="on">
        <v-icon>{{ linkIcon }}</v-icon>
      </v-btn>
      <v-btn icon v-else :href="link" target="_blank" v-on="on">
        <v-icon>{{ linkIcon }}</v-icon>
      </v-btn>
      </template>
      <span>{{linkTooltip}}</span>
      </v-tooltip>
    </v-list-item-action>
  </v-list-item>
</template>

<script>

export default {
  name: "ListItem",
  components: {},
  props: { icon: {type: String, default: 'mdi-information'}, 
  title: String, 
  text: [String, Number], 
  link: String, 
  external: Boolean, 
  linkIcon: {type: String, default: 'mdi-eye-outline'}, 
  linkTooltip: {type: String, default: 'Open detail' }, 
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style scoped>
</style>
