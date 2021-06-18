import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css' // 需要手动自行导入 nprogress 的样式文件

const whiteList = ['/login', '/404']

// 前置导航守卫
router.beforeEach(async function(to, from, next) {
  nprogress.start() // 打开进度条效果
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 当没有正常取到 userId 的时候，去触发请求用户信息
      // 最好加上这个判断，只有当没有取到 userId 属性的时候，我们才会请求用户信息
      if (!store.getters.userId) {
        const userInfo = await store.dispatch('user/getUserInfo')
        const routes = await store.dispatch('permission/filterRoutes', userInfo.roles.menus)
        // console.log(routes)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 白名单，就是不需要权限就可以访问的页面
    if (whiteList.includes(to.path)) {
      next() // 直接放行，让他去好了
    } else {
      next('/login') // 就应该直接让他去登录就好了
    }
  }
  nprogress.done() // 关闭进度条的效果
})

// 后置导航守卫
router.afterEach(() => {
  nprogress.done() // 关闭进度条的效果
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // 进度条

// const whiteList = ['/login'] // 白名单

// router.beforeEach(async(to, from, next) => {
//   // 开启进度条展示
//   NProgress.start()

//   // 设置当前页面标题文字
//   document.title = getPageTitle(to.meta.title)

//   // 判断当前用户有没有登录过
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // 如果有token，并且他想去登录页，就让他去首页就好了
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       // 判断当前有没有拿到当前用户信息
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         // 如果存在当前用户信息，就放行
//         next()
//       } else {
//         try {
//           // 尝试着去获取一下当前用户的基本信息
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // 移除 token 并去登录页重新登录
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     // 没有过登录信息的
//     if (whiteList.indexOf(to.path) !== -1) {
//       // 如果请求跳进的那个页面在白名单内，就放行
//       next()
//     } else {
//       // 其他页面没有权限的话，就让他跳转到登录页
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // 把进度条动画关闭
//   NProgress.done()
// })
