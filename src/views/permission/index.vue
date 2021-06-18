<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-row type="flex">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="onAddperm(1, '0')"
            >添加权限</el-button>
          </el-row>
        </template>
      </page-tools>

      <el-table :data="list" style="margin-top: 20px;" border row-key="id" default-expand-all>
        <el-table-column label="名称" align="left" prop="name" />
        <el-table-column label="标识" align="center" prop="code" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.type === 1" type="success" size="small" @click="onAddperm(2, row.id)">添加</el-button>
            <el-button type="primary" size="small" @click="editPerm(2, row.id)">编辑</el-button>
            <el-button type="danger" size="small" @click="delPerm(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑的弹窗 -->
    <perm-dialog ref="permRef" :show-dialog.sync="showDialog" :pid="pid" :type="type" @update-list="loadPermissionList" />
  </div>
</template>

<script>
import { getPermissionList, delPermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
import PermDialog from './components/perm-dialog'

export default {
  name: 'Permission',
  components: {
    PermDialog
  },
  data() {
    return {
      list: [],
      showDialog: false,
      type: '',
      pid: ''
    }
  },
  created() {
    this.loadPermissionList()
  },
  methods: {
    async loadPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    onAddperm(type, pid) {
      debugger
      this.type = type
      this.pid = pid
      // 当type为1时为访问权限，type为2时为功能权限
      this.showDialog = true
    },
    async editPerm(type, id) {
      this.type = type
      this.pid = '0'
      await this.$refs.permRef.loadPermissionDetail(id)
      this.showDialog = true
    },
    async delPerm(id) {
      try {
        await this.$confirm('您确定要删除该权限吗？')
        await delPermission(id)
        this.$message.success('删除权限成功')
        this.loadPermissionList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>
