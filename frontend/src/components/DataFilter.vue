<template>
      <v-autocomplete
        :loading="loading"
        :items="items"
        v-model="search"
        :menu-props="menuProps"
        clearable
        :label="label"
        :single-line="!showDetails"
        :hide-details="!showDetails"
        :search-input.sync="autocompleteInput"
        :rules="rules"
        return-object
        
        @click:clear="autocomplete"
      >
      <!-- @focus="autocomplete" -->
      <template v-slot:prepend>
        <v-icon :color="iconColor">{{icon}}</v-icon>
      </template>
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            Enter first letters
          </v-list-item-title>
        </v-list-item>
      </template>
      </v-autocomplete>
</template>

<script>
export default {
  name: 'DataFilter',
  components: {
  },
  props: { loading: Boolean, items: Array, icon: String, label: String, value: [String, Number], 
  preload: Boolean, menuProps: [String, Array, Object], showDetails: Boolean, rules: Array  },
  data () {
    return {
      search: null,
      autocompleteInput: null,
      waitingForFill: false,
      internalChange: false
      //localAutocompleteItems: null,
    }
  },
  computed: {
    /*
    acitems() {
      return this.localAutocompleteItems || this.items; 
    }
    */
    iconColor() {
      return this.value ? 'primary' : null;
    }
  },
  watch: {
    search(val, oldVal) {
      if(this.waitingForFill) {
        this.waitingForFill = false;
        return;
      }

      // this is an internal change from the autocomplete
      //this.localAutocompleteItems = [ val ];
      //console.log(`Setting internal change to true ${val}`);
      this.internalChange = true;
      this.$emit('input', val ? val.value : null);
    },
    value(val, oldVal) {
      //console.log('Data Filter registered value change');
      if(!val && !this.preload) {
        //console.log('Doing nothing');
        this.search = null;
        return;
      }
      if(this.internalChange) {
        //console.log('This was an internal change');
        this.internalChange = false;
        return;
      } 
      this.changeSearch(val || '');
    },
    items() {
      console.log('items changed');
      if(this.items && this.items.length && this.waitingForFill) {
        // we have items, value is set, but search is empty - we have to set it
        this.search = this.items.find(i => i.value == this.value);
        // this will trigger the search watcher
      } else if((!this.items || this.items.length == 0) && this.waitingForFill) {
        // value was passed to the filter, but the value does not exist in the data (invalid column value during import)
        this.waitingForFill = false;
        // do preload
        if(this.preload) {
          this.$emit('autocomplete', { term: '' });
        }
      }
    },
    autocompleteInput(val) {
      //console.log(`${this.label}: acval changed`);
      this.localAutocompleteItems = null;
      if(!this.search || val != this.search.text) {
        // search is not available or input is new
        this.autocomplete();
      }

      /*
      if(this.search && this.search.text != val) {
        // deletes the saved search when input changes
        this.search = null;
      }
      */
    }
  },
  methods: {
    autocomplete() {
      this.$emit('autocomplete', { term: this.autocompleteInput });
    },
    changeSearch(val) {
      // this is an external change from the parent 
      //console.log(`${this.label}: External change of the search value`);
      // send an event to the autocomplete provider to load the items
      this.waitingForFill = true;
      this.$emit('init', val);
      // when the items are loaded, the items watcher will do the work
    }
    
  },
  created () {

  },
  mounted () {
    console.log(`${this.label}: DataFilter mounted...`)
    if(this.value) {
      this.changeSearch(this.value);
      return;
    }
    console.log(`${this.label}: DataFilter pre preload...`)
    if(this.preload && (!this.items || this.items.length == 0)){
      console.log(`${this.label}: DataFilter preload...`)
      this.$emit('autocomplete', { term: '' });
    }
  }
}
</script>
<style scoped>

</style>
