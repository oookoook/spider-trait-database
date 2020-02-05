<template>
  <div>
  <slot :loading="loading" 
  :items="items" 
  :total="total" 
  :update="update" 
  :autocomplete="autocomplete" 
  :autocomplete-items="autocompleteItems" 
  :autocomplete-loading="acloading"
  :search-update="searchUpdate">
    {{ JSON.stringify(items) }}
  </slot>
  </div>
</template>

<script>

//import { debounce } from 'throttle-debounce';

export default {
  name: 'ListProvider',
  components: {
  },
  props: { 'list': String },
  data () {
    return {
      loading: false,
      acloading: false
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
      return this.$store.state[this.list].autocomplete;
    }
  },
  watch: {

  },
  methods: {
    update(params) {
      if(!params) {
        params = {};
        params.count = true;
        params.search = null;
        params.searchField = null;
        params.options = {
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: []
        }
      }
      this.loading = true;
      this.$store.dispatch(`${this.list}/list`,params).then(() => {this.loading = false; }, (err) => { this.$store.dispatch('notify', { error: true, text: `Unable to retrieve ${this.list}.`})});
    },
    autocomplete(p) { // autocomplete: debounce(500, function(p) {

      //console.dir(p);
      if(this.acloading) {
        // we are still waiting for the last data fetch
        return;
      }
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
    },
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
