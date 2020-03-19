<template>
  <v-card>
    <v-card-title>Distinct values for {{ prop.name }}</v-card-title>
    <list-provider list="editor" list-action="distinctList" list-state="distinctList" total-state="distinctTotal"
    :filter="filter" v-slot="i">
     <distinct-entity-table v-if="ent" :headers="tableHeaders"
      :editor="editor"
      :items="i.items" 
      :loading="i.loading" 
      :total="i.total" 
      @update="i.update"
      @create="create" />
    <distinct-value-list v-else 
      :prop="this.prop"
      :items="i.items" 
      :loading="i.loading" 
      :total="i.total" 
      @update="i.update"
      @rule="rule"
      @column="replace" />
     />
    </list-provider>
    <v-card-actions>
      <action-button text="Close" @click="$emit('cancel')" icon="mdi-cancel" />
      <action-button v-if="isEntity && showEntities" text="Show entites" @click="showEntities = true" icon="mdi-table-large" />
      <action-button v-if="isEntity && !showEntities" text="Show only selected column" @click="showEntities = false" icon="mdi-table-column" />
    </v-card-actions>
  </v-card>
</template>

<script>

import ImportProps from '../mixins/import-props'
import DistinctEntityTable from './DistinctEntityTable'
import DistinctValueList from './DistinctValueList'

export default {
  name: 'DistinctDialog',
  mixins: [ImportProps],
  components: {
    DistinctEntityTable,
    DistinctValueList
  },
  props: { editor: Boolean, propName: String, dataset: Number },
  data () {
    return {
      showEntities: true
    }
  },
  computed: {
    prop() {
      return this.entityPropsDict[this.propName];
    },
    isEntity() {
      return this.prop.entity != null;
    },
    ent() {
      return this.isEntity && this.showEntities;
    },
    filter() {
      return {
        dataset: this.dataset,
        entity: this.ent,
        column: this.ent ? this.prop.entity : this.prop 
      }
    },
    tableHeaders() {
      return (this.ent ? this.getEntityHeaders(this.prop.entity) : []).concat([{text: 'Actions', value: 'actions'}]);
    },
  },
  watch: {

  },
  methods: {
    rule(evt) {
      this.$emit('rule', evt);
    },
    column(evt) {
      this.$emit('column', evt);
    },
    create(evt) {
      var e = { endpoint: this.prop.createEndpoint };
      if(Array.isArray(evt)) {
        e.entities = evt;
      } else {
        e.entity = evt;
      }
      this.$emit('create', e);
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
