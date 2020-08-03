<template>
  <v-container>
    <h1 class="text-h2 text-center font-weight-bold pt-16 pb-10">Publications</h1>
    <hr class="primary mx-auto" style="height:3px; border:none;width:80%" />
    <v-row class="about-text text-xl-h5 text-subtitle-1 justify-center">
      <v-col cols="8">
      <p class="mt-5">List of publications that used data from WST database:</p>
      <vue-markdown :source="publications"></vue-markdown>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'publications',
  components: {
    VueMarkdown
  },
  props: [],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['publications'])
  },
  watch: {

  },
  methods: {

  },
  created () {

  },
  mounted () {
    this.$store.dispatch('getPublications');
  }
}
</script>
<style scoped>
  .about-text {
    line-height: 2.5rem;
    color: #646464;
  }

  .about-text li {
    list-style: disc outside url("../assets/bullet.png");
    padding-left: 2rem;
  }
</style>