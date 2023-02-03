import router, { constantRoutes, resetRouter } from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          const routes = store.getters.asyncRoutes
          store.commit('user/SET_ASYNC_ROUTES', buildRoutes(routes, null))
          console.log('构造之后', store.getters.asyncRoutes)
          resetRouter()
          const newRoutes = constantRoutes.slice(0)
          newRoutes.splice(-1, 0, ...store.getters.asyncRoutes);
          router.addRoutes(store.getters.asyncRoutes)
          store.commit('user/SET_ASYNC_ROUTES', newRoutes)
          
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error({
            message: error || 'Has Error'
          })
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})


export function buildRoutes(routes, parent) {
  const newRoutes = []
  routes.forEach(route => {
    const newRoute = {}
    Object.assign(newRoute, route)
    if (route.component === 'Layout') {
      newRoute.component = Layout
    } else if (route.component) {
      newRoute.component = (resolve) => require([`./views/${route.component}/index.vue`], resolve)
    }
    if (route.children && route.children.length > 0) {
      buildRoutes(route.children, newRoute)
    }
    newRoutes.push(newRoute)
  })
  if (parent) {
    parent.children = newRoutes
  }
  return newRoutes
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
