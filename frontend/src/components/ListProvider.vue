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
  :saved-options="savedOptions">
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
  props: { list: String, entity: String, id: Number, filter: Object, 
    listAction: { type: String, default: 'list' },
    listState: { type: String, default: 'list' },
    totalState: {type: String, default: 'total' },
    autocompleteAction:{ type: String, default: 'autocomplete'},
    autocompleteState:{ type: String, default: 'autocomplete'},
    savedOptionsState:{ type: String, default: 'savedOptions'},
    preload: Boolean,
    limit: Number
  },
  data () {
    return {
      loading: false,
      acloading: false,
      options: this.savedOptions,
      // debounce solves repeated filter updates when processing a new data filter from route in the data explorer
      // the debounced function is defined in the data so each instance of the list provider has its own function definiton
      // (this is needed when multiple list providers are included within the same component)
      update: debounce(500, this.updateDirect),
      autocomplete: debounce(500, this.autocompleteDirect),
    }
  },
  computed: {
    items() {
      return this.$store.state[this.list][this.listState];
    },
    total() {
      return this.$store.state[this.list][this.totalState];
    },
    autocompleteItems() {
      if(this.entity) {
        return this.$store.state[this.list][this.autocompleteState][this.entity];
        //console.dir(ac);
        //return  ac == null ? [] : ac;
      }
      return this.$store.state[this.list][this.autocompleteState];
    },
    savedOptions() {
      return this.$store.state[this.list][this.savedOptionsState];
    }
  },
  watch: {
    filter: {
      handler() {
        console.log('filter changed, updating list provider...');
        this.update();
      },
      deep:true
    },
    id() {
      console.log('id changed, updating list provider...');
      this.update();
    },
    entity() {
      console.log('entity changed, updating list provider...');
      this.update();
    },
    list() {
      console.log('list changed, updating list provider...');
      this.update();
    }
  },
  methods: {
    updateDirect(params) {
      console.log('Update');
      console.dir(params);
      if(!params) {
        console.log('no params provided');
        /*
        if(this.items && this.items.length > 0) {
          console.log('this is not the first load, ignoring the update...');
          return;
        }
        */
        params = {};
        params.count = true;
        params.search = null;
        params.searchField = null;
        console.dir(this.options);
        if(this.options) {
          // reset page if count required (e.i. changing filter)
          this.options.page = 1;
        }
        params.options = this.options ? this.options : {
          page: 1,
          itemsPerPage: this.limit || 10,
          sortBy: [],
          sortDesc: []
        }
        
      } else if(params.options) {
        console.log('assigning options');
        console.dir(this.options);
        if(params.count) {
          console.log('count required - resetting page');
          // reset page if count required (e.i. changing filter)
          params.options.page = 1;
        }
        this.options = params.options;
        console.dir(params.options);
        /*
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
      //console.dir(params);
      this.loading = true;
      
      this.$store.dispatch(`${this.list}/${this.listAction}`,params).then(() => { this.loading = false; });
    },
    autocompleteDirect(p) {

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
      this.$store.dispatch(`${this.list}/${this.autocompleteAction}`, { query }).then(() => {this.acloading = false; });
    },
    searchUpdate(term) {
      this.$store.commit(`${this.list}/search`, { value: term });
    }
  },
  created () {

  },
  mounted () {
    if(this.preload) {
      this.update();
    }
  },
  beforeDestroy() {
    console.log('List provider destroyed');
    //console.dir(this.options);
    this.$store.commit(`${this.list}/${this.savedOptionsState}`, { value: this.options });
  }
}
</script>
<style scoped>

</style>
