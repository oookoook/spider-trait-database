<template>
  
    <!--
      <v-card>
    <v-card-title v-if="!hideTitle">
      Data preview
    </v-card-title>
    -->
  <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="opts"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
      show-expand
    >
    <template v-slot:item.taxon="{ item }">
        <entity-link-cell :abbrev="item.originalName" :text="item.taxonomy.wsc.lsId" tooltip="View in the World Spider Catalog (opens in a new tab)" external :link="`https://wsc.nmbe.ch/species/${item.taxonomy.wsc_id}`" />
    </template>

    <template v-slot:item.trait="{item}">
        <entity-link-cell :abbrev="item.trait.abbrev" :text="item.trait.name" tooltip="View the trait detail" :link="`/traits/${item.trait.id}`" />
    </template>

    <template v-slot:item.method="{item}">
        <entity-link-cell :abbrev="item.method.abbrev" :text="item.method.name" tooltip="View the method detail" :link="`/methods/${item.method.id}`" />
    </template>

    <template v-slot:item.location="{item}">
        <entity-link-cell v-if="item.location.abbrev" :text="item.location.abbrev" tooltip="View the location detail" :link="`/locations/${item.location.id}`" />
    </template>

    <template v-slot:item.dataset="{item}">
        <entity-link-cell :text="item.dataset.name" tooltip="View the dataset detail" :link="`/datasets/${item.dataset.id}`" />
    </template>

    <template v-slot:item.reference="{ item }">
      <entity-link-cell v-if="item.reference" :text="item.reference.abbrev" tooltip="View the reference detail" :link="`/references/${item.reference.id}`" />
    </template>

    <template v-slot:item.rowLink="{ item }">
      <entity-link-cell v-if="item.rowLink" icon="mdi-filter" tooltip="Filter related records in the data explorer" :link="`/data/row-link/${item.rowLink}`" />
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <v-container>
        
        <v-list dense two-line subheader>
            <v-subheader>Observation details</v-subheader>
            <list-item title="Measure" :text="item.measure.name" icon="mdi-chart-bell-curve" />
            <list-item title="Sex" :text="item.sex.name" icon="mdi-gender-male-female" />
            <list-item title="Life stage" :text="item.lifeStage.name" icon="mdi-egg" />
            <list-item title="Frequency" :text="item.frequency" icon="mdi-ab-testing" />
            <list-item title="Sample size" :text="item.sampleSize" icon="mdi-numeric" />
            <list-item v-if="item.eventDate && item.eventDate.text" title="Event date" :text="item.eventDate.text" icon="mdi-calendar" />
            <list-item v-if="item.eventDate && item.eventDate.start" title="Event start" :text="new Date(item.eventDate.start).toISOString()" icon="mdi-calendar-arrow-right" />
            <list-item v-if="item.eventDate && item.eventDate.end" title="Event end" :text="new Date(item.eventDate.end).toISOString()" icon="mdi-calendar-arrow-left" />
        </v-list>
     
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
import ListItem from '../components/ListItem'
import DataTable from '../mixins/data-table'

export default {
  name: 'DataPreviewTable',
  components: {
        EntityLinkCell,
        ListItem
  },
  mixins: [DataTable],
  props: {
    hideTitle: Boolean
  },
  data () {
    return {
      headers: [
        { text: 'Taxon', value: 'taxon' },
        { text: 'Trait Name', value: 'trait' },
        { text: 'Trait Value', value: 'value' },
        { text: 'Observation', value: 'data-table-expand' },
        { text: 'Method', value: 'method' },
        { text: 'Location', value: 'location' },
        { text: 'Dataset', value: 'dataset'},
        { text: 'Reference', value: 'reference'},
        { text: 'Related records', value: 'rowLink'}
      ]
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
