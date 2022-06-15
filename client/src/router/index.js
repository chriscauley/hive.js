import { defaultsDeep } from 'lodash'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

import sprite from '@/sprite'
import applyMeta from './applyMeta'
import views from '@/views'
import auth from '@unrest/vue-auth'

const routes = [...auth.routes]

const loadViews = (o) =>
  Object.entries(o).forEach(([component_name, Component]) => {
    const route = {
      name: component_name.toLowerCase(),
      path: `/${component_name.toLowerCase()}`,
      component: Component,
    }
    Object.assign(route, Component.__route)
    defaultsDeep(route, { meta: { title: component_name } })
    routes.push(route)
  })

loadViews(views)
loadViews(sprite.views)
const createHistory = process.env.VUE_APP_OFFLINE ? createWebHashHistory : createWebHistory

const router = createRouter({
  history: createHistory(),
  routes,
})

router.beforeEach(applyMeta)
router.beforeEach(auth.checkAuth)
router.beforeEach(() => {
  // refresh any api calls after navigation
})
export default router
