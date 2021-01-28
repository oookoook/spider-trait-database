<template>
  <v-card>
    <v-card-title><v-icon left>mdi-magnify</v-icon>Data explorer<v-spacer />
    <v-dialog width="700" v-model="tips">
      <template v-slot:activator="{ on }">
        <action-button text="Help" icon="mdi-help" v-on="on" />
      </template>
      <v-card>
        <v-card-title>Search tips</v-card-title>
        <v-card-text>
          <ul>
            <li>To find records for all genera and species of a certain family type its name into the <span class="font-weight-bold">Family</span> window.</li>
            <li>To find records for all species of a certain genus type its name into the <span class="font-weight-bold">Genus</span> window.</li>
            <li>To find records for a single species type its name into the <span class="font-weight-bold">Species</span> window.</li>
            <li>Look up abbreviations of traits under <router-link to="/traits">Lists &ndash; Traits</router-link>.</li>
            <li>To find records for all traits from a certain trait category type its name into the <span class="font-weight-bold">Trait Category</span> window.</li>
            <li>Look up abbreviations of methods under <router-link to="/methods">Lists &ndash; Methods</router-link>.</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <action-button text="Close" icon="mdi-cancel" @click="tips = false" />
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      <span v-on="on">
        <v-btn text :disabled="exportDisabled" :href="exportLinkCSV" download><v-icon>mdi-download</v-icon>Export CSV</v-btn>
        <v-btn text :disabled="exportDisabled" :href="exportLinkExcel" download><v-icon>mdi-file-excel-box</v-icon>Export Excel</v-btn>
        </span>
      </template>
      <span v-if="!exportDisabled">Download the filtered data (all pages)</span>
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
        :value-field="f.valueField" 
        :text-field="f.textField" 
        :show-all="f.showAll"
        :search-from-start="f.searchFromStart" 
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
    <v-tab href="#chart"><info-icon icon="mdi-chart-bar" text="Trait values chart (a single trait must be filtered)"/></v-tab>
    <v-tabs-items v-model="tab">
      <list-provider list="data" :filter="filter" v-slot="i">
      <v-tab-item value="preview">
        <data-preview-table :items="i.items" :loading="i.loading" :total="i.total" :options="i.options" @update="i.update" />
      </v-tab-item>
      <v-tab-item value="raw">
        <v-responsive>
        <data-export-table :items="i.items" :loading="i.loading" :total="i.total" :options="i.options" @update="i.update" />
        </v-responsive>
      </v-tab-item>
      </list-provider>
      <v-tab-item value="chart">
        <v-alert type="warning" v-if="!allowChart">Please select a trait in the data filter to enable chart.</v-alert>
        <v-card :loading="chartLoading" v-else>
          <!-- <v-card-title>Trait value histogram</v-card-title> -->
          <data-chart :filter="filter" :trait="chartTrait" :loading.sync="chartLoading" v-intersect="chartIntersect" :isVisible="chartVisible"/>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    </v-tabs>
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
import DataChart from '../components/DataChart'
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
    DataChart,
    InfoIcon
  },
  props: [],
  data () {
    return {
      tab: null,
      tips: false,
      filters: [
        { entity: 'order', endpoint: 'taxonomy', label:'Order', icon: 'mdi-bug-outline', valueField: 'taxonomy.order', searchFromStart: true, search: null },
        { entity: 'family', endpoint: 'taxonomy', label:'Family', icon: 'mdi-spider-web', valueField: 'taxonomy.family', searchFromStart: true, search: null },
        { entity: 'genus', endpoint: 'taxonomy', label:'Genus', icon: 'mdi-spider-thread', valueField: 'taxonomy.genus', searchFromStart: true, search: null },
        { entity: 'species', endpoint: 'taxonomy', label:'Genus & Species', icon: 'mdi-spider', valueField: 'taxonomy.id', textField: 'taxonomy.fullName'/*textField: ['taxonomy.genus', 'taxonomy.species', 'taxonomy.subspecies']*/, searchFromStart: true, search: null },
        { entity: 'original-name', endpoint: 'data', label:'Original name', icon: 'format-quote-close', valueField: 'originalName', searchFromStart: true, search: null },
        { entity: 'trait-category', endpoint: 'traits', label:'Trait category', icon: 'mdi-file-tree', valueField: 'trait.category.id', textField: 'trait.category.name', search: null, showAll: true },
        { entity: 'trait', endpoint: 'traits', label:'Trait', icon: 'mdi-comment-question-outline', valueField: 'trait.id', textField: ['trait.abbrev', 'trait.name'], search: null },
        { entity: 'method', endpoint: 'methods', label:'Method', icon: 'mdi-chart-bell-curve', valueField: 'method.id', textField: ['method.abbrev', 'method.name'], search: null },
        { entity: 'location', endpoint: 'locations', label:'Location', icon: 'mdi-map-marker', valueField: 'location.id', textField: ['location.abbrev'], search: null },
        { entity: 'country', endpoint: 'data', label:'Country', icon: 'mdi-flag-outline', valueField: 'country.id', textField: ['country.code', 'country.name'], search: null },
        { entity: 'dataset', endpoint: 'datasets', label:'Dataset', icon: 'mdi-table', valueField: 'dataset.id', textField: 'dataset.name', search: null },
        //{ entity: 'authors', endpoint: 'datasets', label:'Authors', icon: 'mdi-account-multiple', valueField: 'dataset.authors', search: null },
        { entity: 'reference', endpoint: 'references', label:'References', icon: 'mdi-bookmark-outline', valueField: 'reference.id', textField:'reference.fullCitation', search: null },
        //{ entity: 'row-link', endpoint: 'data', label:'Row links', icon: 'mdi-link', valueField: 'rowLink', search: null },
      ],
      shareMenu: false,
      internalRouteChange: false,
      chartLoading: false,
      chartVisible: false
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
    allowChart() {
      return this.filters[this.filtersLookup.trait].search != null;
    },
    chartTrait() {
      return parseInt(this.filters[this.filtersLookup.trait].search);
    },
    ...mapGetters('data', ['exportLinkCSV', 'exportLinkExcel', 'shareLink','routeLink'])
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
      this.$store.dispatch('notify', { text: 'The link has been copied to the clipboard' });
    },
    chartIntersect (entries, observer) {
        // More information about these options
        // is located here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
        this.chartVisible = entries[0].isIntersecting
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
