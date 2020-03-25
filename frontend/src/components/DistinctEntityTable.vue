<template>
  <v-data-table
      :headers="tableHeaders"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      v-model="selected"
      selectable-key="valid.selectable"
      dense
      :show-select="editor"
    >
    
    <template v-slot:header.actions="{}">
      <action-button tooltip small v-if="editor" icon="mdi-playlist-plus" text="Create selected entites" @click="createBatch()"/>
    </template>
    
    <template v-slot:item.actions="{ item }">
      <action-button tooltip v-if="editor && !item.valid.invalid && !item.valid.created" icon="mdi-plus" text="Create entity" @click="create(item)"/>
      <info-icon color="success" v-if="item.valid.created" text="Entity created" icon="mdi-check-bold" />
      <info-icon color="warining" v-if="item.valid.invalid" :text="item.valid.message" icon="mdi-alert-circle-outline" />
    </template>
    
    
    <!--
    <template v-slot:item="{item, headers, select, isSelected}">
        <tr>
            <td v-for="h in headers" :key="h.value">
              <v-simple-checkbox v-if="h.value=='data-table-select'"  :value="isSelected && item.valid.selectable" :disabled="!item.valid.selectable" />
              <span v-else-if="h.value == 'actions'">
                <action-button tooltip v-if="editor && !item.valid.invalid && !item.valid.created" icon="mdi-plus" text="Create entity" @click="create(item)"/>
                <info-icon color="success" v-if="item.valid.created" text="Entity created" icon="mdi-check-bold" />
                <info-icon color="warining" v-if="item.valid.invalid" :text="item.valid.message" icon="mdi-alert-circle-outline" />
              </span>
              <span v-else>{{ getPropFormattedValue(item, h.value) }}</span>
            </td>
        </tr>
    </template>
    -->
    </v-data-table>
</template>

<script>
import ListTable from '../mixins/list-table'
import ImportProps from '../mixins/import-props'
import ActionButton from './ActionButton'
import InfoIcon from './InfoIcon'
export default {
  name: 'DistinctEntityTable',
  mixins: [ ListTable, ImportProps ],
  components: {
    ActionButton,
    InfoIcon
  },
  props: {
    editor: Boolean,
    entity: String
  },
  data () {
    return {
      selected: []
    }
  },
  computed: {
    tableHeaders() {
      return this.getEntityHeaders(this.entity).concat([{text: 'Actions', value: 'actions'}]);
    },
  },
  watch: {

  },
  methods: {
    create(item) {
      this.$emit('create', item);
    },
    createBatch() {
      this.$emit('create', this.selected.filter(i => i.valid.selectable));
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
