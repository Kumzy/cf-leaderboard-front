import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
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
    path: '/competitions',
    name: 'competitions',
    component: () => import('@/views/Competition/Competitions.vue')
  },
  {
    path: '/competition/:id',
    name: 'competition',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Competition/Competition.vue')
  },
  {
    path: '/competition/:id/competitors',
    name: 'competition_competitors',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Competition/CompetitionCompetitors.vue')
  },
  {
    path: '/competitors',
    name: 'competitors',
    component: () => import('@/views/Competitor/Competitors.vue')
  },
  {
    path: '/competitors/:id',
    name: 'competitor',
    component: () => import('@/views/Competitor/Competitor.vue'),
    props: { editing: true }
  },
  {
    path: '/competitors/add',
    name: 'competitor_add',
    component: () => import('@/views/Competitor/Competitor.vue'),
    props: { editing: false }
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
