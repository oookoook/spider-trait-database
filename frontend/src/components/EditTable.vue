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
          :invalid="isPropValid(item, h.value) === true"
          @select="selectCell(e, item)">
            <span>{{ getPropValue(item, h.value) }}</span>
          </selectable-cell>
          <!--
          <action-menu>
            <action-button color="success" text="Distinct values in column" icon="mdi-format-list-numbered" menu />
            <action-button color="success" text="Edit only this row" icon="mdi-table-row" menu />
            <action-button color="success" text="Edit the value in the whole column" icon="mdi-table-column" menu />
            <action-button color="success" text="Use this value as rule for value change" icon="mdi-table-search" menu />
          </action-menu>
          </td>
          -->
        
        </tr> 
    </template>

    </v-data-table>
</template>

<script>

import ImportProps from '../mixins/import-props'
import ListTable from '../mixins/list-table'

import ActionButton from './ActionButton'
import ActionMenu from './ActionMenu'
import SelectableCell from './SelectableCell'

export default {
  name: 'EditTable',
  mixins: [ListTable, ImportProps],
  components: {
    ActionButton,
    ActionMenu,
    SelectableCell
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
