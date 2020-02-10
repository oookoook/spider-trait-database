<template>
  <v-card>
    <v-card-title>
      Raw data
    </v-card-title>
  <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
    >
    
    <template v-slot:item.eventDate="{item}">
        <span v-if="item.eventDate.start">{{ new Date(item.eventDate.start).toISOString() }}</span>
        <span v-if="item.eventDate.end">;{{ new Date(item.eventDate.end).toISOString() }}</span>
    </template>

    <template v-slot:item.reference="{item}">
        <span v-if="item.reference">{{ reference.abbrev }}</span>
        <span v-if="item.eventDate.end">;{{ new Date(item.eventDate.end).toISOString() }}</span>
    </template>

    </v-data-table>
  </v-card>
</template>

<script>
import ListItem from '../components/ListItem'


export default {
  name: 'DataExportTable',
  components: {
      ListItem
  },
  props: { items: Array, entity: String, id: Number, filter: Object, total: { type: Number, default: 0 }, loading: Boolean },
  data () {
    return {
      needsCount: true,
      options: {},
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'WSC LSID', value: 'wsc.lsid' },
        { text: 'Original name', value: 'originalName' },
        { text: 'Trait ID', value: 'trait.abbrev' },
        { text: 'Trait value', value: 'value' },
        { text: 'Measure', value: 'measure' },
        { text: 'Sex', value: 'sex' },
        { text: 'Life stage', value: 'lifeStage' },
        { text: 'Frequency', value: 'frequency' },
        { text: 'Sample size', value: 'sampleSize' },
        { text: 'Method', value: 'method.abbrev'},
        { text: 'Location', value: 'location.abbrev'},
        { text: 'Event date', value: 'eventDate'},
        { text: 'Dataset', value: 'dataset.name'},
        { text: 'Reference', value: 'reference'},
        { text: 'Related records', value: 'rowLink'}
      ]
    }
  },
  computed: {

  },
  watch: {
    options: {
        handler () {
          this.update();
        },
        deep: true,
    },
    entity() {
        this.update();
    },
    id() {
        this.update();
    },
    filter() {
        this.update();
    }
  },
  methods: {
    update() {
      //console.log('update called')
      //if(!this.entity || !this.id)
      var filter;
      if(this.filter) {
          filter = this.filter;
      } else {
        filter = {};
        filter[this.entity] = this.id;
      }
      this.$emit('update', {options: this.options, filter, count: this.needsCount });
      this.needsCount = false;
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
