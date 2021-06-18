import request from '@/utils/request'

/**
 * 获取员工的简单列表
 */

export const getEmployeeSimple = () => {
  return request({
    method: 'GET',
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工列表
 */

export const getUserList = params => {
  return request({
    method: 'GET',
    url: '/sys/user',
    params
  })
}

/**
 * 删除员工
 */

export const deleteUserById = id => {
  return request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}

/**
 * 新增员工
 */

export const addEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user',
    data
  })
}

/**
 * 获取员工基本信息
 */

export const getEmployeeDetail = id => {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}

/**
 * 更新员工基本信息
 */

export const updateEmployee = data => {
  return request({
    method: 'PUT',
    url: `/sys/user/${data.id}`,
    data
  })
}

/**
 * 批量导入员工
 */

export const batchEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}

/**
 * 读取用户详情的基础信息
 */
export const getPersonalDetail = id => {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/**
 * 更新用户详情的基础信息
 */
export const updatePersonal = data => {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/**
 * 获取用户的岗位信息
 */
export const getJobDetail = id => {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 */
export const updateJob = data => {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/**
 * 给角色分配权限
 */

export const addPermission = data => {
  return request({
    method: 'PUT',
    url: '/sys/user/assignRoles',
    data
  })
}
