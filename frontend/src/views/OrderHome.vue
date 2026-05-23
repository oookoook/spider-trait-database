<template>
  <v-container fluid>
    <!-- Order images go to public/img/orders/{orderName}.jpg (e.g. /img/orders/araneae.jpg) -->
    <v-img eager :src="`/img/orders/${order}.jpg`" height="100vh" max-height="100vh" contain position="right">
      <v-container fill-height>
        <v-row class="pt-2 mt-2 pt-xl-8 mt-xl-8 pt-xl-8 mt-xl-16 pl-xl-8 ml-xl-16">
          <v-col cols="auto">
            <v-row><div class="text-h3 text-xl-h2 font-weight-black">Welcome to the</div></v-row>
            <v-row class="py-4"><div class="text-uppercase text-h3 text-xl-h2 primary--text font-weight-black">{{ orderDisplayName }}</div></v-row>
            <v-row justify="end"><div class="text-h3 text-xl-h2 font-weight-black">trait database</div></v-row>
            <v-row justify="start" class="mt-4">
              <v-btn x-large color="primary" class="mr-5" rounded :to="`/${order}/data`">Explore</v-btn>
              <v-btn x-large color="primary" class="ml-5" rounded outlined to="/contribute">Contribute</v-btn>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="pl-xl-8 ml-xl-16">
          <v-col align-self="end" cols="auto">
            <v-row>
              <p class="mx-xl-auto text-h6 primary--text font-weight-bold">Current content</p>
            </v-row>
            <v-row>
              <template v-for="(item, index) in stats">
                <v-col v-if="item.preposition" :key="`prep${index}`" align-self="center" class="px-0 ml-2 mr-4">
                  <span class="primary--text font-weight-bold">{{ item.preposition }}</span>
                </v-col>
                <v-col :key="`card${index}`" align-self="center" class="pl-0">
                  <v-card width="120" class="rounded-lg">
                    <v-card-text class="text-center text-subtitle-1 black--text font-weight-black my-0 py-3" :style="statsStyle">
                      {{ item.value }}
                    </v-card-text>
                    <v-card-title class="primary white--text text-subtitle-2 my-0 py-2">
                      <div class="flex-grow-1 text-center">{{ item.name }}</div>
                    </v-card-title>
                  </v-card>
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-img>
  </v-container>
</template>

<script>
export default {
  name: 'order-home',
  data() {
    return {
      statsStyle: {
        border: `solid 2px ${this.$vuetify.theme.themes.light.primary}`,
      },
    };
  },
  computed: {
    order() {
      return this.$route.params.order;
    },
    orderDisplayName() {
      const found = this.$store.state.orders.list.find(
        (o) => o.id.toLowerCase() === this.order.toLowerCase()
      );
      return found ? found.name : this.order;
    },
    stats() {
      return [
        { name: 'trait entries', value: this.$store.getters['data/homeStats']('id') },
        { name: 'traits', value: this.$store.getters['data/homeStats']('trait'), preposition: 'of' },
        { name: 'taxa', value: this.$store.getters['data/homeStats']('species'), preposition: 'for' },
        { name: 'datasets', value: this.$store.getters['data/homeStats']('dataset'), preposition: 'from' },
      ];
    },
  },
  methods: {},
  created() {
    this.$store.dispatch('data/homeStats', { entities: ['id', 'trait', 'species', 'dataset'] });
    // Ensure orders are loaded for display name resolution
    if (!this.$store.state.orders.list.length) {
      this.$store.dispatch('orders/list', { options: { page: 1, itemsPerPage: 100 } });
    }
  },
};
</script>
<style scoped>
</style>
