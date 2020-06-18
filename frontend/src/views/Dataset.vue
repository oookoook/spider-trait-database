<template>
  <entity-detail entity="dataset" list="datasets" breadcrumb-prop="name" v-slot="{item, showUpdate, onEdit, breadcrumbs}"
  delete-confirmation-text="Are you sure you want to delete the dataset? All the data from this dataset will be removed from the database. This can't be undone.">
    <dataset-detail 
      :item="item"
      :show-update="showUpdate"
      :breadcrumbs="breadcrumbs"
      @edit="onEdit"
    />
  </entity-detail>
</template>

<script>
import EntityDetail from '../components/EntityDetail'
import DatasetDetail from '../components/DatasetDetail'
export default {
  name: 'dataset',
  components: {
    EntityDetail,
    DatasetDetail,
  },
  props: [],
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
