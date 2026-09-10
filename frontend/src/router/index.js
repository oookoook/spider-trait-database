import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
import { setOrder, resetOrderModules } from '@/store/order-sync'
import Home from '../views/Home.vue'
import OrderHome from '../views/OrderHome.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  // Static top-level routes — must be defined before /:order to take priority
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/contribute',
    name: 'contribute',
    component: () => import(/* webpackChunkName: "contribute" */ '../views/Contribute.vue')
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import(/* webpackChunkName: "terms" */ '../views/About.vue')
  },
  {
    path: '/policy',
    name: 'policy',
    component: () => import(/* webpackChunkName: "policy" */ '../views/Policy.vue')
  },
  {
    path: '/publications',
    name: 'publications',
    component: () => import(/* webpackChunkName: "publications" */ '../views/Publications.vue')
  },
  {
    path: '/import',
    name: 'import',
    component: () => import(/* webpackChunkName: "import" */ '../views/Import.vue')
  },
  {
    path: '/import/new',
    name: 'importNew',
    component: () => import(/* webpackChunkName: "import" */ '../views/Import.vue')
  },
  {
    path: '/approve',
    name: 'approve',
    component: () => import(/* webpackChunkName: "approve" */ '../views/Approve.vue')
  },
  {
    path: '/prepare/:id',
    name: 'prepare',
    component: () => import(/* webpackChunkName: "prepare" */ '../views/Prepare.vue')
  },
  {
    path: '/prepare/transfer/:id',
    name: 'importTransfer',
    component: () => import(/* webpackChunkName: "import" */ '../views/Prepare.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "prepare" */ '../views/Admin.vue')
  },
  {
    path: '/enums',
    name: 'enums',
    component: () => import(/* webpackChunkName: "prepare" */ '../views/Enums.vue')
  },
  {
    path: '/api',
    name: 'api',
    component: () => import(/* webpackChunkName: "dataset" */ '../views/Api.vue')
  },
  // Order-scoped routes
  {
    path: '/:order',
    name: 'orderHome',
    component: OrderHome
  },
  {
    path: '/data/order/:order',
    name: 'data',
    component: () => import(/* webpackChunkName: "data" */ '../views/Data.vue')
  },
  {
    path: '/data/order/:order/:entity/:id',
    name: 'dataQucikFilter',
    component: () => import(/* webpackChunkName: "data" */ '../views/Data.vue')
  },
  {
    path: '/data/order/:order/family/:family/genus/:genus/species/:species/original-name/:origname/trait-category/:traitcategory/trait/:trait/method/:method/location/:location/country/:country/dataset/:dataset/authors/:authors/reference/:reference/row-link/:rowlink',
    name: 'dataFullFilter',
    component: () => import(/* webpackChunkName: "data" */ '../views/Data.vue')
  },
  {
    path: '/:order/traits',
    name: 'traits',
    component: () => import(/* webpackChunkName: "traits" */ '../views/Traits.vue')
  },
  {
    path: '/:order/methods',
    name: 'methods',
    component: () => import(/* webpackChunkName: "methods" */ '../views/Methods.vue')
  },
  {
    path: '/:order/taxonomy',
    name: 'taxonomy',
    component: () => import(/* webpackChunkName: "taxonomy" */ '../views/Taxonomy.vue')
  },
  {
    path: '/:order/locations',
    name: 'locations',
    component: () => import(/* webpackChunkName: "locations" */ '../views/Locations.vue')
  },
  {
    path: '/:order/references',
    name: 'references',
    component: () => import(/* webpackChunkName: "references" */ '../views/References.vue')
  },
  {
    path: '/:order/datasets',
    name: 'datasets',
    component: () => import(/* webpackChunkName: "datasets" */ '../views/Datasets.vue')
  },
  {
    path: '/:order/traits/:id',
    name: 'trait',
    component: () => import(/* webpackChunkName: "trait" */ '../views/Trait.vue')
  },
  {
    path: '/:order/methods/:id',
    name: 'method',
    component: () => import(/* webpackChunkName: "method" */ '../views/Method.vue')
  },
  {
    path: '/:order/taxonomy/:id',
    name: 'taxon',
    component: () => import(/* webpackChunkName: "taxon" */ '../views/Taxon.vue')
  },
  {
    path: '/:order/taxonomy/lsid/:lsid',
    name: 'lsid',
    component: () => import(/* webpackChunkName: "taxon" */ '../views/Taxon.vue')
  },
  {
    path: '/:order/locations/:id',
    name: 'location',
    component: () => import(/* webpackChunkName: "location" */ '../views/Location.vue')
  },
  {
    path: '/:order/references/:id',
    name: 'reference',
    component: () => import(/* webpackChunkName: "reference" */ '../views/Reference.vue')
  },
  {
    path: '/:order/datasets/:id',
    name: 'dataset',
    component: () => import(/* webpackChunkName: "dataset" */ '../views/Dataset.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.params.order) {
    if (from.params.order && from.params.order !== to.params.order) {
      resetOrderModules(router.app.$store)
    }
    setOrder(router.app.$store, to.params.order)
  }

  if(!!router.app.$store.getters.user) {
    router.app.$store.dispatch('getUserInfo').then(() => next());
  } else {
    next();
  }
  
  //next();
})

export default router
