<template>
  <v-card>
    <v-card-title><v-icon left>mdi-magnify</v-icon>Data explorer<v-spacer />
    <action-button text="Reset filters" icon="mdi-eraser" @click="reset" />
    <!-- Share link button -->
    <v-menu v-model="shareMenu" :close-on-content-click="false" :nudge-width="600">
      <template v-slot:activator="{ on: menu }">
        <v-tooltip top>
          <template v-slot:activator="{ on:tooltip }">
            <v-btn text v-on="{...tooltip, ...menu}"><v-icon>mdi-share</v-icon>Share</v-btn>
          </template>
          <span>Get a link to this view</span>
        </v-tooltip>
      </template>
      <v-card>
        <v-card-title>Share link</v-card-title>
        <v-card-text>
          <v-text-field id="linkField" prepend-icon="mdi-link" readonly v-model="shareLink"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="shareMenu=false"><v-icon left>mdi-close</v-icon>Close</v-btn>
          <v-btn text @click="copyLink()"><v-icon left>mdi-content-copy</v-icon>Copy</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <!-- Export button -->
    <v-tooltip top>
      <template v-slot:activator="{ on }">
      <span v-on="on"><v-btn text :disabled="exportDisabled" :href="exportLink"><v-icon>mdi-download</v-icon>Export</v-btn></span>
      </template>
      <span v-if="!exportDisabled">Download the filtered data as CSV (all pages)</span>
      <span v-else>Please set up a filter before exporting</span>
    </v-tooltip>
    </v-card-title>
    <v-card-text>
    <v-row>
      <!-- Data filters -->
      <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="f in filters" :key="f.entity">
      <autocomplete-provider 
        list="data" 
        :endpoint="f.endpoint"
        :entity="f.entity" 
        :valueField="f.valueField" 
        :textField="f.textField" 
        :showAll="f.showAll" 
        v-slot="i">
      <data-filter
        v-model="f.search"  
        :items="i.items" 
        :loading="i.loading"
        :label="f.label"
        :icon="f.icon" 
        @autocomplete="i.autocomplete"
        @init="i.init">
      </data-filter>
      </autocomplete-provider>
      </v-col>
    </v-row>
    <list-provider list="data" :filter="filter" v-slot="i">
    <v-tabs
      v-model="tab"
      grow
      
    >
    <!--Preview icons-and-text-->
    <v-tab href="#preview">
        <!--<v-icon>mdi-eye-outline</v-icon>-->
        <info-icon icon="mdi-eye-outline" text="Preview"/>
    </v-tab>
    <!-- Raw -->
    <v-tab href="#raw"><info-icon icon="mdi-table-large" text="Raw data view"/></v-tab>

    <v-tabs-items v-model="tab">
      <v-tab-item value="preview">
        <data-preview-table :items="i.items" :loading="i.loading" :total="i.total" :options="i.options" @update="i.update" />
      </v-tab-item>
      <v-tab-item value="raw">
        <v-responsive>
        <data-export-table :items="i.items" :loading="i.loading" :total="i.total" :options="i.options" @update="i.update" />
        </v-responsive>
      </v-tab-item>
    </v-tabs-items>
    </v-tabs>
    </list-provider>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import AutocompleteProvider from '../components/AutocompleteProvider'
import ActionButton from '../components/ActionButton'
import InfoIcon from '../components/InfoIcon'
import ListProvider from '../components/ListProvider'
import DataExportTable from '../components/DataExportTable'
import DataPreviewTable from '../components/DataPreviewTable'
import DataFilter from '../components/DataFilter'


