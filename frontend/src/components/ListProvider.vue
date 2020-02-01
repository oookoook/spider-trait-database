<template>
  <div>
  <slot :loading="loading" :items="items" :total="total" :update="update">
    {{ JSON.stringify(items) }}
  </slot>
  </div>
</template>

<script>

export default {
  name: 'ListProvider',
  components: {
  },
  props: { 'list': String },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    items() {
      return this.$store.getters[`${this.list}/list`];
    },
    total() {
      return this.$store.getters[`${this.list}/total`];
    },
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
