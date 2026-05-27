<template>
  <div class="hero-wrapper">
    <!-- Order images go to public/img/ (e.g. /img/ohome_araneae.jpg) -->
    <!-- hero-img-container holds the mask; hero-bg holds the shift (transform) -->
    <div class="hero-img-container">
      <div class="hero-bg" :style="{ backgroundImage: `url('/img/ohome_${order.toLowerCase()}.jpg')` }"></div>
    </div>
    <!-- bottom fade overlay (sits above image, below text) -->
    <div class="hero-fade-bottom"></div>
    <div class="hero-content">
      <v-container fill-height>
        <v-row class="pt-2 mt-2 pt-xl-8 mt-xl-8 pt-xl-8 mt-xl-16 pl-xl-8 ml-xl-16">
          <v-col cols="auto" class="hero-title">
            <v-row><div class="text-h3 text-xl-h2 font-weight-black">Welcome to the</div></v-row>
            <v-row class="py-4"><div class="text-uppercase text-h3 text-xl-h2 primary--text font-weight-black">world {{ orderDisplayName }} trait</div></v-row>
            <v-row justify="end"><div class="text-h3 text-xl-h2 font-weight-black">database</div></v-row>
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
    </div>
  </div>
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
.hero-wrapper {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
/* Mask layer: fades image on the left — starts at 25% to match image boundary after translateX(25%) */
.hero-img-container {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  -webkit-mask-image: linear-gradient(to right, transparent 32%, white 65%);
  mask-image: linear-gradient(to right, transparent 32%, white 65%);
}
/* Image layer: shifted 25% right so the subject (center of photo) clears the fade zone */
.hero-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-size: contain;
  background-position: right center;
  background-repeat: no-repeat;
  /* transform: translateX(30%) translateY(-10%); */
}
/* Bottom fade overlay */
.hero-fade-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 45%;
  background: linear-gradient(to top, white 25%, transparent 100%);
  pointer-events: none;
  z-index: 1;
}
/* Text content sits above everything */
.hero-content {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 2;
}
/* White glow on title text — keeps black/colored text readable over dark photo areas */
.hero-title div {
  text-shadow:
    0 0 10px rgba(255, 255, 255, 1),
    0 0 25px rgba(255, 255, 255, 0.85),
    0 0 50px rgba(255, 255, 255, 0.5);
}
</style>
