<template>
  <div>
    <slot :loading="loading" :item="item" v-if="id || create">
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
  props: { list: String, id: Number, create: Boolean, template: Object },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    item: {
      get() {
        if(this.create && !this.id && this.template) {
          return this.template;
        }
        return this.$store.state[this.list].entity;
      },
      set(val) {
        console.log('Item setter called');
        save(val);
      }
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
      this.$store.dispatch(`${this.list}/get`,{ id: this.id }).then(() => {this.loading = false; });
    },
    save(val) {
      var action = create ? 'create' : 'update';
      this.loading = true;
        this.$store.dispatch(`${list}/${action}`, val)
        .then((id) => { 
          this.loading= false; 
          this.$emit(action, id ? id : this.id); 
        });
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
