<template>
  <div>
  <slot :loading="loading" 
  :items="items" 
  :total="total" 
  :update="update" 
  :autocomplete="autocomplete" 
  :autocomplete-items="autocompleteItems" 
  :autocomplete-loading="acloading"
  :search-update="searchUpdate"
  :options="options">
    {{ JSON.stringify(items) }}
  </slot>
  </div>
</template>

<script>

import { debounce } from 'throttle-debounce';

export default {
  name: 'ListProvider',
  components: {
  },
  props: { list: String, entity: String, id: Number, filter: Object },
  data () {
    return {
      loading: false,
      acloading: false,
      options: null,
    }
  },
  computed: {
    items() {
      return this.$store.state[this.list].list;
    },
    total() {
      return this.$store.state[this.list].total;
    },
    autocompleteItems() {
      if(this.entity) {
        return this.$store.state[this.list].autocomplete[this.entity];
        //console.dir(ac);
        //return  ac == null ? [] : ac;
      }
      return this.$store.state[this.list].autocomplete;
    }
  },
  watch: {
    filter: {
      handler() {
        console.log('filter changed, updating list provider...');
        this.update();
      },
      deep:true
    }
  },
  methods: {
    // debounce solves repeated filter updates when processing a new data filter from route in the data explorer
    update: debounce(500, function(params) {
      if(!params) {
        params = {};
        params.count = true;
        params.search = null;
        params.searchField = null;
        params.options = this.options? this.options : {
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: []
        }
      } else if(params.options) {
        this.options = params.options;
        /*
        console.dir(params.options);
        if(!this.options) {
          this.options = {};
        }
        Object.assign(this.options, params.options);
        */
      }

      if(this.filter) {
          params.filter = this.filter;
      } else if (this.entity && this.id) {
        params.filter = {};
        params.filter[this.entity] = this.id;
      }

      this.loading = true;
      this.$store.dispatch(`${this.list}/list`,params).then(() => {this.loading = false; }, (err) => { this.$store.dispatch('notify', { error: true, text: `Unable to retrieve ${this.list}.`})});
    }),
    autocomplete: debounce(500, function(p) {

      //console.dir(p);
      /*
      if(this.acloading) {
        // we are still waiting for the last data fetch
        return;
      }
      */
      this.acloading = true;
      var query = {
        valueField: p.field.valueField,
      }
      if(p.term) {
        query.search = p.term;
      }
      if(p.field.textField) {
        query.textField = p.field.textField;
      }
      if(!p.field.showAll) {
        query.count = 10;
      } 
      this.$store.dispatch(`${this.list}/autocomplete`, { query }).then(() => {this.acloading = false; }, (err) => { this.$store.dispatch('notify', { error: true, text: `Unable to retrieve autocomplete.`})});
    }),
    searchUpdate(term) {
      this.$store.commit(`${this.list}/search`, { value: term });
    }
  },
  created () {

  },
  mounted () {
    //this.update();
  }
}
</script>
<style scoped>

</style>
