<template>
  <v-layout row>
    <v-select
          v-model="searchField"
          :items="searchFields"
          label="Search by..."
          single-line
          hide-details
          return-object
          class="mr-3"
        ></v-select>
      <v-autocomplete
        :loading="autocompleteLoading"
        :items="acitems"
        v-model="search"
        clearable
        append-outer-icon="mdi-magnify"
        label="Search for..."
        single-line
        hide-details
        :search-input.sync="autocompleteInput"
        return-object
        @click:append-outer="filter"
      >
      </v-autocomplete>
  </v-layout>
</template>

<script>
export default {
  name: 'ListFilter',
  components: {
  },
  props: {searchFields: Array, autocompleteLoading: Boolean, autocompleteItems: Array, value: Object},
  data () {
    return {
      search: null,
      searchField: null,
      autocompleteInput: null,
      localAutocompleteItems: null,
    }
  },
  computed: {
    acitems() {
      return this.localAutocompleteItems || this.autocompleteItems; 
    }
  },
  watch: {
    searchField(val) {
      if(val) {
        this.search = null;
        this.localAutocompleteItems = null;
        this.autocomplete();
      }
    },

    search(val, oldVal) {
      if(val && val.free) {
        return;
      }
      this.filter();
    },
    autocompleteInput(val) {
      console.log('acval changed');
      this.localAutocompleteItems = null;
      if(!this.search || val != this.search.text) {
        // search is not available or input is new
        this.autocomplete();
      }

      if(this.search && this.search.text != val) {
        // deletes the saved search when input changes
        this.search = null;
      }
    }
  },
  methods: {
    filter() {
      var search = null;
      var searchField = null;
      var searchLike = true;

      if(this.search && !this.search.free) {
        searchLike = false;
        searchField = this.searchField.valueField;
        search = this.search.value;
      } else if(this.search && this.search.free) {
        // free input cached from previous search
        searchLike = true;
        searchField = this.search.searchField;
        search = this.search.value;
      } else if(this.autocompleteInput) {
        searchLike = true;
        searchField = this.searchField.searchField || this.searchField.textField || this.searchField.valueField;
        search = this.autocompleteInput;
        
        this.search = { 
          text: this.autocompleteInput,
          value: this.autocompleteInput,
          searchField,
          free: true
        }
        this.localAutocompleteItems = [ this.search ];
      }

      var f = {
        search,
        searchField,
        searchLike
      }

      this.$emit('input', f);
    },
    autocomplete() {
      this.$emit('autocomplete', { term: this.autocompleteInput, field: this.searchField })
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
