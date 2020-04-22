<template>
  <!--
  <v-card>
    <v-card-title>
      Raw data
    </v-card-title>
  -->
  <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="opts"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
    >
  
    <template v-slot:item.location="{item}">
        <span v-if="item.location">{{ item.location.abbrev }}</span>
    </template>

    <template v-slot:item.reference="{item}">
        <span v-if="item.reference">{{ item.reference.abbrev }}</span>
    </template>

    </v-data-table>
  <!-- </v-card> -->
</template>

<script>

import DataTable from '../mixins/data-table'

export default {
  name: 'DataExportTable',
  mixins: [DataTable],
  data () {
    return {
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'WSC LSID', value: 'taxonomy.lsid' },
        { text: 'Family', value: 'taxonomy.family' },
        { text: 'Genus', value: 'taxonomy.genus' },
        { text: 'Species', value: 'taxonomy.species' },
        { text: 'Subspecies', value: 'taxonomy.subspecies' },
        { text: 'Original name', value: 'originalName' },
        { text: 'Trait', value: 'trait.abbrev' },
        { text: 'Trait value', value: 'value' },
        { text: 'Measure', value: 'measure.name' },
        { text: 'Sex', value: 'sex.name' },
        { text: 'Life stage', value: 'lifeStage.name' },
        { text: 'Frequency', value: 'frequency' },
        { text: 'Sample size', value: 'sampleSize' },
        { text: 'Method', value: 'method.abbrev'},
        { text: 'Event date text', value: 'eventDate.text'},
        { text: 'Event date start', value: 'eventDate.start'},
        { text: 'Event date end', value: 'eventDate.end'},
        { text: 'Dataset', value: 'dataset.name'},
        { text: 'Reference (preview)', value: 'reference.abbrev'},
        { text: 'Location (preview)', value: 'location.abbrev'},
        { text: 'Country code', value: 'location.country.code'},
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
