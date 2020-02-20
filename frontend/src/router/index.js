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
    path: '/terms',
    name: 'terms',
    component: () => import(/* webpackChunkName: "terms" */ '../views/Terms.vue')
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
    path: '/data/family/:family/genus/:genus/species/:species/trait-category/:traitcategory/trait/:trait/country/:country/habitat/:habitat/dataset/:dataset/authors/:authors/reference/:reference/row-link/:rowlink',
    name: 'dataFullFilter',
    component: () => import(/* webpackChunkName: "data" */ '../views/Data.vue')
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import(/* webpackChunkName: "upload" */ '../views/Upload.vue')
  },
  {
    path: '/prepare',
    name: 'prepare',
    component: () => import(/* webpackChunkName: "prepare" */ '../views/Prepare.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "prepare" */ '../views/Admin.vue')
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
  routes
})

export default router
