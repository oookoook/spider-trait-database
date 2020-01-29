<template>
  <v-card>
    <v-card-title>
      Traits
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        clearable
        append-outer-icon="mdi-magnify"
        label="Search by trait name"
        single-line
        hide-details
        @click:append-outer="needsCount = true; update()"
      ></v-text-field>
    </v-card-title>
  <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
    >
    <template v-slot:item.abbrev="{ item }">
      <v-tooltip top>
      <template v-slot:activator="{ on }">
        <router-link :to="`/traits/${item.id}`"><span v-on="on">{{item.abbrev}}</span></router-link>
      </template>
      <span>Search the data for this trait</span>
    </v-tooltip>
    </template>
    <template v-slot:item.reference="{ item }">
      <v-tooltip top v-if="item.reference">
      <template v-slot:activator="{ on }">
        <router-link :to="`/references/${item.reference.id}`"><span v-on="on">{{item.reference.abbrev}}</span></router-link>
      </template>
      <span>Open the reference detail</span>
    </v-tooltip>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn icon :to="`/data/trait/${item.id}`" v-on="on"><v-icon>mdi-magnify</v-icon></v-btn>
      </template>
      <span>Search the data for this trait</span>
    </v-tooltip>
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">{{item.description}}</td>
    </template>

    </v-data-table>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'TraitsTable',
  components: {
  },
  props: { items: Array, total: { type: Number, default: 0 }, loading: Boolean },
  data () {
    return {
      search: null,
      needsCount: true,
      options: {},
      headers: [
        { text: 'Trait ID', value: 'abbrev' },
        { text: 'Life Category', value: 'category.name' },
        { text: 'Trait Name', value: 'name' },
        /*
        { text: 'Definition', value: 'data-table-expand'},
        { text: 'Data type', value: 'dataType.name'},
        { text: 'Standard', value: 'standard'},
        */
        { text: 'Reference', value: 'reference'},
        { text: 'Actions', value: 'actions'}
      ]
    }
  },
  computed: {

  },
  watch: {
    options: {
        handler () {
          this.update();
        },
        deep: true,
    },
    search(val, oldVal) {
      // field was cleared
      if(val == null && oldVal != null) {
        this.needsCount = true;
        this.update();
      }
    }
  },
  methods: {
    update() {
      //console.log('update called')
      this.$emit('update', {options: this.options, search: this.search, count: this.needsCount, searchField: 'name' });
      this.needsCount = false;
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
