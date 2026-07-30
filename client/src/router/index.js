import { defaultsDeep } from 'lodash'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

import { createAuthGuard } from '@unrest/ui'
import sprite from '@/sprite'
import applyMeta from './applyMeta.js'
import views from '@/views'

const routes = []

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
const createHistory = import.meta.env.VITE_OFFLINE ? createWebHashHistory : createWebHistory

const router = createRouter({
  history: createHistory(),
  routes,
})

router.beforeEach(applyMeta)
// hive signs in at the root, not /login: Home.vue is the login screen and
// already returns you to ?next= after Play as Guest. The guard's default
// loginPath of '/login' matches no route here.
router.beforeEach(createAuthGuard({ loginPath: '/' }))
router.beforeEach(() => {
  // refresh any api calls after navigation
})
export default router
