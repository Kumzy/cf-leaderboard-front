import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import getPageTitle from '@/utils/get-page-title' // Get page title

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    name: 'login',
    path: '/login',
    meta: { 
      title: 'Login'
    },
    component: () => import('@/views/Login/Login.vue')
  },
  {
    path: '/competitions',
    name: 'competitions',
    meta: { 
      title: 'Competitions'
    },
    component: () => import('@/views/Competition/Competitions.vue')
  },
  {
    path: '/competition/:id',
    name: 'competition',
    meta: { 
      title: 'Competition'
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/Competition/Competition.vue')
  },
  {
    path: '/competition/:id/competitors',
    name: 'competition_competitors',
    meta: { 
      title: 'Competition competitors'
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/Competition/CompetitionCompetitors.vue')
  },
  {
    path: '/competition/:id/scores',
    name: 'competition_scores',
    meta: { 
      title: 'Competition scores'
    },
    component: () => import('@/views/Competition/CompetitionScores.vue')
  },
  {
    path: '/competition/:id/leaderboard',
    name: 'competition_leaderboard',
    meta: { 
      title: 'Leaderboard'
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/Competition/CompetitionLeaderboard.vue')
  },
  {
    path: '/competitors',
    name: 'competitors',
    meta: { 
      title: 'Competitors'
    },
    component: () => import('@/views/Competitor/Competitors.vue')
  },
  {
    path: '/competitors/:id',
    name: 'competitor',
    meta: { 
      title: 'Competitor profile'
    },
    component: () => import('@/views/Competitor/Competitor.vue'),
    props: { editing: true }
  },
  {
    path: '/competitors/add',
    name: 'competitor_add',
    meta: { 
      title: 'Add a competitor'
    },
    component: () => import('@/views/Competitor/Competitor.vue'),
    props: { editing: false }
  }
  
]

const createRouter = () => new VueRouter({
  mode: 'history',
  //scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes
})

const router = createRouter()


// router.beforeEach(async(to, from, next) => {
router.beforeEach(async(to,from,next) => {
  document.title = getPageTitle(to.meta.title)
  next()
})

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router


// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })

// export default router
