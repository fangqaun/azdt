import request from '@/utils/request'

/**
 * 获取所有角色列表
 */

export const getRoleList = params => {
  return request({
    method: 'GET',
    url: '/sys/role',
    params
  })
}

/**
 * 根据id查询企业
 */

export const getCompanyDetailById = id => {
  return request({
    method: 'GET',
    url: `/company/${id}`
  })
}

/**
 * 根据ID删除角色
 */

export const deleteRoleById = id => {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}

/**
 * 添加角色
 */

export const addRole = data => {
  return request({
    method: 'POST',
    url: '/sys/role',
    data
  })
}

/**
 * 根据ID获取角色详情
 */

export const getRoleDetail = id => {
  return request({
    method: 'GET',
    url: `/sys/role/${id}`
  })
}

/**
 * 根据ID更新角色
 */

export const updateRole = data => {
  return request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
}

/**
 * 给角色分配权限
 */

export const assignPerm = data => {
  return request({
    method: 'PUT',
    url: '/sys/role/assignPrem',
    data
  })
}
