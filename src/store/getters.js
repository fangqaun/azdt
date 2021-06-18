const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立对 user 模块下面的 token 属性的快捷访问方式
  username: state => state.user.userInfo?.username, // 可选链操作符
  userId: state => state.user.userInfo?.userId,
  staffPhoto: state => state.user.userInfo?.staffPhoto,
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes
}
export default getters
