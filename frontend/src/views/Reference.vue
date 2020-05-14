<template>
  <entity-detail entity="reference" list="references" v-slot="{item, showUpdate, onEdit, breadcrumbs}">
    <reference-detail
          :item="item"
          :show-update="showUpdate"
          :breadcrumbs="breadcrumbs"
          @edit="onEdit"
        />
  </entity-detail>
</template>

<script>
import EntityDetail from '../components/EntityDetail'
import ReferenceDetail from '../components/ReferenceDetail'
export default {
  name: 'reference',
  components: {
    EntityDetail,
    ReferenceDetail,
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
