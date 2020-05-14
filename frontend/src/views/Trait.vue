<template>
  <entity-detail entity="trait" list="traits" v-slot="{item, showUpdate, onEdit, breadcrumbs}">
    <trait-detail
          :item="item"
          :show-update="showUpdate"
          :breadcrumbs="breadcrumbs"
          @edit="onEdit"
        />
  </entity-detail>
</template>

<script>
import EntityDetail from '../components/EntityDetail'
import TraitDetail from '../components/TraitDetail'
export default {
  name: 'trait',
  components: {
    EntityDetail,
    TraitDetail
  }
}
</script>
<style scoped>

</style>
