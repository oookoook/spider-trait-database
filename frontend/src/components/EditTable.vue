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
          :invalid="!isValid(item, h.value)"
          @select="selectCell">
            <span>{{ getValue(item, h.value) }}</span>
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

import ListTable from '../mixins/list-table'

import ActionButton from './ActionButton'
import ActionMenu from './ActionMenu'
import SelectableCell from './SelectableCell'

export default {
  name: 'EditTable',
  mixins: [ListTable],
  components: {
    ActionButton,
    ActionMenu,
    SelectableCell
  },
  data () {
    return {
      // TODO proper columns
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'WSC LSID', value: 'wsc.lsid' },
        { text: 'Original name', value: 'originalName' },
        { text: 'Trait ID', value: 'trait.abbrev' },
        { text: 'Trait value', value: 'value' },
        { text: 'Measure', value: 'measure' },
        { text: 'Sex', value: 'sex' },
        { text: 'Life stage', value: 'lifeStage' },
        { text: 'Frequency', value: 'frequency' },
        { text: 'Sample size', value: 'sampleSize' },
        { text: 'Method', value: 'method.abbrev'},
        { text: 'Location', value: 'location'},
        { text: 'Event date', value: 'eventDate'},
        { text: 'Reference', value: 'reference.raw'},
        { text: 'Related records', value: 'rowLink'}
      ],
      selectedId: null,
      selectedProp: null
    }
  },
  computed: {

  },
  watch: {
  },
  methods: {
    getValue(item, h) {
      //console.dir(item);
      // from input such as 'eventDate.start' gets value item[eventDate][start]
      var i = item;
      var v = null;
      var a = h.split('.');
      var pos = 0;
      while(pos < a.length) {
        v = i[a[pos]];
        i = i[a[pos]];
        pos+=1;
      }
      return v;
    },
    isValid(item, h) {
      var val = this.getValue(item, h);
      // TODO define rules for cell validity
      return true;
    },
    selectCell(e) {
      //console.dir(e);
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
