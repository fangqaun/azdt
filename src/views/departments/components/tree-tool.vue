<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px;width: 100%"
  >
    <el-col>
      <strong>{{ treeNode.name }}</strong>
    </el-col>
    <el-col>
      <el-row type="flex" justify="end">
        <span style="margin-right: 25px">{{ treeNode.manager }}</span>
        <el-dropdown @command="onCommandClicked">
          <span class="el-dropdown-link">
            操作<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
            <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
            <el-dropdown-item
              v-if="!isRoot"
              command="delete"
            >删除子部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { deleteDepartmentById } from '@/api/departments'

export default {
  name: 'TreeTool',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false // 是否是子部门，默认是 false
    }
  },
  data() {
    return {}
  },
  methods: {
    async onCommandClicked(command) {
      // command: add edit delete
      switch (command) {
        case 'delete':
          try {
            await this.$confirm('确认要删除该部门嘛？')
            try {
              await deleteDepartmentById(this.treeNode.id)
              // 通知父组件刷新列表
              this.$emit('delDepart')
              this.$message.success('删除子部门成功')
            } catch (error) {
              // this.$message.warning(error.message)
            }
          } catch (error) {
            this.$message.info('您取消了删除')
          }
          break
        case 'edit':
          this.$emit('editDept', this.treeNode) // 就是你点击每一行的详细信息
          break
        case 'add':
          this.$emit('addDept', this.treeNode)
          break
      }
    }
  }
}
</script>

<style scoped></style>
