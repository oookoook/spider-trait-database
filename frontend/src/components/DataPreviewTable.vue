<template>
  
    <!--
      <v-card>
    <v-card-title v-if="!hideTitle">
      Data preview
    </v-card-title>
    -->
  <v-data-table
      :headers="headers"
      :footer-props="footerProps"
      :items="items"
      :options.sync="opts"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
      show-expand
    >
    <template v-slot:item.taxon="{ item }">
        <entity-link-cell :abbrev="getTaxon(item.taxonomy)" :text="item.taxonomy.lsid || 'No LSID assigned'" tooltip="View in the World Spider Catalog (opens in a new tab)" external :link="getWscLink(item.taxonomy)" />
    </template>

    <template v-slot:item.trait="{item}">
        <entity-link-cell :abbrev="item.trait.name" :text="item.trait.abbrev" tooltip="View the trait detail" :link="`/traits/${item.trait.id}`" />
    </template>

    <template v-slot:item.value="{item}">
        <span v-if="item.value">{{item.value}}</span>
        <info-icon v-else text="Restricted access - request the data using the button in top right corner of the page." color="warning" icon="mdi-lock-outline" />
    </template>

    <template v-slot:item.sex="{item}">
        <span v-if="item.sex">{{item.sex.name}}</span>
    </template>

    <template v-slot:item.lifeStage="{item}">
        <span v-if="item.lifeStage">{{item.lifeStage.name}}</span>
    </template>
    <!--
    <template v-slot:item.method="{item}">
        <entity-link-cell v-if="item.method.abbrev" :abbrev="item.method.abbrev" :text="item.method.name" tooltip="View the method detail" :link="`/methods/${item.method.id}`" />
    </template>

    <template v-slot:item.location="{item}">
        <entity-link-cell v-if="item.location.abbrev" :text="item.location.abbrev" tooltip="View the location detail" :link="`/locations/${item.location.id}`" />
    </template>
    -->

    <template v-slot:item.country="{item}">
        <entity-link-cell v-if="item.country.id" :abbrev="item.country.code" :text="item.country.name" no-link />
    </template>

    
    
    <template v-slot:item.dataset="{item}">
        <entity-link-cell :text="item.dataset.name" tooltip="View the dataset detail" :link="`/datasets/${item.dataset.id}`" />
    </template>

    <template v-slot:item.restricted="{item}">
        <info-icon v-if="item.dataset.restricted" color="warning" text="Restricted access" icon="mdi-lock-outline" />
        <info-icon v-else color="success" text="Free access" icon="mdi-lock-open-outline" />
    </template>

    <template v-slot:item.reference="{ item }">
      <entity-link-cell v-if="item.reference" :abbrev="item.reference.abbrev.substr(0,20)" :text="item.reference.abbrev" tooltip="View the reference detail" :link="`/references/${item.reference.id}`" />
    </template>

    <template v-slot:item.rowLink="{ item }">
      <entity-link-cell v-if="item.rowLink" icon="mdi-filter" tooltip="Filter related records in the data explorer" :link="`/data/row-link/${item.rowLink}`" />
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <v-container>
        <v-row no-gutters justify="start">
        <v-list dense two-line subheader>
            <v-subheader>Observation details</v-subheader>
            <list-item title="Measure" :text="item.measure.name" icon="mdi-chart-bell-curve" />
            <list-item title="Sex" :text="item.sex.name" icon="mdi-gender-male-female" />
            <list-item title="Life stage" :text="item.lifeStage.name" icon="mdi-egg" />
            <list-item title="Frequency" :text="item.frequency" icon="mdi-ab-testing" />
            <list-item title="Sample size" :text="item.sampleSize" icon="mdi-numeric" />
            <list-item title="Treatment" :text="item.treatment" icon="mdi-hand-right" />
            <list-item title="Event date" :text="item.eventDate && item.eventDate.text ? item.eventDate.text : null" icon="mdi-calendar" />
            <list-item v-if="item.eventDate && item.eventDate.start" title="Event start" :text="new Date(item.eventDate.start).toISOString()" icon="mdi-calendar-arrow-right" />
            <list-item v-if="item.eventDate && item.eventDate.end" title="Event end" :text="new Date(item.eventDate.end).toISOString()" icon="mdi-calendar-arrow-left" />
        </v-list>
        <v-list dense two-line subheader>
        <v-subheader>Location details</v-subheader>
            <list-item title="Country" :text="item.country.id ? `${item.country.name} (${item.country.code})` : null" icon="mdi-flag-outline" />
            <list-item title="Altitude" :text="item.altitude" icon="mdi-image-filter-hdr" />
            <list-item title="Locality" :text="item.locality" icon="mdi-map-marker" />
            <list-item title="Habitat" :text="item.habitat" icon="mdi-pine-tree" />
            <list-item title="Microhabitat" :text="item.microhabitat" icon="mdi-magnify" />
            <list-item v-if="item.location.id" title="Geolocation (WGS84)" :text="item.location.abbrev" 
          icon="mdi-crosshairs-gps" link-tooltip="View the location detail" :link="`/locations/${item.location.id}`"/>
          </v-list>
        </v-row>
        </v-container>
      </td>
    </template>

    </v-data-table>
    <!--
  </v-card>
  -->
</template>

<script>

import EntityLinkCell from '../components/EntityLinkCell'
import InfoIcon from '../components/InfoIcon'
import ListItem from '../components/ListItem'
import DataTable from '../mixins/data-table'
import Taxons from '../mixins/taxons'


export default {
  name: 'DataPreviewTable',
  components: {
        EntityLinkCell,
        ListItem,
        InfoIcon
  },
  mixins: [DataTable, Taxons],
  props: {
  },
  data () {
    return {
      headers: [
        { text: 'Taxon', value: 'taxon' },
        { text: 'Original name', value: 'originalName' },
        { text: 'Trait Name', value: 'trait' },
        { text: 'Trait Value', value: 'value' },
        { text: 'Sex', value: 'sex' },
        {text: 'Life stage', value: 'lifeStage'},
        { text: 'Observation', value: 'data-table-expand' },
        //{ text: 'Method', value: 'method' },
        //{ text: 'Geo coordinates', value: 'location' },
        { text: 'Country', value: 'country' },
        { text: 'Dataset', value: 'dataset'},
        { text: 'Access', value: 'restricted'},
        { text: 'Reference', value: 'reference'},
        //{ text: 'Related records', value: 'rowLink'}
      ]
    }
  },
  computed: {

  },
  watch: {
  },
  methods: {
    hasLocDetails(item) {
      return item.country.id || item.locality || item.habitat || item.microhabitat || item.altitude || item.location.id;
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
