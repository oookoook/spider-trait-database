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
          <v-menu
        bottom
        right
        transition="scale-transition"
        origin="top left"
        :open-on-hover="true"
      >
        <template v-slot:activator="{ on }">
          <v-chip
            pill
            v-on="on"
          >
            {{getPropFormattedValue(item, prop.name) || '[empty]'}}
          </v-chip>
        </template>
        <v-card>
          <v-list>
            <v-list-item @click="column(item)">
              <v-list-item-icon>
                <v-icon>mdi-table-column</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Replace the value</v-list-item-title>
                <!-- <v-list-item-subtitle>Replaces the value in  the whole column</v-list-item-subtitle> -->
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="rule(item)">
                <v-list-item-icon>
                <v-icon>mdi-table-search</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Use as a rule</v-list-item-title>
                <!-- <v-list-item-subtitle>Sets up the value as a rule for batch modification</v-list-item-subtitle> -->
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
          </v-menu>
    </v-col>
    </v-row>

    </v-data-iterator>
</template>

<script>
import ImportProps from '../mixins/import-props'
import ListTable from '../mixins/list-table'
import ActionButton from './ActionButton'
import ActionMenu from './ActionMenu'
export default {
  name: 'DistinctValueList',
  mixins: [ ListTable, ImportProps ],
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
    },
    test(on) {
      console.dir(on);
      return 'test';
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
