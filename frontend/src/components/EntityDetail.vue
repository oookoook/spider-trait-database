<template>
  <v-container>
    <entity-provider
      :list="list"
      :id="id"
      :create="entityCreate"
      v-slot="i"
      @update="entityRefresh"
      @create="entityRefresh"
      @remove="entityList(list)"
    >
      <!--
      <v-breadcrumbs
        :items="[{ text: listTitle, to: `/${list}`, exact: true }, { text: i.item ? i.item.abbrev : `New ${entityTitle}`, to: currentPath }]"
      />
      -->
      <v-slide-x-transition mode="out-in">
        <!--
        <trait-detail
          v-if="i.item && !editDialog"
          :item="i.item"
          :show-update="isEditor"
          @edit="entityEdit=true"
        />
        -->
        <slot v-if="i.item && !editDialog" 
        :item="i.item" 
        :showUpdate="isEditor" 
        :onEdit="() => {entityEdit = true}"
        :breadcrumbs="[{ text: listTitle, to: `/${list}`, exact: true }, { text: i.item[breadcrumbProp], to: currentPath }]">
        {{ JSON.stringify(i.item) }}
        </slot>
        <entity-dialog
          v-if="editDialog"
          :loading="i.loading"
          :create="entityCreate"
          :item="i.item"
          :entity-props="i.entityProps"
          :breadcrumbs="[{ text: listTitle, to: `/${list}`, exact: true }, { text: i.item ? i.item[breadcrumbProp] : 'New item', to: currentPath }]"
          :confirmation-text="deleteConfirmationText"
          @save="i.save"
          @remove="i.remove"
          @cancel="hideEdit"
        />
      </v-slide-x-transition>
    </entity-provider>

    <list-provider v-if="id" list="data" :entity="entity" :id="id" v-slot="i" nosave>
      <v-card>
        <v-card-title>Data preview ({{i.items.length}} records)</v-card-title>
        <data-preview-table
          :items="i.items"
          :loading="i.loading"
          :total="i.total"
          @update="i.update"
        />
      </v-card>
    </list-provider>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import IdFromRoute from "../mixins/id-from-route";
import EntityProvider from "../components/EntityProvider";
import ListProvider from "../components/ListProvider";
import EntityDialog from "../components/EntityDialog";
import DataPreviewTable from "../components/DataPreviewTable";
export default {
  name: "entityDetail",
  mixins: [IdFromRoute],
  components: {
    EntityProvider,
    ListProvider,
    EntityDialog,
    DataPreviewTable
  },
  props: { list: String, entity: String, breadcrumbProp: { type: String, default: 'abbrev'}, breadcrumbList: { type: String }, deleteConfirmationText: String },
  data() {
    return {
      entityCreate: false,
      entityEdit: false
    };
  },
  computed: {
    listTitle() {
      if (!this.list) {
        return "";
      }
      if(this.breadcrumbList) {
        return this.breadcrumbList;
      }
      return this.list[0].toUpperCase() + this.list.substr(1);
    },
    entityTitle() {
      if (!this.entity) {
        return "";
      }
      return this.entity[0].toUpperCase() + this.entity.substr(1);
    },
    currentPath() {
      return this.$route.path;
    },
    editDialog() {
      return this.isEditor && (this.entityCreate || this.entityEdit);
    },
    ...mapGetters(["isEditor"])
  },
  watch: {
    $route(to, from) {
      this.processRouteNew();
    },
    entityCreate(val, oldVal) {
      console.log('entityCreate watcher executed');
      if(oldVal && !val) {
        this.$router.push(`/${this.list}`);
      }
    }
  },
  methods: {
    processRouteNew() {
      var p = this.$route.params.id;
      if (!p) {
        return;
      }
      if (p === "new") {
        this.entityCreate = true;
        this.id = null;
      } else {
        this.entityCreate = false;
      }
    },
    entityRefresh(id) {
      console.log('entity refresh');
      if (!this.id && this.entityCreate) {
        this.$router.push(this.currentPath.replace(/new$/, id));
      } else {
        this.entityEdit = false;
        this.id = id;
        //this.$router.go(0);
      }
    },
    entityList(endpoint) {
      this.$router.push(`/${endpoint}`);
    },
    hideEdit() {
      this.entityEdit=false;
      this.entityCreate=false;
    }
  },
  created() {},
  mounted() {
    this.processRouteNew();  
  }
};
</script>
<style scoped>
</style>
