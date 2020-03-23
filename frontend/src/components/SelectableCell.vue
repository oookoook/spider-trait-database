<template>
  <v-hover
        v-slot:default="{ hover }">
  <td :style="!hover ? style : hoverStyle" @click="click" >
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
      //selected: false
    }
  },
  computed: {
    selected() {
      return this.cellId == this.selectedId && this.cellProp == this.selectedProp;
    },
    style() {
      var color = null;
      if(this.invalid && !this.selected) {
        color = '#FFEBEE';
      }
      else if (this.invalid && this.selected) {
        color = '#FFCDD2';
      }
      return {
        cursor:'cell',
        backgroundColor: color  
      }
    },
    hoverStyle() {
      var color = null;
      if(this.invalid) {
        color = '#EF5350'
      } else {
        color = '#BDBDBD';
      }
      return {
        cursor:'cell',
        backgroundColor: color  
      }
    }
  },
  watch: {
    /*
    selectedId(val, oldVal) {
      //console.log(`id changed ${val}`)
      if(val != this.cellId) {
        this.selected = false;
      }
    },
    selectedProp(val, oldVal) {
      //console.log(`prop changed ${val}`)
      if(val != this.cellProp) {
        this.selected = false;
      }
    }
    */
  },
  methods: {
    click() {
      //this.selected = true;
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
