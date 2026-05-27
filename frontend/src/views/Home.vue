<template>
  <v-container fluid class="pa-0">
    <!-- Header hero -->
    <v-img eager :src="require('../assets/spider1.jpg')" height="calc(100vh - 64px)" max-height="calc(100vh - 64px)" contain position="right" class="home-hero">
      <v-container fluid class="home-hero-content d-flex flex-column justify-space-between">
        <v-row class="pt-2 mt-2 pt-xl-8 mt-xl-8 pt-xl-8 mt-xl-16 pl-xl-8 ml-xl-16" no-gutters>
          <v-col cols="auto">
            <v-row><div class="text-h3 text-xl-h2 font-weight-black">Welcome to the</div></v-row>
            <v-row class="py-4"><div class="text-uppercase text-h3 text-xl-h2 primary--text font-weight-black">World Arachnida Trait</div></v-row>
            <v-row justify="end"><div class="text-h3 text-xl-h2 font-weight-black">database</div></v-row>
            <!--<v-row class="mt-4"><div class="text-h6">First centralised online open-access database of phenotypic traits of arachnid species at a global scale</div></v-row>
            <v-row class="mt-2"><div class="text-h6">Freely accessible, curated, and constantly updated archive by assembling published and unpublished data</div></v-row>
            <v-row class="mt-2"><div class="text-h6">It should offer and foster collaboration opportunities and open up new areas of investigation</div></v-row>
            -->
          </v-col>
        </v-row>

        <!-- Order cards -->
        <v-container class="order-cards-container px-0 pb-3 pb-md-6" fluid>
          <v-row class="order-cards-row flex-nowrap flex-md-wrap">
            <v-col v-if="ordersLoading" cols="12" class="text-center py-8">
              <v-progress-circular indeterminate color="primary" size="48" />
            </v-col>
            <template v-else>
              <v-col v-for="order in orders" :key="order.id" cols="5" sm="3" md="2" class="order-card-col pa-2 pa-md-3">
                <v-card :to="`/${order.id.toLowerCase()}`" rounded class="rounded-xl order-card" hover>
                  <v-img :src="`/img/thumb/ohome_${order.id.toLowerCase()}.jpg`" height="84" class="grey lighten-3 order-card-img">
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-icon large color="grey lighten-1">mdi-image</v-icon>
                      </v-row>
                    </template>
                  </v-img>
                  <v-card-title class="justify-center primary--text font-weight-bold text-center order-card-title">
                    {{ order.name }}
                  </v-card-title>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-container>
    </v-img>

    <hr class="primary mx-auto my-16" style="height:3px; border:none;width:75%" />

    <!-- 3 info boxes -->
    <v-container>
      <v-row justify="space-around">
        <v-card rounded class="rounded-xl mb-5" width="380">
          <v-img class="mx-auto my-5" width="159" :src="databaseImg" />
          <v-card-text>
            <v-card rounded class="rounded-xl primary" height="120">
              <v-card-text class="white--text text-center text-subtitle-1 flex-column flex-grow-1">
                First centralised online open-access database of phenotypic traits of arachnid species at a global scale
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
        <v-card rounded class="rounded-xl mb-5" width="380">
          <v-img class="mx-auto my-5" width="158" contain :src="globeImg" />
          <v-card-text>
            <v-card rounded class="rounded-xl primary" height="120">
              <v-card-text class="white--text text-center text-subtitle-1">
                Freely accessible, curated, and constantly updated archive by assembling published and unpublished data
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
        <v-card rounded class="rounded-xl mb-5" width="380">
          <v-img class="mx-auto my-5" width="187" contain :src="handsImg" />
          <v-card-text>
            <v-card rounded class="rounded-xl primary" height="120">
              <v-card-text class="white--text text-center text-subtitle-1">
                It should offer and foster collaboration opportunities and open up new areas of investigation
              </v-card-text>
            </v-card>
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
import databaseImg from '../assets/database.png'
import globeImg from '../assets/globe.png'
import handsImg from '../assets/handsext.png'

export default {
  name: "home",
  components: {},
  data() {
    return {
      databaseImg,
      globeImg,
      handsImg,
      ordersLoading: false,
    };
  },
  computed: {
    orders() {
      return this.$store.state.orders.list;
    },
  },
  methods: {},
  created() {
    this.ordersLoading = true;
    this.$store.dispatch('orders/list', { options: { page: 1, itemsPerPage: 100 } })
      .then(() => { this.ordersLoading = false; });
  },
};
</script>
<style scoped>
.home-hero-content {
  height: 100%;
}

.order-cards-container {
  max-width: 1280px;
}

.order-cards-row {
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
}

.order-card-col {
  flex: 0 0 auto;
}

.order-card {
  overflow: hidden;
}

.order-card-title {
  min-height: 52px;
  padding: 8px 10px;
  font-size: 0.95rem;
  line-height: 1.2rem;
  word-break: normal;
}

@media (min-width: 960px) {
  .order-cards-row {
    justify-content: center;
  }

  .order-card-col {
    flex: 0 0 20%;
    max-width: 20%;
  }

  .order-card-img {
    height: 108px !important;
  }
}

@media (min-width: 1264px) {
  .order-card-img {
    height: 120px !important;
  }
}
</style>