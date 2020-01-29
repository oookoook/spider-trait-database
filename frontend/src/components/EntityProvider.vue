<template>
  <div>
    <slot :loading="loading" :item="item">
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
  props: { entity: String, id: Number },
  data () {
    return {

    }
  },
  computed: {
    item() {
      return this.$store.getters[this.entity];
    }
  },
  watch: {
    table() {
      this.get();
    },
    id() {
      this.get();
    }
  },
  methods: {
    get() {
      this.$store.dispatch(`${this.entity}Get`,params).then(() => {this.loading = false; }, (err) => { this.$store.dispatch('notify', { error: true, text: `Unable to retrieve ${this.entity}.`})});
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
