// vuex 的权限模块

import { constantRoutes, asyncRoutes } from '@/router'

// vuex中的 permission模块 用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  routes: constantRoutes // 所有人默认都具有的静态路由
}

const mutations = {
  setRoutes(state, newRoutes) {
    // 下面这么写不对 不是语法不对 是业务不对
    // state.routes = [...state.routes, ...newRoutes]
    // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  filterRoutes({ commit }, menus) {
    const routes = []
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    commit('setRoutes', routes)
    return routes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
