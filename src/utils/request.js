import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getStamp } from '@/utils/auth'
import router from '@/router'

const timeOut = 3600 // 定义超时时间，单位为：秒

// 是否过期
const isTimeOut = () => {
  // 取当前时间；和之前存储的时间，作比对
  const currentTime = +new Date()
  const oldTime = getStamp()
  return (currentTime - oldTime) / 1000 > timeOut
}

const request = axios.create({
  // process.env 是 node 里面环境变量对象
  baseURL: process.env.VUE_APP_BASE_API, // '/api' baseURL + url = 完整请求的路径
  timeout: 5000
})

// 添加请求拦截器 - 主要处理 token 的统一注入问题
request.interceptors.request.use(config => {
  if (store.getters.token) {
    // 再次判断当前 token 是否有效
    if (isTimeOut()) {
      // 过期了
      // 清除用户信息；清除 token，登录跳转到登录页
      store.dispatch('user/logout')

      router.push('/login')

      return Promise.reject(new Error('token 过期，请重新登陆'))
    }
    // 统一注入 token
    config.headers['Authorization'] = `Bearer ${store.getters.token}` // 固定的结构
  }
  return config
})

// 添加响应拦截器 - 主要处理 数据异常 和 数据结构问题
request.interceptors.response.use(res => {
  // 不管错误还是成功，success 为 true 或者 false 来决定的
  const { success, message, data } = res.data
  if (success) {
    return data // 请求成功的情况下，提前把 data 属性返回
  } else {
    Message.error(message)

    // 返回一个失败态的 promise 实例， 给谁用的？
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})

export default request

// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // 创建了一个 axios 实例
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // 真正请求的地址 = 基础访问路径 + 请求的路径
//   // withCredentials: true, // 允许发送请求的时候可以携带 cookies
//   timeout: 5000 // 请求的超时时间
// })

// // 添加请求拦截
// service.interceptors.request.use(
//   config => {
//     // 真正发请求之前，可以做一些事情（可以统一给所有请求在请求头中携带token）

//     if (store.getters.token) {
//       // 让所有的请求都携带 token
//       // ['X-Token'] 就是一个自定义的请求头
//       // 请按真实的请求，修改它
//       config.headers['Authorization'] = getToken()
//     }
//     return config
//   },
//   error => {
//     console.log(error)
//     return Promise.reject(error)
//   }
// )

// // 响应拦截
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload() // 重新加载了一下
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service
