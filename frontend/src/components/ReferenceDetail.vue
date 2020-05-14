<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ item.abbrev }}</v-card-title>
      <v-card-subtitle><v-breadcrumbs class="px-0" :items="breadcrumbs"/></v-card-subtitle>
      <!-- <v-card-subtitle v-if="item">{{ item.doi }}</v-card-subtitle> -->
      <v-card-text v-if="item">
      {{ item.fullCitation }}
      </v-card-text>
        <v-list  v-if="item" three-line>
          <list-item v-if="item.doi" title="DOI" :text="item.doi" icon="mdi-id" link-tooltip="View the original paper" :link="getDOILink(item.doi)" />  
        </v-list>
        <v-card-actions  v-if="item">
          <v-btn text :to="`/data/reference/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
          <v-btn v-if="showUpdate" text color="warning" @click="$emit('edit')"><v-icon left>mdi-pencil-outline</v-icon>Edit</v-btn>
        </v-card-actions>
      <!--  -->
  </v-card>
</template>

<script>

import ListItem from '../components/ListItem'

export default {
  name: 'ReferenceDetail',
  components: {
    ListItem
  },
  props: { item: Object, loading: Boolean, showUpdate: Boolean, breadcrumbs: Array  },
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    getDOILink(doi) {
      return doi.replace('doi:', 'https://doi.org/');
    }
  },
  created () {

  },
  mounted () {
  }
}
</script>
<style scoped>

</style>
