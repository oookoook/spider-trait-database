<template>
  <v-card>
    <v-card-title>
      Created datasets
      <v-spacer />
      <action-button color="primary" @click="$emit('showNew')" tooltip></action-button>
    </v-card-title>
  <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      show-expand
      class="elevation-1"
    >

    <template v-slot:item.date="{ item }">
      {{ item.date.substr(0,10) }}
    </template>

    <template v-slot:item.state="{ item }">
      <info-icon color="success" v-if="item.state == 'approved'" icon="mdi-checkbox-marked-outline" :text="item.state" />
      <info-icon color="error" v-if="item.state == 'rejected'" icon="mdi-exclamation-thick" :text="item.state" />
      <info-icon color="info" v-if="item.state == 'created'" icon="mdi-pencil" :text="item.state"/>
      <info-icon color="warning" v-if="item.state == 'reviewed'" icon="mdi-stamper" :text="item.state"/>
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <v-container>
        <h3>Message</h3>
        <p v-if="item.message">{{ item.message }}</p>
        <p v-else>No message</p>
        <h3>Notes</h3>
        <p  v-if="item.notes">{{ item.notes }}</p>
        <p v-else>No notes</p>
        </v-container>
      </td>
    </template>

    <template v-slot:item.actions="{ item }">
      <entity-link-cell v-if="canEdit(item.state)" tooltip="Edit the dataset" :link="`/prepare/${item.id}`" icon="mdi-pencil" />
      <entity-link-cell v-if="item.state == 'approved'" tooltip="Set as filter in the data explorer" :link="`data/dataset/${item.id}`" icon="mdi-filter" />
    </template>

    <template v-slot:no-data>
      <action-button color="primary" @click="$emit('showNew')"></action-button>
    </template>

    </v-data-table>
  </v-card>
</template>

<script>

import ListTable from '../mixins/list-table'
import ActionButton from './ActionButton'
import InfoIcon from './InfoIcon'

export default {
  name: 'ImportsTable',
  mixins: [ ListTable ],
  components: { ActionButton, InfoIcon },
  props: { editor: Boolean },
  data () {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Created', value: 'date'},
        { text: 'State', value: 'state'},
        { text: 'Uploader', value: 'uploader' },
        //{ text: 'Uploader e-mail', value: 'email' },
        { text: 'Authors', value: 'name' },
        { text: 'Notes & Messages', value: 'data-table-expand', sortable: false},
        
        { text: 'Actions', value: 'actions'}
      ]
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    canEdit(state) {
      return (!this.editor && (state == 'created' || state == 'rejected')) || (this.editor && state =='reviewed');
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
