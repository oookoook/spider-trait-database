<template>
  <v-data-table
      :headers="headers"
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
      <action-button tooltip small v-if="editor" icon="mdi-plus-multiple" text="Create selected entites" @click="createBatch()"/>
    </template>

    <template v-slot:item.actions="{ item }">
      <action-button tooltip v-if="editor && !item.valid.invalid && !item.valid.created" icon="mdi-plus" text="Create entity" @click="create(item)"/>
      <info-icon color="success" v-if="item.valid.created" text="Entity created" icon="mdi-check-bold" />
      <info-icon color="warining" v-if="item.valid.invalid" :text="item.valid.message" icon="mdi-alert-circle-outline" />
    </template>

    </v-data-table>
</template>

<script>
import ListTable from '../mixins/list-table'
import ActionButton from './ActionButton'
import InfoIcon from './InfoIcon'
export default {
  name: 'DistinctEntityTable',
  mixins: [ ListTable ],
  components: {
    ActionButton,
    InfoIcon
  },
  props: {
    editor: Boolean

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
    create(item) {
      this.$emit('create', item);
    },
    createBatch() {
      this.$emit('create', this.selected)
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
