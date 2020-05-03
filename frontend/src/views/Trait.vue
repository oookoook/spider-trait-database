<template>
  <v-container>
  <entity-provider :list="list" :id="id" :create="entityCreate" v-slot="i" @update="entityRefresh" @create="entityRefresh" @remove="entityList(list)">
    <v-breadcrumbs :items="[{ text: listTitle, to: `/${list}`, exact: true }, { text: i.item ? i.item.abbrev : `New ${entityTitle}`, to: currentPath }]" />
    <v-slide-x-transition>
    <trait-detail v-if="i.item && !editDialog" :item="i.item" :show-update="isEditor" @edit="entityEdit=true" />
    <entity-dialog v-if="editDialog" :item="i.item" :entity-props="i.entityProps" @save="i.save" @remove="i.remove" @cancel="entityEdit=false"/>
    </v-slide-x-transition>
  </entity-provider>
  
  <list-provider v-if="id" list="data" :entity="entity" :id="id" v-slot="i">
    <v-card>
      <v-card-title>Data preview</v-card-title>
      <data-preview-table :items="i.items" :loading="i.loading" :total="i.total" @update="i.update"/>
    </v-card>
  </list-provider>
  
  </v-container>
</template>

<script>
import IdFromRoute from '../mixins/id-from-route' 
import EntityProvider from '../components/EntityProvider'
import ListProvider from '../components/ListProvider'
import TraitDetail from '../components/TraitDetail'
import EntityDialog from '../components/EntityDialog'
import DataPreviewTable from '../components/DataPreviewTable'
export default {
  name: 'trait',
  mixins: [IdFromRoute],
  components: {
    EntityProvider,
    TraitDetail,
    ListProvider,
    EntityDialog,
    DataPreviewTable
  },
  props: [],
  data () {
    return {
      list: 'traits',
      entity: 'trait'
    }
  },
  computed: {
    listTitle() {
      if(!this.list) {
        return '';
      }
      return this.list[0].toUpperCase() + this.list.substr(1);
    },
    entityTitle() {
      if(!this.entity) {
        return '';
      }
      return this.entity[0].toUpperCase() + this.entity.substr(1);
    },
    entityDetail() {
      if(!this.entity) {
        return 'div';
      }
      return 
    }
  },
  watch: {

  },
  methods: {

  },
  created () {

  },
  mounted () {
  }
}
</script>
<style scoped>

</style>
