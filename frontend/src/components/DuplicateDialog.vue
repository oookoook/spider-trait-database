<template>
  <v-card>
    <v-card-title>Duplicate records</v-card-title>
    <v-card-subtitle>Shows the records already commited in the database that are similar to the newly imported data.</v-card-subtitle>
    
    <v-card-text>
      <list-provider v-if="filter" list="data" :filter="filter" v-slot="i">
      <data-preview-table :items="i.items" :loading="i.loading" :total="i.total" :options="i.options" @update="i.update" />
      </list-provider> 
    </v-card-text> 
    <v-card-actions>
      <action-button text="Cancel" @click="$emit('cancel')" icon="mdi-cancel" />
      <action-button text="Delete imported record" :disabled="!getPropValue(item, 'valid.duplicate')" :loading="loading" color="warning" @click="remove" icon="mdi-table-row-remove" />
    </v-card-actions>
    
  </v-card>
</template>

<script>

import ImportProps from '../mixins/import-props'
import ActionButton from './ActionButton'
import ListProvider from './ListProvider'
import DataPreviewTable from './DataPreviewTable'

export default {
  name: 'DuplicateDialog',
  mixins: [ImportProps],
  components: {
    ActionButton,
    DataPreviewTable,
    ListProvider
  },
  props: { item: Object, loading: Boolean },
  data () {
    return {
    }
  },
  computed: {
    filter() {
      if(!this.item) {
        return null;
      }
      var f = {};
      if(this.item.taxonomy.id) {
        f['taxonomy.id'] = this.item.taxonomy.id;
      }
      if(this.item.reference.id) {
        f['reference.id'] = this.item.reference.id;
      }
      if(this.item.trait.id) {
        f['trait.id'] = this.item.trait.id;
      }
      return f;
    }
  },
  watch: {
  },
  methods: {
    remove() {
      this.$emit('remove', this.item);
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
