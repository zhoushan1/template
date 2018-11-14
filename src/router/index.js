import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  }
]

const router = new Router({
  mode: 'history',
  routes
})

export default router
