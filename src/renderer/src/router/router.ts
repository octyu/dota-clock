import { createRouter, createWebHistory, Router, RouteRecordRaw, RouterOptions } from 'vue-router'

export const clockEventsRoute: RouteRecordRaw = {
  path: '/clock_events',
  name: 'clockEvents',
  component: () => import('@renderer/views/clock/ClockListView.vue')
}

const rootRoute = {
  path: '/',
  name: 'root',
  component: clockEventsRoute.component
}

const routes: RouteRecordRaw[] = [rootRoute, clockEventsRoute]

const options: RouterOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
}

// Router是路由对象类型
const router: Router = createRouter(options)

export default router
