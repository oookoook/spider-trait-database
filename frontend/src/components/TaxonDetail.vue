<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ getTaxon(item) }}</v-card-title>
      <v-card-subtitle v-if="item">{{ item.family }}</v-card-subtitle>
      <!--
      <v-card-text v-if="item">
      {{ item.description }}
      </v-card-text>
      -->
        <v-list  v-if="item" three-line>
          <list-item title="LSID" :text="item.wsc.lsid" icon="mdi-identifier" link-icon="mdi-spider" link-tooltip="View in the World Spider Catalog (opens in a new tab)" :link="`https://wsc.nmbe.ch/species/${item.wsc.id}`" external/>
          <!--
          <list-item title="Family" :text="item.family" icon="mdi-spider-web" />
          <list-item title="Genus" :text="item.genus" icon="mdi-spider-thread" />
          <list-item title="Species" :text="item.species" icon="mdi-spider" />
          <list-item v-if="item.subspecies" title="Subspecies" :text="item.subspecies" icon="mdi-file-tree" />
          -->
          <list-item title="Author" :text="item.author" icon="mdi-account" />
          <list-item title="Year" :text="item.year ? item.year.toString() : `?`" icon="mdi-calendar" />  
        </v-list>
        <v-card-actions  v-if="item">
          <v-btn text :to="`/data/taxon/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
        </v-card-actions>
      <!--  -->
  </v-card>
</template>

<script>

import ListItem from '../components/ListItem'

export default {
  name: 'TaxonDetail',
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
    getTaxon(item) {
      var t = [ item.genus, item.species];
      if(item.subspecies) {
        t.push(item.subspecies);
      }
      //console.dir(t);
      return t.join(' ');
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
