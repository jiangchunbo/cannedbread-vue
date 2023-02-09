import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '../router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 2000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      const error = new Error(res.message)
      error.code = res.code

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        await MessageBox.confirm('您的会话已经失效了，你可以点击“取消”留在本页面，或者重新登录', '会话失效', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('会话失效 then')
          store.dispatch('user/resetToken').then(() => {
            const path = router.currentRoute.path
            router.push({ path: `/login?redirect=${path}` })
          })
        }).catch(() => {
          console.log(router)
          router.replace(router.currentRouter)
        })
        return Promise.reject(error)
      }
      return Promise.reject(error)
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    let message
    if (error.message.includes('timeout')) {
      message = '网络繁忙，请重试'
    } else {
      message = '网络异常'
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    // return Promise.reject(error)
  }
)

export default service
