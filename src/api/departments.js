import request from '@/utils/request'

/**
 * 获取组织架构数据
 */
export const getDepartments = () => {
  return request({
    method: 'GET',
    url: '/company/department'
  })
}

/**
 * 删除部门
 */

export const deleteDepartmentById = id => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}

/**
 * 添加部门
 */

export const addDepart = data => {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}

/**
 * 根据ID查询部门详情
 */

export const getDepartDetailById = id => {
  return request({
    method: 'GET',
    url: `/company/department/${id}`
  })
}

/**
 * 更新部门信息
 */
export const updateDepartById = (id, data) => {
  return request({
    method: 'PUT',
    url: `/company/department/${id}`,
    data
  })
}
