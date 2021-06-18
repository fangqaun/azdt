import request from '@/utils/request'

// 获取权限
export function getPermissionList(params) {
  return request({
    method: 'GET',
    url: '/sys/permission',
    params
  })
}

// 新增权限
export function addPermission(data) {
  return request({
    method: 'POST',
    url: '/sys/permission',
    data
  })
}

// 更新权限
export function updatePermission(data) {
  return request({
    method: 'PUT',
    url: `/sys/permission/${data.id}`,
    data
  })
}

// 删除权限
export function delPermission(id) {
  return request({
    method: 'DELETE',
    url: `/sys/permission/${id}`
  })
}

// 获取权限详情
export function getPermissionDetail(id) {
  return request({
    method: 'GET',
    url: `/sys/permission/${id}`
  })
}

