<template>
  <v-card :loading="loading">
      <v-card-title>
        {{ item.name }}
      </v-card-title>
      <v-card-subtitle><v-breadcrumbs class="px-0" :items="breadcrumbs"/></v-card-subtitle>
      <v-card-text>
      {{ item.description }}
      </v-card-text>
        <v-list three-line>
          <list-item title="Category" :text="item.category.name" icon="mdi-file-tree" />
          <list-item title="Data type" :text="item.dataType.name" icon="mdi-numeric" />
          <list-item title="Unit" :text="item.standard" icon="mdi-file-question-outline" />
          <list-item v-if="item.reference" title="Reference" :text="item.reference.fullCitation" icon="mdi-bookmark-multiple-outline" :link="`/references/${item.reference.id}`" />  
        </v-list>
        <v-card-actions>
          <v-btn text :to="`/data/trait/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
          <v-btn v-if="showUpdate" text color="warning" @click="$emit('edit')"><v-icon left>mdi-pencil-outline</v-icon>Edit</v-btn>
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
  props: { item: Object, loading: Boolean, showUpdate: Boolean, breadcrumbs: Array },
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
