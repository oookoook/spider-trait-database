<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ getTaxon(item) }}</v-card-title>
      <v-card-subtitle v-if="item">{{ item.family }}</v-card-subtitle>
      
      <v-card-text v-if="!item.valid">
        <v-alert v-if="confirm.warning" type="warning">
          This is not a valid taxon. Below, you can find a link to the valid taxon.
        </v-alert>
      </v-card-text>
      <v-list  v-if="item" three-line>
          <list-item v-if="!item.valid" title="Invalid taxon" text="Follow the link to the right to visit the valid taxon page." icon="mdi-content-duplicate" link-icon="mdi-arrow-right-outline" link-tooltip="Go to the valid taxon page" :link="`/taxonomy/${item.validId}`" />
          <list-item title="LSID" :text="item.lsid" icon="mdi-identifier" link-icon="mdi-spider" link-tooltip="View in the World Spider Catalog (opens in a new tab)" :link="getWscLink(item)" external/>
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
import ActionButton from '../components/ActionButton'
import Taxons from '../mixins/taxons'

export default {
  name: 'TaxonDetail',
  mixins: [ Taxons ],
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
