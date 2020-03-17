<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ condition }}</v-card-subtitle>
    <v-card-text>
      <v-layout row>
      <v-select
          v-model="modifiedProp"
          :items="entityProps"
          label="Modified cell"
          single-line
          hide-details
          return-object
          class="mr-3"
          :read-only="type != 'rule'"
      ></v-select>
      <v-text-field 
        v-model="modifiedValue"
        label="Cell value"
        single-line
        hide-details
        clearable
        class="mr-3"
        :color="isValid !== true ? 'error' : null"
        :hint="isValid === true ? null : isInvalid" 
      ></v-text-field>
      <!--
      <v-autocomplete v-if="!modifiedProp.isFreeForm"
        :loading="loading"
        :items="acitems"
        v-model="foreignKeyValue"
        clearable
        append-outer-icon="mdi-magnify"
        label="Allowed values"
        single-line
        hide-details
        :search-input.sync="autocompleteInput"
        return-object
      >
      </v-autocomplete>
      -->
      <autocomplete-provider v-if="modifiedProp.autocomplete"
        list="editor" 
        :endpoint="modifiedProp.autocomplete.endpoint"
        :entity="modifiedProp.name" 
        :valueField="modifiedProp.autocomplete.valueField" 
        :textField="modifiedProp.autocomplete.textField" 
        :showAll="modifiedProp.autocomplete.showAll" 
        v-slot="i">
      <data-filter
        v-model="foreignKeyValue"  
        :items="i.items" 
        :loading="i.loading"
        label="Allowed values" 
        icon="mdi-format-list-checkbox"
        @autocomplete="i.autocomplete"
        @init="i.init">
      </data-filter>
      </autocomplete-provider> 
  </v-layout>
    </v-card-text>
    <v-card-actions>
      <action-button text="Cancel" @click="$emit('cancel')" icon="mdi-cancel" />
      <action-button text="Apply rule" v-if="isRule" color="warning" @click="save" icon="mdi-check" />
      <action-button text="Save" v-else color="primary" @click="save" icon="mdi-check" />
      
    </v-card-actions>
  </v-card>
</template>

<script>

import ImportProps from '../mixins/import-props'

export default {
  name: 'EditDialog',
  mixnins: [ImportProps],
  components: {
  },
  props: { type: String, selection: Object, val: Object, autocompleteItems: Array },
  data () {
    return {
      loading: false,
      modifiedProp: null,
      modifiedValue: null,
      originalValue: null,
      valueProp: null,
      acitems: null,
      foreignMatchValue: null,
      autocompleteInput: null
    }
  },
  computed: {
    title() {
      switch(type) {
        case 'cell': return 'Edit cell';
        case 'column': return 'Replace value in the column';
        case 'rule': return 'Replace value in a column by a rule';
      }
    },
    condition() {
      if(!this.selection) {
        return 'No cell selected'
      }
      switch(this.type) {
        case 'cell': return `Where record ID is ${this.selection.id}`;
        case 'column': return `Where the current value is ${this.originalValue}`;
        case 'rule': return `Where value of the ${this.getPropName(this.valueProp)} column is ${this.originalValue}`;
      }
    },
    isValid() {
      //return this.isPropInvalid(selection.item, selection.prop)
      return this.modifiedProp.isValid(selection.item, this.editor);
    },
    isRule() {
      return this.type == 'rule'
    }
  },
  watch: {
    selection(val) {
      if(val) {
        var p = this.entityPropsDict[val.prop];
        
        this.modifedProp = this.isRule ? null : p;
        this.valueProp = this.isRule ? p : null;
        this.modifiedValue = p.displayValue(val.item); //this.getPropValue(val.item, val.prop);
        this.originalValue = this.modifiedValue;
        if(this.modifiedProp.autocomplete) {
          this.foreignMatchValue =  p.displayValue(val.item);//p.foreignMatchValue(val.item);
        }
      } else {
        this.modifiedProp = null;
        this.modifiedValue = null;
        this.foreignMatchValue = null;
        this.originalValue = null;
        this.valueProp = null;
      }
    },
    foreignMatchValue(val, oldVal) {
      if(val) {
        this.modifiedValue = val.value;
      }
    }
    /*
    type(val) {

    }
    */
  },
  methods: {
    save() {
      var e = {};
      if(type == 'row') {
        e[this.modifiedProp] = this.modifiedValue;
      } else {
        e.column = this.modifiedProp;
        e.newValue = this.modifiedValue;
        e.oldValue = this.originalValue;
        if(e.valueProp) {
          e.valueColumn = this.valueProp;
        }
      }
      this.$emit('save', e);
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
