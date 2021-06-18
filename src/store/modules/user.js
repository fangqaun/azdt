import { getToken, setToken, removeToken, setStamp } from '@/utils/auth'

import { login, getUserInfo, getUserDetailById } from '@/api/user'

import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken(), // 初始化全局状态 token
  userInfo: {}
}

// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token // 设置更新当前 token 状态
    // 缓存到本地
    setToken(token)
    // 第一次正常获取到 token的时候，需要记录一下当前的时间戳
    setStamp()
  },
  removeToken(state) {
    state.token = null // 手动移除全局状态下面的 token
    // 从缓存里面直接移除 token
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo } // 这种操作是具有响应式的
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

// 异步修改状态
const actions = {
  // 封装登录的 action，给组件用的
  async login({ commit }, data) {
    // 直接开启登录操作
    try {
      const token = await login(data)
      // 登录成功的操作，存储 token (result.data.data)
      commit('setToken', token)
      // 登录成功之后，也应该缓存最新的登录时间戳
      setStamp()
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 获取用户信息
  async getUserInfo({ commit }) {
    const result = await getUserInfo() // 获取到用户的名称
    const baseInfo = await getUserDetailById(result.userId) // 获取用户头像的接口
    const baseResult = { ...result, ...baseInfo } // 最简单实现多个对象进行合并
    // const bigInfo = Object.assign({}, result, baseInfo) // 这个方法也要知道
    commit('setUserInfo', baseResult)
    return baseResult
  },
  // 登出
  logout({ commit }) {
    // 清除用户信息
    commit('removeUserInfo')
    // 清除 token 信息
    commit('removeToken')

    // 重置路由表
    resetRouter()
    // 清空权限路由表
    commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true, // 给当前模块加了一把锁 (模块名称/state|mutation|action)
  state,
  mutations,
  actions
}

// vuex + 缓存
// 原始形式获取子模块里面的状态：this.$store.state.user.token
//  user

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router' // 重置路由选项

// // 获取默认 state 的状态
// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState() // { token: '', name: '', avatar: '' }

// const mutations = {
//   // 将状态进行重置的方法
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   // 给 token 进行赋值操作
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   // 设置用户名称操作
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   // 设置头像操作
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // 用户进行登录操作
//   // dispatch('login', { username: 'xx', password: 'xxx'})
//   login({ commit }, userInfo) {
//     // 获取用户进行登录请求的时候传递的用户名和密码
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       // 进行登录请求
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         // 给 token 进行赋值
//         commit('SET_TOKEN', data.token)
//         // 同时，把 token 缓存到 cookie
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // 获取用户信息
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name) // 更新用户 name
//         commit('SET_AVATAR', avatar) // 更新用户 头像
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // 用户登出操作
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // 首先必须删除token
//         resetRouter() // 重置路由
//         commit('RESET_STATE') // 将 state 状态全局清空
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // 重置token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // 首先必须删除token
//       commit('RESET_STATE') // 将 state 状态全局清空
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

