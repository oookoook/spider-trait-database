<template>
  <v-data-table
      :headers="tableHeaders"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      dense
    >
    
    <template v-slot:header.actions="{}">
      <action-button tooltip small v-if="editor" icon="mdi-playlist-plus" text="Create all entites" @click="createBatch()"/>
    </template>
    
    <!--
    <template v-slot:item.actions="{ item }">
      <action-button tooltip v-if="editor && !item.valid.invalid && !item.valid.created" icon="mdi-plus" text="Create entity" @click="create(item)"/>
      <info-icon color="success" v-if="item.valid.created" text="Entity created" icon="mdi-check-bold" />
      <info-icon color="warining" v-if="item.valid.invalid" :text="item.valid.message" icon="mdi-alert-circle-outline" />
    </template>
    -->
    
    
    <template v-slot:item="{item, headers, index }">
        <tr>
            <td v-for="h in headers" :key="h.value">
              <!-- <v-simple-checkbox v-if="h.value=='data-table-select'"  :value="isSelected && item.valid.selectable" :disabled="!item.valid.selectable" /> -->
              <span v-if="h.value == 'actions'">
                <action-button tooltip small v-if="editor && !item.valid.invalid && !item.valid.created" icon="mdi-plus" text="Create entity" 
                :loading="loadingBtn == index" @click="loadingBtn = index; create(item)"/>
                <info-icon color="success" v-if="item.valid.created" text="Entity created" icon="mdi-check-bold" />
                <info-icon color="warning" v-if="item.valid.invalid" :text="item.valid.message" icon="mdi-alert-circle-outline" />
              </span>
              <span v-else>{{ getPropFormattedValue(item, h.value) }}</span>
            </td>
        </tr>
    </template>
    
    </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
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
      loadingBtn: null
    }
  },
  computed: {
    tableHeaders() {
      return this.getEntityHeaders(this.entity).concat([{text: 'Actions', value: 'actions', sortable: false }]);
    },
    ...mapGetters(['job'])
  },
  watch: {
    job(val, oldVal) {
      if(oldVal && !val) {
        this.loadingBtn = null;
        this.update();
      }
    }
  },
  methods: {
    create(item) {
      this.$emit('create', item);
    },
    createBatch() {
      var c = this.items.filter(i => i.valid.selectable);
      if(c.length == 0) {
        this.$store.dispatch('notify', {error: true, text: 'No valid entities to create.'});
        this.loadingBtn = null;
        return;
      }
      this.$emit('create', c);
    }
  },
  created () {
  },
  mounted () {
    //this.needsCount = true;
    //this.update();
  }
}
</script>
<style scoped>

</style>
