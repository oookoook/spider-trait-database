<template>
  <div>
    <slot :loading="loading" :item="item" :entityProps="entityProps" :save="save" :remove="remove" v-if="id || create">
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
        } else if(!this.id) {
          return null;
        } else {
          return this.$store.state[this.list].entity;
        }
      },
      set(val) {
        console.log('Item setter called');
        save(val);
      }
    },
    entityProps() {
      return this.$store.state[this.list].props;
    }
  },
  watch: {
    list() {
      this.get();
    },
    id() {
      this.get();
    },
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
      var action = this.create ? 'create' : 'update';
      this.loading = true;
        this.$store.dispatch(`${this.list}/${action}`, val)
        .then((data) => {
          // data && data.id ? data.id : this.id
          if(this.create && data && data.id) {
            return Promise.resolve({ id: data.id });
          } else {
            // if doing update, refresh the record
            return this.$store.dispatch(`${this.list}/get`,{ id: this.id })
          }
        })
        .then((data) => { 
          //console.log(data);
          this.loading= false; 
          this.$emit(action, data.id); 
        });
    },
    remove(val) {
      this.loading = true;
        this.$store.dispatch(`${this.list}/delete`, val)
        .then((data) => { 
          //console.log(data);
          this.loading= false; 
          this.$emit('remove', data.id); 
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
