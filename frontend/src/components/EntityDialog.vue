<template>
  <v-card>
    <v-card-title>Edit entity</v-card-title>
    <v-card-subtitle v-if="breadcrumbs"><v-breadcrumbs class="px-0" :items="breadcrumbs"/></v-card-subtitle>
    <v-card-text>
      <v-form v-model="fv" ref="form">
      <v-row v-if="it">
      <v-col :cols="12" :md="4" v-for="prop in entityProps" :key="prop.name">
      <v-text-field v-if="!prop.autocomplete"
        v-model="it[prop.name]"
        :label="prop.label"
        clearable
        class="mr-3"
        persistent-hint
        :hint="prop.hint"
        :rules="[prop.isValid]" 
      ></v-text-field>
      <autocomplete-provider v-else
        :list="prop.autocomplete.endpoint" 
        :valueField="prop.autocomplete.valueField" 
        :textField="prop.autocomplete.textField" 
        :showAll="prop.autocomplete.showAll" 
        v-slot="i">
      <data-filter
        v-model="it[prop.name][prop.autocomplete.valueField]"  
        :items="i.items" 
        :loading="i.loading"
        :label="prop.label"
        @autocomplete="i.autocomplete"
        @init="i.init"
        preload
        show-details
        :rules="[prop.isValid]">
      </data-filter>
      </autocomplete-provider>
      
      </v-col> 
      </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      
      <action-button text="Cancel" @click="$emit('cancel')" icon="mdi-cancel" />
      <action-button text="Delete" v-if="item && item.id" color="warning" @click="remove" icon="mdi-delete-forever-outline" />
      <action-button text="Save" :loading="loading" color="primary" @click="save" icon="mdi-check" />
      
    </v-card-actions>
  </v-card>
</template>

<script>

import ActionButton from './ActionButton'
import AutocompleteProvider from './AutocompleteProvider'
import DataFilter from './DataFilter'

export default {
  name: 'EntityDialog',
  components: {
    ActionButton,
    AutocompleteProvider,
    DataFilter
  },
  props: { item: Object, create: Boolean, loading: Boolean, entityProps: Array, breadcrumbs: Array },
  data () {
    return {
      it: null,
      fv: null
    }
  },
  computed: {
  },
  watch: {
    item(val) {
      this.fillItem();
    }
  },
  methods: {
    save() {
      this.$emit('save', this.it);
    },
    remove() {
      this.$emit('remove', this.it);
    },
    fillItem() {
      this.it = Object.assign({}, this.item || {});
      this.entityProps.forEach(e => {
      if(this.it[e.name]) {
        return;
      }
      if(e.autocomplete) {
        this.it[e.name] = {};
        this.it[e.name][e.autocomplete.valueField] = null;
      } else if(e.parent) {
        if(!this.it[e.parent]) {
          this.it[e.parent]  = {};
        };
        this.it[e.parent][e.name] = null;
      } else {
        this.it[e.name] = null;
      }
    })
    }
  },
  created () {
    this.fillItem();
  },
  mounted () {
    
  }
}
</script>
<style scoped>

</style>
