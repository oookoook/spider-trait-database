<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ item.locality }}</v-card-title>
      <v-card-subtitle v-if="item">{{ item.country ? `${item.country.name} (${item.country.code})` : 'Unknown country' }}</v-card-subtitle>
        <v-list  v-if="item" three-line>
          <list-item v-if="item.habitatGlobal" title="Global habitat (IUCN)" :text="`${item.habitatGlobal.category}: ${item.habitatGlobal.name}`" icon="mdi-map" external link-icon="book-open-page-variant" link-tooltip="View the IUCN clasification scheme" link="https://www.iucnredlist.org/resources/habitat-classification-scheme"/>
          <list-item title="Habitat" :text="item.habitat" icon="mdi-pine-tree" />
          <list-item title="Microhabitat" :text="item.microhabitat" icon="mdi-magnify" />
          <list-item title="Stratum" :text="item.stratum" icon="mdi-layers-outline" />
          <list-item title="Altitude" :text="item.altitude" icon="mdi-image-filter-hdr" />
          <list-item v-if="item.coords" title="Geolocation (WGS84)" :text="`Lat: ${item.coords.lat}, Lon: ${item.coords.lon}, Precision: ${item.coords.precision}`" 
          icon="mdi-crosshairs-gps" link-icon="mdi-google-maps" link-tooltip="View in Google Maps" :link="getGMapsLink(item.coords)" external/>  
        </v-list>
        <v-card-text v-if="item">
      {{ item.notes }}
      </v-card-text>
        <v-card-actions  v-if="item">
          <v-btn text :to="`/data/location/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
        </v-card-actions>
      <!--  -->
  </v-card>
</template>

<script>

import ListItem from '../components/ListItem'

export default {
  name: 'LocationDetail',
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
    getGMapsLink(coords) {
      return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lon}`
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
