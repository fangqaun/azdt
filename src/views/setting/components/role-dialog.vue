<template>
  <el-dialog :visible="showDialog" :title="title" @close="close">
    <el-form ref="roleRef" label-width="120px" :model="roleForm" :rules="rules">
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model="roleForm.name" size="medium" maxlength="10" />
      </el-form-item>
      <el-form-item label="角色描述：" prop="description">
        <el-input v-model="roleForm.description" size="medium" maxlength="10" />
      </el-form-item>
    </el-form>

    <el-row slot="footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="confirm">确认</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, getRoleDetail, updateRole } from '@/api/setting'

export default {
  name: 'RoleDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    close() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleRef.resetFields()
      this.$emit('update:show-dialog', false)
    },
    async loadRoleDetail(id) {
      this.roleForm = await getRoleDetail(id) // 10
      this.loading = false
    },
    async confirm() {
      try {
        await this.$refs.roleRef.validate()
        if (this.roleForm.id) {
          // 编辑
          await updateRole(this.roleForm)
        } else {
          // 添加
          await addRole(this.roleForm)
        }
        this.$message.success(`${this.roleForm.id ? '修改角色成功' : '添加角色成功'}`)
        this.close()
        this.$emit('update-list')
      } catch (error) {
        console.log('error')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
