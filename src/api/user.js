import request from '@/utils/request'

/**
 * 登录
 */
export const login = data => {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}

/**
 * 获取用户信息
 * 思考一下，当前这个接口在哪去调用
 */
export const getUserInfo = () => {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

/**
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 */
export const getUserDetailById = id => {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}

/**
 * 保存用户的基本信息
 */

export const updateUser = data => {
  return request({
    method: 'PUT',
    url: `/sys/user/${data.id}`,
    data
  })
}

export const logout = () => {
  return request({

  })
}