export default {
  name: 'DataExplorer',
  components: {
    ActionButton,
    AutocompleteProvider,
    ListProvider,
    DataExportTable,
    DataPreviewTable,
    DataFilter,
    InfoIcon
  },
  props: [],
  data () {
    return {
      tab: null,
      filters: [
        { entity: 'family', endpoint: 'taxonomy', label:'Family', icon: 'mdi-spider-web', valueField: 'taxonomy.family', search: null },
        { entity: 'genus', endpoint: 'taxonomy', label:'Genus', icon: 'mdi-spider-thread', valueField: 'taxonomy.genus', search: null },
        { entity: 'species', endpoint: 'taxonomy', label:'Species', icon: 'mdi-spider', valueField: 'taxonomy.id', textField: ['taxonomy.genus', 'taxonomy.species', 'taxonomy.subspecies'], search: null },
        { entity: 'trait-category', endpoint: 'traits', label:'Trait category', icon: 'mdi-file-tree', valueField: 'trait.category.id', textField: 'trait.category.name', search: null, showAll: true },
        { entity: 'trait', endpoint: 'traits', label:'Trait', icon: 'mdi-comment-question-outline', valueField: 'trait.id', textField: ['trait.abbrev', 'trait.name'], search: null },
        { entity: 'method', endpoint: 'methods', label:'Method', icon: 'mdi-chart-bell-curve', valueField: 'method.id', textField: ['method.abbrev', 'method.name'], search: null },
        { entity: 'location', endpoint: 'locations', label:'Location', icon: 'mdi-map-marker', valueField: 'location.id', textField: ['location.abbrev'], search: null },
        { entity: 'country', endpoint: 'locations', label:'Country', icon: 'mdi-flag-outline', valueField: 'location.country.id', textField: ['location.country.code', 'location.country.name'], search: null },
        { entity: 'habitat', endpoint: 'locations', label:'Global habitat', icon: 'mdi-map', valueField: 'location.habitatGlobal.id', textField: 'location.habitatGlobal.name', search: null },
        { entity: 'dataset', endpoint: 'datasets', label:'Dataset', icon: 'mdi-table', valueField: 'dataset.id', textField: 'dataset.name', search: null },
        //{ entity: 'authors', endpoint: 'datasets', label:'Authors', icon: 'mdi-account-multiple', valueField: 'dataset.authors', search: null },
        { entity: 'reference', endpoint: 'references', label:'References', icon: 'mdi-bookmark-outline', valueField: 'reference.id', textField:'reference.abbrev', search: null },
        { entity: 'row-link', endpoint: 'data', label:'Row links', icon: 'mdi-link', valueField: 'rowLink', search: null },
      ],
      shareMenu: false,
      internalRouteChange: false,
    }
  },
  computed: {
    exportDisabled() {
      return !this.filter || Object.keys(this.filter).length==0;
    },
    filter() {
      var f = {};
      this.filters.filter(e => e.search != null).forEach(e => { f[e.entity] = e.search });
      return f;
    },
    filtersLookup() {
      var l = {};
      this.filters.forEach((f,i) => { l[f.entity] = i });
      return l;
    },
    ...mapGetters('data', ['exportLink', 'shareLink','routeLink'])
  },
  watch: {
    routeLink() {
      console.log('router link changed');
      var newRoute = `/data/${this.routeLink}`;
      //console.log(this.$route.path);
      //console.log(newRoute);
      if(this.$route.path != newRoute) {
        //console.log(this.$route);
        this.internalRouteChange = true;
        this.$router.replace(newRoute);
      }
      
    },
    // watch route to fill in the search filters
    // also, define a route with a full params
    // and redirect the short version to the full route
    // the url should change without reload, so deal only with a situation where for given filter, the search is null
    $route(to, from) {
      if(this.internalRouteChange) {
        // ignore local route changes
        this.internalRouteChange = false;
        return;
      }
      this.processRoute(to, from);
      /*
      if(from.indexOf('/data') != 0) {
        // we are coming from a different page, we have to process the filter and load the values
      }
      */
    }
  },
  methods: {
    copyLink() {
      // https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
      var link = document.querySelector('input#linkField');
      link.select();
      link.setSelectionRange(0, 99999); /*For mobile devices*/
      /* Copy the text inside the text field */
      document.execCommand("copy");
      this.$store.dispatch('notify', { text: 'The link was copied to the clipboard' });
    },
    processRoute() {
      console.log('Processing route');
      var p = this.$route.params;
      //console.dir(p);
      if(p.entity) {
        // set up the filter (easy)
        //console.log(p.entity);
        //console.dir(this.filtersLookup);
        this.filters[this.filtersLookup[p.entity]].search = p.id;
        // set up the autocomplete text (hard)
        // this happens at the watcher in the Data filter
      } else if(p && p.family) {
        // there are the entity params - this is the full route
        this.filters.forEach(i => { var term = p[i.entity.replace('-','')]; i.search = (term != '*') ? term : null });
        //console.dir(this.filters);
      } else {
        // just the plain path - reset all the filters
        this.filters.forEach(f => { f.search = null });
      }

    },
    reset() {
      this.$router.push('/data');
    }
  },
  created () {

  },
  mounted () {
    this.processRoute();
  }
}
</script>
<style scoped>

</style>
