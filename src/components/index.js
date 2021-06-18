import PageTool from './PageTool'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'

// 在这里可以将我们自己写的插件，进行统一注册
export default {
  // install 的第一个参数就是 Vue 构造函数
  install(Vue) {
    Vue.component('page-tools', PageTool)
    Vue.component('upload-excel', UploadExcel)
    Vue.component('image-upload', ImageUpload) //注册图片上传组件
  }
}
