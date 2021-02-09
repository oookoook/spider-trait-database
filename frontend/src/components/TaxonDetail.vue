<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ getTaxon(item) }}</v-card-title>
      <v-card-subtitle v-if="item">
        <v-breadcrumbs class="px-0" :items="[{ text: 'Taxa', to: `/taxonomy`, exact: true }, { text: getTaxon(item), to: currentPath }]"/>
      </v-card-subtitle>
      
      <v-card-text v-if="item">
        <v-alert v-if="!item.valid" type="warning">
          This is not a valid taxon. Below, you can find a link to the valid taxon.
        </v-alert>
        <v-alert v-else-if="getCategory(item) == 'family'" type="info">
          This is a taxon record that matches only records that has no specific genus or species attached. 
          To filter all the taxons that belong to this family, use the filter action on the Family row in the list below. 
        </v-alert>
        <v-alert v-else-if="getCategory(item) == 'genus'" type="info">
          This is a taxon record that matches only records that has no specific species attached. 
          To filter all the taxons that belong to this genus, use the filter action on the Genus row in the list below. 
        </v-alert>
        <span v-else>This is a valid taxon.</span>
        <v-alert v-if="item.lsid" type="info">
          This taxon is synchronized with the WSC. Editing is disabled.
        </v-alert>

      </v-card-text>
      <v-list  v-if="item" three-line>
          <list-item v-if="!item.valid" title="Invalid taxon" text="Follow the link to the right to visit the valid taxon page." icon="mdi-content-duplicate" link-icon="mdi-arrow-right-bold-outline" link-tooltip="Go to the valid taxon page" :link="`/taxonomy/${item.validTaxon.id}`" />
          <list-item v-if="item.lsid" title="LSID" :text="item.lsid" icon="mdi-identifier" link-icon="mdi-spider" link-tooltip="View in the World Spider Catalog (opens in a new tab)" :link="getWscLink(item)" external />
          
          <!-- <list-item title="Order" :text="item.order" icon="mdi-bug" link-icon="mdi-filter" link-tooltip="Set as filter in the data explorer" :link="`/data/order/${item.order}`"/> -->
          <list-item title="Family" :text="item.family" icon="mdi-spider-web" link-icon="mdi-filter" link-tooltip="Set as filter in the data explorer" :link="`/data/family/${item.family}`"/>
          <list-item title="Genus" v-if="item.genus" :text="item.genus" icon="mdi-spider-thread" link-icon="mdi-filter" link-tooltip="Set as filter in the data explorer" :link="`/data/genus/${item.genus}`"/>
          <list-item title="Species" v-if="item.species" :text="item.species" icon="mdi-spider" />
          <list-item v-if="item.subspecies" title="Subspecies" :text="item.subspecies" icon="mdi-file-tree" />
          
          <list-item title="Author" :text="item.author" icon="mdi-account" />
          <list-item title="Year" :text="item.year ? item.year.toString() : `?`" icon="mdi-calendar" />  
        </v-list>
        <v-card-actions  v-if="item">
          <v-btn text :to="`/data/taxon/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
          <v-btn v-if="showUpdate" :disabled="!!item.lsid" text color="warning" @click="$emit('edit')"><v-icon left>mdi-pencil-outline</v-icon>Edit</v-btn>
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
  props: { item: Object, loading: Boolean,  showUpdate: Boolean },
  data () {
    return {

    }
  },
  computed: {
    currentPath() {
      return this.$route.path;
    }
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
