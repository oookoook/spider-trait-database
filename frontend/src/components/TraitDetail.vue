<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ item.name }}</v-card-title>
      <v-card-subtitle v-if="item">{{ item.abbrev }}</v-card-subtitle>
      <v-card-text v-if="item">
      {{ item.description }}
      </v-card-text>
        <v-list  v-if="item" three-line>
          <list-item title="Life category" :text="item.category.name" icon="mdi-file-tree" />
          <list-item title="Data type" :text="item.dataType.name" icon="mdi-numeric" />
          <list-item title="Standard" :text="item.standard" icon="mdi-file-question-outline" />
          <list-item v-if="item.reference" title="Reference" :text="item.reference.full_citation" icon="mdi-bookmark-multiple-outline" :link="`/references/${item.reference.id}`" />  
        </v-list>
        <v-card-actions  v-if="item">
          <v-btn text :to="`/data/trait/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
        </v-card-actions>
      <!--  -->
  </v-card>
</template>

<script>

import ListItem from '../components/ListItem'

export default {
  name: 'TraitDetail',
  components: {
    ListItem
  },
  props: { item: Object, loading: Boolean },
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
