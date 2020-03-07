<template>
  <v-card>
    <v-card-title>Data editor</v-card-title>
    <v-card-text>
      <v-toolbar dense>
        <!-- buttons:
        Upload file
        Delete all records
        Show valid, Show Invalid (multiple)
        Delete dataset
        Show dataset details
        Send for review/Approve
        Reject
        Show distinct values (or in the column headers?)
        -->
      </v-toolbar>

      <list-provider list="imports" v-slot="i">
        <edit-table editor
        :items="i.items" 
        :loading="i.loading" 
        :total="i.total"  
        @update="i.update"  
         />
         <!-- In each cell a context menu:
          edit single cell
          edit the value in the whole column
          set this as filter for replace

          indication if cell is valid (e.g. color of the menu?)
          -->
      </list-provider>  
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'DataEditor',
  components: {
  },
  props: {editor: Boolean},
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
