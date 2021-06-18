<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width:100%" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      fileList: [
        {
          url:
            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3610495421,999937044&fm=26&gp=0.jpg"
        }
      ],
      showDialog: false,
      imgUrl: ""
    };
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1;
    }
  },
  watch: {},
  methods: {
    preview(file) {
      console.log(file.url);
      this.imgUrl = file.url;
      this.showDialog = true;
    },
    handleRemove(file, fileList) {
      // file是要删除的文件
      // fileList是删除过后的文件
      // console.log(file)
      // console.log(fileList)
      // file是点击删除的文件
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    changeFile(file,fileList){
      // console.log(file)
      // console.log(fileList)
        this.fileList = fileList.map(item => item)
    }
  },
  created() {},
  mounted() {}
};
</script>
<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
