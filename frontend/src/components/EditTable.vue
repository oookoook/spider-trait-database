<template>
  <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
    >

    <template v-slot:item="{item, headers}">
        <tr>
          <selectable-cell  v-for="h in headers" :key="h.value"
          :cellId="item.id" :cellProp="h.value" 
          :selectedId.sync="selectedId" 
          :selectedProp.sync="selectedProp"
          :invalid="isPropValid(item, h.value) !== true"
          @select="(e) => selectCell(e, item)">
            <span>{{ getPropFormattedValue(item, h.value, shorten) }}</span>
          </selectable-cell>
        </tr> 
    </template>
    <template v-slot:no-data>
          <slot />
    </template>
    </v-data-table>
</template>

<script>

import ImportProps from '../mixins/import-props'
import ListTable from '../mixins/list-table'
import SelectableCell from './SelectableCell'

export default {
  name: 'EditTable',
  mixins: [ListTable, ImportProps],
  components: {
    SelectableCell
  },
  props: {
    shorten: Boolean
  },
  data () {
    return {
      selectedId: null,
      selectedProp: null
    }
  },
  computed: {

  },
  watch: {
    shorten() {
      this.update();
    }
  },
  methods: {
    selectCell(e, item) {
      //console.dir(e);
      // e = { id: this.cellId, prop: this.cellProp }
      e.item = item;
      this.$emit('selectCell', e);
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
