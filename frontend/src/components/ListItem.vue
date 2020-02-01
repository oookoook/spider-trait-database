<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon>{{icon}}</v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-subtitle>{{title}}</v-list-item-subtitle>
      <v-list-item-title>{{text}}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action v-if="link">
      <v-btn icon v-if="routerLink" :to="link">
        <v-icon>{{ linkIcon }}</v-icon>
      </v-btn>
      <v-btn icon v-if="!routerLink" :href="link" target="_blank">
        <v-icon>{{ linkIcon }}</v-icon>
      </v-btn>

    </v-list-item-action>
  </v-list-item>
</template>

<script>

export default {
  name: "ListItem",
  components: {},
  props: { icon: {type: String, default: 'mdi-information'}, title: String, text: String, link: String, 'routerLink': {type: Boolean, default: true }, 'linkIcon': {type: String, default: 'mdi-eye-outline'} },
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
