<template>
  <entity-detail entity="location" list="locations" v-slot="{item, showUpdate, onEdit, breadcrumbs}">
    <location-detail
          :item="item"
          :show-update="showUpdate"
          :breadcrumbs="breadcrumbs"
          @edit="onEdit"
        />
  </entity-detail>
</template>

<script>
import EntityDetail from '../components/EntityDetail'
import LocationDetail from '../components/LocationDetail'
export default {
  name: 'method',
  components: {
    EntityDetail,
    LocationDetail
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
