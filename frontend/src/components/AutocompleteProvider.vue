<template>
  <div>
  <slot :loading="loading" 
  :autocomplete="autocomplete"
  :init="init" 
  :items="items">
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
  props: { list: String, entity: String, textField: [String,Array], valueField: String, showAll: Boolean, endpoint: String, searchFromStart: Boolean },
  data () {
    return {
      loading: false,
      items: []
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getData(p) {
      var query = {
        valueField: this.valueField,
      }
      if(p.term) {
        query.search = p.term;
      }
      if(p.searchByValue) {
        query.searchByValue = true;
      }
      if(this.textField) {
        query.textField = this.textField;
      }
      if(!this.showAll) {
        query.count = 10;
      }
      if(this.searchFromStart) {
        query.searchFromStart = true;
      } 
      this.loading = true;
      if(this.entity) {
        this.$store.dispatch(`${this.list}/autocomplete`, { query, entity: this.entity, endpoint: this.endpoint }).then(() => {this.loading = false; this.items=this.$store.getters[`${this.list}/autocomplete`](this.entity)}, (err) => { this.$store.dispatch('notify', { error: true, text: `Unable to retrieve autocomplete.`})});
      } else {
        this.$store.dispatch(`${this.list}/autocomplete`, { query }).then(() => {this.loading = false; this.items=this.$store.state[this.list].autocomplete}, (err) => { this.$store.dispatch('notify', { error: true, text: `Unable to retrieve autocomplete.`})});
      }
    },
    autocomplete: debounce(500, function(p) {

      //console.dir(p);
      /*
      if(this.acloading) {
        // we are still waiting for the last data fetch
        return;
      }
      */
      //console.log(`${this.entity} autocomplete called`)
        this.getData(p);
      }),
    init(val) {
      //console.log(`${this.entity} init called`)
      // can't call the autocomplete because of the debounce 
      //this.autocomplete({ term: val, searchByValue: true })
      this.getData({ term: val, searchByValue: true });

    }
  },
  mounted() { 
  }
}
</script>
<style scoped>

</style>
