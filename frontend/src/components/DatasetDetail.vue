<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ item.name }}</v-card-title>
      <v-card-subtitle><v-breadcrumbs class="px-0" :items="breadcrumbs"/></v-card-subtitle>
      <v-card-text v-if="item">
      {{ item.notes }}
      </v-card-text>
        <v-list  v-if="item" three-line>
          <list-item title="Uploader" :text="item.uploader" icon="mdi-account" />
          <list-item v-if="showUpdate" title="Uploader contact" :text="item.email" icon="mdi-at" :link="`mailto:${item.email}`" link-icon="mdi-email-outline" link-tooltip="Send an email to the uploader" external/>
          <list-item title="Author(s)" :text="item.authors" icon="mdi-account-edit-outline" />
          <list-item title="Author email(s)" v-if="showUpdate && item.authorsEmail" :text="item.authorsEmail" icon="mdi-email-edit-outline" />
          <list-item title="Uploaded" :text="new Date(item.date).toISOString().substring(0,10)" icon="mdi-calendar" />
          <list-item title="State" icon="mdi-checkbox-marked-outline" ><span style="text-transform: capitalize;">{{item.state}}</span></list-item>    
        </v-list>
        <v-card-actions  v-if="item">
          <v-btn text :to="`/data/dataset/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
          <v-btn v-if="showUpdate" text color="warning" @click="$emit('edit')"><v-icon left>mdi-pencil-outline</v-icon>Edit</v-btn>
          <v-btn v-if="showUpdate" text color="warning" :to="`/prepare/transfer/${item.id}`"><v-icon left>mdi-table-edit</v-icon>Edit the data</v-btn>
        </v-card-actions>
      <!--  -->
  </v-card>
</template>

<script>

import ListItem from '../components/ListItem'

export default {
  name: 'DatasetDetail',
  components: {
    ListItem
  },
  props: { item: Object, loading: Boolean, showUpdate: Boolean, breadcrumbs: Array },
  data () {
    return {

    }
  },
  computed: {

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
