<template>
  <v-container fluid>
    <!-- Header -->
    <v-container class="text-center py-16">
      <v-row justify="center" class="mb-6">
        <v-col cols="12" md="8">
          <div class="text-h3 text-xl-h2 font-weight-black">Welcome to the</div>
          <div class="text-h2 text-xl-h1 primary--text font-weight-black text-uppercase my-2">World Arachnida Trait</div>
          <div class="text-h3 text-xl-h2 font-weight-black mb-8">database</div>
          <div class="text-h6 mb-3">First centralised online open-access database of phenotypic traits of arachnid species at a global scale</div>
          <div class="text-h6 mb-3">Freely accessible, curated, and constantly updated archive by assembling published and unpublished data</div>
          <div class="text-h6">It should offer and foster collaboration opportunities and open up new areas of investigation</div>
        </v-col>
      </v-row>
    </v-container>

    <hr class="primary mx-auto mb-10" style="height:3px; border:none;width:75%" />

    <!-- Order cards -->
    <v-container>
      <v-row justify="center">
        <v-col v-if="ordersLoading" cols="12" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="48" />
        </v-col>
        <template v-else>
          <v-col v-for="order in orders" :key="order.id" cols="6" sm="4" md="3" lg="2" class="pa-2">
            <v-card :to="`/${order.id.toLowerCase()}`" rounded class="rounded-xl" hover>
              <v-img :src="`/img/orders/${order.id.toLowerCase()}.jpg`" height="120" class="grey lighten-3">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-icon large color="grey lighten-1">mdi-image</v-icon>
                  </v-row>
                </template>
              </v-img>
              <v-card-title class="justify-center text-subtitle-1 primary--text font-weight-bold text-center" style="word-break: normal;">
                {{ order.name }}
              </v-card-title>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>

    <hr class="primary mx-auto my-16" style="height:3px; border:none;width:75%" />

    <!-- 3 info boxes -->
    <v-container>
      <v-row justify="space-around">
        <v-card rounded class="rounded-xl mb-5" width="380">
          <v-img class="mx-auto my-5" width="159" :src="require('../assets/database.png')" />
          <v-card-text>
            <v-card rounded class="rounded-xl primary" height="120">
              <v-card-text class="white--text text-center text-subtitle-1 flex-column flex-grow-1">
                First centralised online open-access database of phenotypic traits of arachnid species at a global scale
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
        <v-card rounded class="rounded-xl mb-5" width="380">
          <v-img class="mx-auto my-5" width="158" contain :src="require('../assets/globe.png')" />
          <v-card-text>
            <v-card rounded class="rounded-xl primary" height="120">
              <v-card-text class="white--text text-center text-subtitle-1">
                Freely accessible, curated, and constantly updated archive by assembling published and unpublished data
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
        <v-card rounded class="rounded-xl mb-5" width="380">
          <v-img class="mx-auto my-5" width="187" contain :src="require('../assets/handsext.png')" />
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
export default {
  name: "home",
  components: {},
  data() {
    return {
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
</style>