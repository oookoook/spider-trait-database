<template>
  <v-card>
    <v-card-title>
      Datasets to import
      <v-spacer v-if="!editor"/>
      <action-button  v-if="!editor" color="primary" @click="showNewDialog(true)" tooltip></action-button>
    </v-card-title>
  <v-bottom-sheet v-if="!editor" v-model="showNew">
    <entity-provider list="imports" create  :template="dataset" v-slot="i" @save="prepare">
      <dataset-form @hide="showNewDialog(false)" :loading="i.loading" v-model="i.item" create></dataset-form>
    </entity-provider>
  </v-bottom-sheet>
   <list-provider list="imports" v-slot="i">
    <imports-table :items="i.items"
    :editor="editor" 
    :loading="i.loading" 
    :total="i.total" 
    @update="i.update" 
    @showNew="showNewDialog(true)" />
  </list-provider>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import DatasetForm from '../components/DatasetForm'
import ImportsTable from '../components/ImportsTable'
import ListProvider from '../components/ListProvider'
import EntityProvider from '../components/EntityProvider'
import ActionButton from './ActionButton'

export default {
  name: 'ImportsManager',
  components: {
    DatasetForm,
    ImportsTable,
    ListProvider,
    EntityProvider,
    ActionButton
  },
  props: { editor: Boolean, user: Object },
  data () {
    return {
      showNew: false,
      dataset: null
    }
  },
  computed: {

  },
  watch: {
    $route(to, from) {
        this.processRoute();
    }
  },
  methods: {
    processRoute() {
      //this.$route.params.id
      if(this.$route.path.indexOf('new') > -1) {
        this.newDs();
        this.showNew = true;
      } else {
        this.showNew = false;
      }
    },
    showNewDialog(s) {
      if(s) {
        this.$router.push('/import/new');
      } else {
        this.$router.push('/import');
      }
    },
    prepare(id) {
      this.$router.push(`/prepare/${id}`);
    },
    newDs() {
      this.dataset = {};
      this.dataset.name = this.user.name.replace(' ', '').toLowerCase() + "_" + new Date().toISOString().substr(0,10);
      this.dataset.uploader = this.user.name;
      this.dataset.email = this.user.email;
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
