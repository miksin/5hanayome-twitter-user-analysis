import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/approach',
    name: 'approach',
    component: () => import(/* webpackChunkName: "approach" */ '../views/Approach.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  store.commit('setLoading', { status: true })
  next()
})

router.afterEach((to, from) => {
  const delay = 500
  setTimeout(() => {
    store.commit('setLoading', { status: false })
  }, delay)
})

export default router
