<template>
  <v-card :loading="loading">
      <v-card-title v-if="item">{{ item.name }}</v-card-title>
      <v-card-subtitle v-if="item">{{ item.authors }}</v-card-subtitle>
      <v-card-text v-if="item">
      {{ item.notes }}
      </v-card-text>
        <v-list  v-if="item" three-line>
          <list-item title="Uploader" :text="item.uploader" icon="mdi-account" />
          <list-item title="Uploader contact" :text="item.email" icon="mdi-at" :link="`mailto:${item.email}`" link-icon="mdi-email-outline" link-tooltip="Send an email to the uploader"/>
          <list-item title="Uploaded" :text="new Date(item.date).toISOString().substring(0,10)" icon="mdi-calendar" />
          <list-item title="State" icon="mdi-checkbox-marked-outline" ><span style="text-transform: capitalize;">{{item.state}}</span></list-item>    
        </v-list>
        <v-card-actions  v-if="item">
          <v-btn text :to="`/data/dataset/${item.id}`"><v-icon left>mdi-filter</v-icon>Set as filter in the data explorer</v-btn>
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
  props: { item: Object, loading: Boolean },
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
