<template>
  <el-dialog title="新增权限" :visible="showDialog" @close="cancel">
    <el-form ref="permRef" :model="formData" :rules="rules" label-width="110px">
      <el-form-item label="权限名称：" prop="name">
        <el-input v-model="formData.name" placeholder="请输入权限名称" />
      </el-form-item>
      <el-form-item label="权限标识：" prop="code">
        <el-input v-model="formData.code" placeholder="请输入权限标识" />
      </el-form-item>
      <el-form-item label="权限描述：">
        <el-input v-model="formData.description" placeholder="请输入权限描述" />
      </el-form-item>
      <el-form-item label="企业可见：">
        <el-switch
          v-model="formData.enVisible"
          inactive-value="0"
          active-value="1"
          active-text="开"
          inactive-text="关"
        />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-button type="info" size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import {
  addPermission,
  updatePermission,
  getPermissionDetail
} from '@/api/permisson'

export default {
  name: 'PermDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    type: {
      type: [String, Number],
      default: ''
    },
    pid: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async btnOK() {
      try {
        await this.$refs.permRef.validate()
        if (this.formData.id) {
          // 编辑
          await updatePermission({ ...this.formData, type: this.type, pid: this.pid })
        } else {
          // 添加
          await addPermission({ ...this.formData, type: this.type, pid: this.pid })
        }
        this.$message.success('操作成功')
        this.$emit('update:show-dialog', false)
        this.$emit('update-list')
      } catch (error) {
        console.log(error)
      }
    },
    async loadPermissionDetail(id) {
      this.formData = await getPermissionDetail(id)
    },
    cancel() {
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = ''
      })
      this.$emit('update:show-dialog', false)
    }
  }
}
</script>

<style scoped></style>
