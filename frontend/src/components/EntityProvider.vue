<template>
  <div>
    <slot :loading="loading" :item="item" v-if="id">
    {{ JSON.stringify(item) }}
    </slot>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'EntityProvider',
  components: {
  },
  props: { list: String, id: Number },
  data () {
    return {
    }
  },
  computed: {
    item() {
      return this.$store.getters[`${this.list}/entity`];
    }
  },
  watch: {
    list() {
      this.get();
    },
    id() {
      this.get();
    }
  },
  methods: {
    get() {
      if(!this.id) {
        return;
      }
      this.loading = true;
      this.$store.dispatch(`${this.list}/get`,{ id: this.id }).then(() => {this.loading = false; }, (err) => { this.$store.dispatch('notify', { error: true, text: `Unable to retrieve ${this.list}.`})});
    }
  },
  created () {

  },
  mounted () {
    this.get();
  }
}
</script>
<style scoped>

</style>
