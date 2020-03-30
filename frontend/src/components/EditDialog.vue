<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ condition }}</v-card-subtitle>
    <v-card-text>
      <v-form v-model="fv" ref="form">
      <v-row>
      <v-col :cols="12" :md="4">
      <v-select
          v-model="modifiedProp"
          :items="entityProps"
          label="Modified cell"
          return-object
          class="mr-3"
          :readonly="!isRule"
          prepend-icon="mdi-help"
      ></v-select>
      </v-col>
      <v-col :cols="12" :md="4">
      <v-text-field 
        v-model="modifiedValue"
        label="Cell value"
        clearable
        class="mr-3"
        
        prepend-icon="mdi-text"
        persistent-hint
        :rules="[isValid]" 
      ></v-text-field>
      </v-col>
      <v-col :cols="12" :md="4">
      <autocomplete-provider v-if="modifiedProp && modifiedProp.autocomplete"
        list="editor" 
        :endpoint="modifiedProp.autocomplete.endpoint"
        :entity="modifiedProp.name" 
        :valueField="modifiedProp.autocomplete.valueField" 
        :textField="modifiedProp.autocomplete.textField" 
        :showAll="modifiedProp.autocomplete.showAll" 
        v-slot="i">
      <data-filter
        v-model="foreignMatchValue"  
        :items="i.items" 
        :loading="i.loading"
        label="Allowed values" 
        icon="mdi-format-list-checkbox"
        @autocomplete="i.autocomplete"
        @init="i.init"
        preload>
      </data-filter>
      </autocomplete-provider>
      </v-col> 
      </v-row>
      </v-form>
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
import ActionButton from './ActionButton'
import AutocompleteProvider from './AutocompleteProvider'
import DataFilter from './DataFilter'

export default {
  name: 'EditDialog',
  mixins: [ImportProps],
  components: {
    ActionButton,
    AutocompleteProvider,
    DataFilter
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
      autocompleteInput: null,
      fv: null
    }
  },
  computed: {
    title() {
      switch(this.type) {
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
        case 'column': return `Where the current value is "${this.originalValue != null ? this.originalValue : '[empty]'}"`;
        case 'rule': return this.valueProp ? `Where value of the ${this.valueProp.name} column is "${this.originalValue != null ? this.originalValue : '[empty]'}"` : '...';
      }
    },
    isValid() {
      //return this.isPropInvalid(selection.item, selection.prop)
      return this.modifiedProp ? this.modifiedProp.isValid(this.selection.item, this.editor) : true;
    },
    isRule() {
      return this.type == 'rule';
    }
  },
  watch: {
    selection(val) {
      this.init(val);
    },
    foreignMatchValue(val, oldVal) {
      if(val) {
        //console.log('Value in autocomplete selected');
        //console.dir(val);
        this.modifiedValue = val;
      }
      this.$refs.form.validate();
    }
    /*
    type(val) {

    }
    */
  },
  methods: {
    init(val) {
      if(val) {
        var p = this.propsDict[val.prop];
        this.modifiedProp = this.isRule ? null : p;
        this.valueProp = this.isRule ? p : null;
        this.originalValue = p.displayValue(val.item);
        this.modifiedValue = this.isRule ? null : this.originalValue; //this.getPropValue(val.item, val.prop);
        
        if(this.modifiedProp && this.modifiedProp.autocomplete) {
          //console.log(`Assigning to foreign match: ${this.modifiedProp.name}`);
          this.foreignMatchValue =  p.displayValue(val.item);//p.foreignMatchValue(val.item);
        }
      } else {
        this.modifiedProp = null;
        this.modifiedValue = null;
        this.foreignMatchValue = null;
        this.originalValue = null;
        this.valueProp = null;
      }
      this.$refs.form.validate();
    },
    save() {
      var e = {};
      if(this.type == 'cell') {
        //e[this.modifiedProp] = this.modifiedValue;
        this.modifiedProp.save(e, this.modifiedValue);
      } else {
        e.column = this.modifiedProp.name;
        e.newValue = this.modifiedValue == '' ? null : this.modifiedValue;
        e.oldValue = this.originalValue;
        if(this.valueProp) {
          //console.log('has value prop');
          e.valueColumn = this.valueProp.name;
        }
      }
      this.$emit('save', e);
    }
  },
  created () {

  },
  mounted () {
    this.init(this.selection);
  }
}
</script>
<style scoped>

</style>
