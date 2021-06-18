// 自定义指令

export const imagerror = {
  inserted(el, { value }) {
    // el 就是这个指令未来作用的那个 dom 元素

    el.src = el.src || value

    el.onerror = function() { // 就是监听了当前 图片资源加载失败的时候会执行的回调函数
      el.src = value
    }
  },
  componentUpdated(el, { value }) {
    el.src = el.src || value
  }
}
