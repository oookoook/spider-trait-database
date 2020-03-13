<template>
  <v-hover
        v-slot:default="{ hover }">
  <td :class="{ 'red': invalid, 'blue': selected, 'green': hover, 'lighten-3': selected || hover || invalid }" style="cursor:cell" @click="click" >
    <slot></slot> 
  </td>
  </v-hover>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SelectableCell',
  components: {
  },
  props: {cellId: Number, cellProp: String,  selectedId: Number, selectedProp: String, invalid: Boolean },
  data () {
    return {
      selected: false
    }
  },
  computed: {
  },
  watch: {
    selectedId(val, oldVal) {
      if(val != this.cellId) {
        this.selected = false;
      }
    },
    selectedProp(val, oldVal) {
      if(val != this.cellProp) {
        this.selected = false;
      }
    }
  },
  methods: {
    click() {
      this.selected = true;
      this.$emit('update:selectedId', this.cellId);
      this.$emit('update:selectedProp', this.cellProp);
      this.$emit('select', { id: this.cellId, prop: this.cellProp });
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
