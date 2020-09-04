<template>
  <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      :footer-props="footerProps"
    >

    <template v-slot:item="{item, headers}">
        <tr>
          <selectable-cell  v-for="h in headers" :key="h.value"
          :cellId="item.id" :cellProp="h.value" 
          :selectedId.sync="selectedId" 
          :selectedProp.sync="selectedProp"
          :invalid="isPropValid(item, h.value) !== true"
          @select="(e) => selectCell(e, item, h.value)">
            <v-icon v-if="isPropIcon(h.value)">{{ getIcon(item, h.value) }}</v-icon>
            <span v-else>{{ getPropFormattedValue(item, h.value, shorten) }}</span>
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
      footerProps: { 'items-per-page-options': [ 10, 15, 50, 100, 200 ] },
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
    selectCell(e, item, prop) {
      //console.dir(e);
      // e = { id: this.cellId, prop: this.cellProp }
      if(this.isPropReadOnly(prop)){
        e.readOnly = true;
      }
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
