<template>
  <v-card>
    <v-card-title>
      Traits
      <v-spacer></v-spacer>
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
        @click:append-outer="needsCount = true; update()"
      >

      </v-autocomplete>
      <!--
      <v-text-field
        v-model="search"
        clearable
        append-outer-icon="mdi-magnify"
        label="Search by trait name"
        single-line
        hide-details
        @click:append-outer="needsCount = true; update()"
      ></v-text-field>
      -->
    </v-card-title>
  <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
    >
    
    <template v-slot:item.abbrev="{ item }">
      <entity-link-cell :text="item.abbrev" tooltip="View the trait detail" :link="`/traits/${item.id}`" />
    </template>
    
    <template v-slot:item.reference="{ item }">
      <entity-link-cell v-if="item.reference" :text="item.reference.abbrev" tooltip="View the reference detail" :link="`/references/${item.reference.id}`" />
    </template>

    <template v-slot:item.actions="{ item }">
    <entity-link-cell tooltip="Set as filter in the data explorer" :link="`/traits/${item.id}`" icon="mdi-filter" />
    </template>
    <!--
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">{{item.description}}</td>
    </template>
    -->
    </v-data-table>
  </v-card>
</template>

<script>

import EntityLinkCell from '../components/EntityLinkCell'

export default {
  name: 'TraitsTable',
  components: {
    EntityLinkCell
  },
  props: { items: Array, total: { type: Number, default: 0 }, loading: Boolean, 'autocomplete-loading': Boolean, 'autocomplete-items': Array },
  data () {
    return {
      search: null,
      searchFields: [{ text: 'Life category', valueField: 'category.id', textField: 'category.name', showAll: true }, 
      { text: 'Trait name', valueField: 'id', textField: ['abbrev','name'], searchField: ['name'] }],
      searchField: null,
      autocompleteInput: null,
      localAutocompleteItems: null,
      needsCount: true,
      options: {},
      headers: [
        { text: 'Trait ID', value: 'abbrev' },
        { text: 'Life Category', value: 'category.name' },
        { text: 'Trait Name', value: 'name' },
        { text: 'Reference', value: 'reference'},
        { text: 'Actions', value: 'actions'}
      ]
    }
  },
  computed: {
    acitems() {
      return this.localAutocompleteItems || this.autocompleteItems; 
    }
  },
  watch: {
    options: {
        handler () {
          this.update();
        },
        deep: true,
    },
    search(val, oldVal) {
      if(val && val.free) {
        return;
      }
      
      // resetting the itemsPerPage so not all the results are loaded
      this.options.itemsPerPage = 10;
      
      this.needsCount = true;
      this.update();

      /*
      // field was cleared
      if(val == null && oldVal != null) {
        console.log('Search cleared');
        
      }
      // a new value for search
      if(val && !oldVal && !val.free) {
        console.log('New search');
        this.needsCount = true;
        this.update();
      }
      */
    },
    searchField(val) {
      if(val) {
        this.autocomplete();
      }
    },
    autocompleteInput(val) {
      console.log('acval changed');
      this.localAutocompleteItems = null;
      if(!this.search || val != this.search.text) {
        // search is not available or input is new
        this.autocomplete();
      }

      if(this.search && !this.search.free && this.search.text != val) {
        // deletes the saved search when input changes
        this.search = null;
      }
    }

  },
  methods: {
    update() {
      //console.log('update called')
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

      this.$emit('update', {options: this.options, count: this.needsCount, search, searchField, searchLike });
      this.needsCount = false;
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
