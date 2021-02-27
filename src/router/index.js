import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/competition',
    name: 'Competition',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Competition.vue')
  },
  {
    path: '/competitors',
    name: 'Competitors',
    component: () => import('@/views/Competitors.vue')
  },
  {
    path: '/competitors/:id',
    name: 'competitor',
    component: () => import('@/views/Competitor/Competitor.vue'),
  },
  {
    path: '/competitors/add',
    name: 'competitor',
    component: () => import('@/views/Competitor/Competitor.vue'),
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
