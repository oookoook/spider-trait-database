<template>
  <v-container fluid>
    <v-img eager :src="require('../assets/spider1.jpg')" max-height="957" contain position="right">
    <v-container fill-height>
      <v-row  class="pt-2 mt-2 pt-xl-8 mt-xl-8 pt-xl-8 mt-xl-16 pl-xl-8 ml-xl-16">
        <v-col cols="auto">
      <v-row><div class="text-h3 text-xl-h2 font-weight-black">Welcome to the</div></v-row>
      <v-row><div class="text-uppercase text-h3 text-xl-h2 primary--text font-weight-black">World Spider Trait</div></v-row>
      <v-row justify="end"><div class="text-h3 text-h2 font-weight-black">database</div></v-row>
      <v-row justify="start"><v-btn color="primary" class="mr-3" rounded to="/data">Explore</v-btn><v-btn color="primary" class="ml-3" rounded outlined to="/contribute">Contribute</v-btn></v-row>
        </v-col>
      </v-row>
      <v-row class="pl-xl-8 ml-xl-16">
        <v-col align-self="end" cols="auto">
          <v-row>
          <p class="mx-xl-auto text-h6 primary--text font-weight-bold">Current content</p>
          </v-row>
          <v-row>
          <template v-for="(item, index) in stats" >
          <v-col  v-if="item.preposition" :key="`prep${index}`" align-self="center" class="px-0 ml-2 mr-4"> 
          <span class="primary--text font-weight-bold">
            {{ item.preposition }}
          </span>
          </v-col>
          <v-col :key="`card${index}`" align-self="center" class="pl-0">
          <v-card width="120" class="rounded-lg"
          >
            <v-card-text class="text-center text-subtitle-1 black--text font-weight-black my-0 py-3">
            {{ item.value}}
            </v-card-text>
            <v-card-title class="primary white--text text-subtitle-2 my-0 py-2"><div class="flex-grow-1 text-center">{{ item.name }}</div></v-card-title>  
          </v-card>
          </v-col>
          </template>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    </v-img>
    <hr class="primary mx-auto mb-16" style="height:3px; border:none;width:75%" />
    <v-container>
      <v-row justify="space-around">
        <v-card rounded class="rounded-xl" width="380">
          <v-img class="mx-auto my-5" width="159" :src="require('../assets/database.png')" />
          <v-card-text>
          <v-card rounded class="rounded-xl primary" height="150"><v-card-text class="white--text text-center text-subtitle-1 flex-column flex-grow-1">
            First centralised online open-access database of phenotypic traits of spider species
            </v-card-text></v-card>
          </v-card-text>
        </v-card>
        <v-card rounded class="rounded-xl" width="380">
          <v-img class="mx-auto my-5" width="158" contain :src="require('../assets/globe.png')" />
          <v-card-text>
          <v-card rounded class="rounded-xl primary" height="150"><v-card-text class="white--text text-center text-subtitle-1">
            Freely accessible, curated, and constantly updated archive at a global scale by assembling published and unpublished data
          </v-card-text></v-card>
          </v-card-text>
        </v-card>
        <v-card rounded class="rounded-xl" width="380">
          <v-img class="mx-auto my-5" width="187" contain :src="require('../assets/hands.png')" />
          <v-card-text>
          <v-card rounded class="rounded-xl primary" height="150"><v-card-text class="white--text text-center text-subtitle-1">
            It should offer and foster collaboration opportunities and open up new areas of investigation
          </v-card-text></v-card>
          </v-card-text>  
        </v-card>
      </v-row>
      <v-row justify="space-around" class="mt-16">
        <v-col class="d-flex flex-column">
        <v-btn class="mx-auto" x-large fab outlined color="primary" to="/about"><v-icon x-large>mdi-chevron-right</v-icon></v-btn>
        <router-link to="/about" class="mx-auto text-h4 primary--text text-decoration-none">Learn more</router-link>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
  
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
    }
  },
  computed: {
    stats() {
      return [
        { name: 'trait entries', value: this.$store.getters['data/homeStats']('id') },
        { name: 'traits', value: this.$store.getters['data/homeStats']('trait'), preposition: 'of' },
        { name: 'species', value: this.$store.getters['data/homeStats']('species'), preposition: 'for' },
        { name: 'datasets', value: this.$store.getters['data/homeStats']('dataset'), preposition: 'from' }
      ];
    }
  },
  methods: {
  },
  created() {
    this.$store.dispatch('data/homeStats', { entities: ['id', 'trait', 'species', 'dataset']});
  }
};
</script>
<style scoped>

</style>