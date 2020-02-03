<template>
  <v-card>
    <v-card-title>
      Traits
      <v-spacer></v-spacer>
      <v-select
          v-model="searchField"
          :items="searchFields"
          label="Search parameter"
          single-line
          hide-details

        ></v-select>
      <v-autocomplete
        :loading="autocompleteLoading"
        :items="autocompleteItems"
        v-model="search"
        clearable
        append-outer-icon="mdi-magnify"
        label="Search for..."
        single-line
        hide-details
        :search-input.sync="autocompleteInput"
        return-object
        @click:append-outer="needsCount = true; update()"
      >

      </v-autocomplete>
      <!--
      <v-text-field
        v-model="search"
        clearable
        append-outer-icon="mdi-magnify"
        label="Search by trait name"
        single-line
        hide-details
        @click:append-outer="needsCount = true; update()"
      ></v-text-field>
      -->
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
      <entity-link-cell :text="item.abbrev" tooltip="View the trait detail" :link="`/traits/${item.id}`" />
    </template>
    
    <template v-slot:item.reference="{ item }">
      <entity-link-cell v-if="item.reference" :text="item.reference.abbrev" tooltip="View the reference detail" :link="`/references/${item.reference.id}`" />
    </template>

    <template v-slot:item.actions="{ item }">
    <entity-link-cell tooltip="Set as filter in the data explorer" :link="`/traits/${item.id}`" icon="mdi-filter" />
    </template>
    <!--
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">{{item.description}}</td>
    </template>
    -->
    </v-data-table>
  </v-card>
</template>

<script>

import EntityLinkCell from '../components/EntityLinkCell'

export default {
  name: 'TraitsTable',
  components: {
    EntityLinkCell
  },
  props: { items: Array, total: { type: Number, default: 0 }, loading: Boolean, 'autocomplete-loading': Boolean, 'autocomplete-items': Array },
  data () {
    return {
      search: null,
      searchFields: [{ text: 'Life category', valueField: 'category.id', textField: 'category.name' }, { text: 'Trait name', valueField: 'id', textField: ['abbrev','name'] }],
      searchField: { text: 'Life category', valueField: 'category.id', textField: 'category.name' },
      autocompleteInput: null,
      needsCount: true,
      options: {},
      headers: [
        { text: 'Trait ID', value: 'abbrev' },
        { text: 'Life Category', value: 'category.name' },
        { text: 'Trait Name', value: 'name' },
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
    },
    autocompleteInput(val) {
      console.log('acval changed');
      this.autocomplete();
    }

  },
  methods: {
    update() {
      //console.log('update called')
      this.$emit('update', {options: this.options, search: this.search, count: this.needsCount, searchField: this.searchField, searchLike: true });
      this.needsCount = false;
    },
    autocomplete() {
      this.$emit('autocomplete', { term: this.autocompleteInput, field: this.searchField })
    }
  },
  created () {

  },
  mounted () {
    this.autocomplete();
  }
}
</script>
<style scoped>

</style>
