<template>
  <v-speed-dial
      v-model="open"
      direction="bottom"
      :open-on-hover="false"
    >
      <template v-slot:activator="{on}">
        <!--
        <slot name="activator" v-if="customActivator" :on="on"/>
        -->
        <v-btn
          v-model="open"
          icon
          small
        >
          <v-icon v-if="open">mdi-close</v-icon>
          <v-icon v-else>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <slot>
      </slot>
    </v-speed-dial>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ActionMenu',
  components: {
  },
  props: {
    customActivator: Boolean
  },
  data () {
    return {
      open: false
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
