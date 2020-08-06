import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/contribute',
    name: 'contribute',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "policy" */ '../views/Policy.vue')
  },
  {
    path: '/publications',
    name: 'publications',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "publications" */ '../views/Publications.vue')
  },
  {
    path: '/data',
    name: 'data',
    component: () => import(/* webpackChunkName: "data" */ '../views/Data.vue')
  },
  {
    path: '/data/:entity/:id',
    name: 'dataQucikFilter',
    component: () => import(/* webpackChunkName: "data" */ '../views/Data.vue')
  },
  {
    path: '/data/family/:family/genus/:genus/species/:species/original-name/:origname/trait-category/:traitcategory/trait/:trait/method/:method/location/:location/country/:country/dataset/:dataset/authors/:authors/reference/:reference/row-link/:rowlink',
    name: 'dataFullFilter',
    component: () => import(/* webpackChunkName: "data" */ '../views/Data.vue')
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
    path: '/traits',
    name: 'traits',
    component: () => import(/* webpackChunkName: "traits" */ '../views/Traits.vue')
  },
  {
    path: '/methods',
    name: 'methods',
    component: () => import(/* webpackChunkName: "methods" */ '../views/Methods.vue')
  },
  {
    path: '/taxonomy',
    name: 'taxonomy',
    component: () => import(/* webpackChunkName: "taxonomy" */ '../views/Taxonomy.vue')
  },
  {
    path: '/locations',
    name: 'locations',
    component: () => import(/* webpackChunkName: "locations" */ '../views/Locations.vue')
  },
  {
    path: '/references',
    name: 'references',
    component: () => import(/* webpackChunkName: "references" */ '../views/References.vue')
  },
  {
    path: '/datasets',
    name: 'datasets',
    component: () => import(/* webpackChunkName: "datasets" */ '../views/Datasets.vue')
  },
  {
    path: '/traits/:id',
    name: 'trait',
    component: () => import(/* webpackChunkName: "trait" */ '../views/Trait.vue')
  },
  {
    path: '/methods/:id',
    name: 'method',
    component: () => import(/* webpackChunkName: "method" */ '../views/Method.vue')
  },
  {
    path: '/taxonomy/:id',
    name: 'taxon',
    component: () => import(/* webpackChunkName: "taxon" */ '../views/Taxon.vue')
  },
  {
    path: '/taxonomy/lsid/:lsid',
    name: 'lsid',
    component: () => import(/* webpackChunkName: "taxon" */ '../views/Taxon.vue')
  },
  {
    path: '/locations/:id',
    name: 'location',
    component: () => import(/* webpackChunkName: "location" */ '../views/Location.vue')
  },
  {
    path: '/references/:id',
    name: 'reference',
    component: () => import(/* webpackChunkName: "reference" */ '../views/Reference.vue')
  },
  {
    path: '/datasets/:id',
    name: 'dataset',
    component: () => import(/* webpackChunkName: "dataset" */ '../views/Dataset.vue')
  }


]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
