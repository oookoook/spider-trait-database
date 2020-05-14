<template>
  <entity-detail entity="method" list="methods" v-slot="{item, showUpdate, onEdit, breadcrumbs}">
    <method-detail
          :item="item"
          :show-update="showUpdate"
          :breadcrumbs="breadcrumbs"
          @edit="onEdit"
        />
  </entity-detail>
</template>

<script>
import EntityDetail from '../components/EntityDetail'
import MethodDetail from '../components/MethodDetail'
export default {
  name: 'method',
  components: {
    EntityDetail,
    MethodDetail
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
