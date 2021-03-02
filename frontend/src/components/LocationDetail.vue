<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ item.locality }}</v-card-title>
      <v-card-subtitle><v-breadcrumbs class="px-0" :items="breadcrumbs"/></v-card-subtitle>
        <v-list  v-if="item" three-line>
          <list-item v-if="item.coords" title="Geolocation (WGS84)" :text="`Lat: ${item.coords.lat}, Lon: ${item.coords.lon}`" 
          icon="mdi-crosshairs-gps" link-icon="mdi-map" link-tooltip="View in Google Maps" :link="getGMapsLink(item.coords)" external/>  
        </v-list>
        <v-card-text v-if="item && item.notes">
      {{ item.notes }}
      </v-card-text>
        <v-card-actions  v-if="item">
          <v-btn text :to="`/data/location/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
          <v-btn v-if="showUpdate" text color="warning" @click="$emit('edit')"><v-icon left>mdi-pencil-outline</v-icon>Edit</v-btn>
        </v-card-actions>
      <!--  -->
  </v-card>
</template>

<script>

import ListItem from '../components/ListItem'
import Locations from '../mixins/locations'

export default {
  name: 'LocationDetail',
  mixins: [Locations],
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
  },
  created () {

  },
  mounted () {
  }
}
</script>
<style scoped>

</style>
