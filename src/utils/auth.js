import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token' // 使用一个唯一的键作为存储 token 的名称
const StampKey = 'hrsaas-ihrm-stamp'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getStamp() {
  return Cookies.get(StampKey)
}

export function setStamp() {
  Cookies.set(StampKey, +new Date())
}
