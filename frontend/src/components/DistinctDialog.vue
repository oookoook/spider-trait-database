<template>
  <v-card>
    <v-card-title>Distinct values for {{ prop.text }}</v-card-title>
    <v-card-text style="height: 400px">
    <list-provider list="editor" list-action="distinctList" list-state="distinctList" total-state="distinctTotal"
    :filter="filter" v-slot="i">
     <distinct-entity-table v-if="ent"
      :editor="editor"
      :entity="prop.entity"
      :items="i.items" 
      :loading="i.loading" 
      :total="i.total" 
      @update="i.update"
      @create="create" />
    <distinct-value-list v-else 
      :prop="prop"
      :items="i.items" 
      :loading="i.loading" 
      :total="i.total" 
      @update="i.update"
      @rule="rule"
      @column="column" />
    </list-provider>
    </v-card-text>
    <v-card-actions>
      <action-button text="Close" @click="$emit('cancel')" icon="mdi-close" />
      <action-button v-if="isEntity && !showEntities" text="Show entites" @click="showEntities = true" icon="mdi-table-large" />
      <action-button v-if="isEntity && showEntities" text="Show only selected column" @click="showEntities = false" icon="mdi-table-column" />
    </v-card-actions>
  </v-card>
</template>

<script>

import ImportProps from '../mixins/import-props'
import DistinctEntityTable from './DistinctEntityTable'
import DistinctValueList from './DistinctValueList'
import ActionButton from './ActionButton'
import ListProvider from './ListProvider'

export default {
  name: 'DistinctDialog',
  mixins: [ImportProps],
  components: {
    DistinctEntityTable,
    DistinctValueList,
    ActionButton,
    ListProvider
  },
  props: { propName: String, dataset: Number },
  data () {
    return {
      showEntities: false
    }
  },
  computed: {
    prop() {
      return this.propsDict[this.propName];
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
        column: this.ent ? this.prop.entity : this.prop.name,
        editor: this.editor
      }
    },
  },
  watch: {

  },
  methods: {
    rule(evt) {
      this.edit('rule', evt);
    },
    column(evt) {
      this.edit('column', evt);
    },
    edit(mode, evt) {
      evt.item = {};
      this.propsDict[evt.prop].save(evt.item, evt.value);
      delete(evt.value);
      this.$emit(mode, evt);
    },
    create(evt) {
      //console.dir(evt);
      //console.dir(this.prop);
      
      /*

          e.column = this.modifiedProp.name;
          e.newValue = this.modifiedValue;
          e.oldValue = this.originalValue;
          if(this.valueProp) {
          //console.log('has value prop');
          e.valueColumn = this.valueProp.name;
        }
        */
      
      
      var e = { 
        endpoint: this.getEntityEndpoint(this.prop.entity), 
        entity: {
          name: this.prop.entity, 
          match: this.getEntityMatch(this.prop.entity), 
          props: this.getDistinctEntityProps(this.prop.entity) 
        },
        columns: {
          column: this.getEntityMatch(this.prop.entity).name,
          newValue: null, // to be filled in after the entity is created
          multipleColumns: true,
          valueColumns: this.getDistinctEntityProps(this.prop.entity),
          oldValues: null
        }
      };
      if(Array.isArray(evt)) {
        e.entity.values = evt.map(i => i[this.prop.entity]);
        e.entity.oldValues = [];
        // array of array with the old values
        evt.forEach(i => { e.entity.oldValues.push(this.getDistinctEntityProps(this.prop.entity).map(p=> this.getPropValue(i, p)));});
        e.columns.validation = false;
      } else {
        e.entity.value = evt[this.prop.entity];
        console.dir(this.getDistinctEntityProps(this.prop.entity));

        e.columns.oldValues = this.getDistinctEntityProps(this.prop.entity).map(p=> this.getPropValue(evt, p));
      }
      console.dir(e);
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
