<template>
  <v-data-iterator
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      v-slot="props"
    >
    <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="2"
            xl="1"
          >
          <div>{{prop.displayValue(item)}}
            <action-menu>
              <action-button menu text="Replace value" @click="column(item)"/>
              <action-button menu text="Use as rule" @click="rule(item)"/>
            </action-menu>
          </div>
    </v-col>
    </v-row>

    </v-data-iterator>
</template>

<script>
import ListTable from '../mixins/list-table'
import ActionButton from './ActionButton'
import ActionMenu from './ActionMenu'
export default {
  name: 'DistinctValueList',
  mixins: [ ListTable ],
  components: {
    ActionButton,
    ActionMenu
  },
  props: {
    prop: Object
  },
  data () {
    return {
      selected: []
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    column(item) {
      this.$emit('column', {prop: this.prop.name, value: this.prop.displayValue(item)});
    },
    rule(item) {
      this.$emit('rule', {prop: this.prop.name, value: this.prop.displayValue(item)});
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
