<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- <el-row
          type="flex"
          justify="space-between"
          align="middle"
          style="height: 40px;width: 100%"
        >
          <el-col>
            <strong>江苏传智教育技术股份有限公司</strong>
          </el-col>
          <el-col>
            <el-row type="flex" justify="end">
              <span style="margin-right: 25px">负责人</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                  <el-dropdown-item>编辑子部门</el-dropdown-item>
                  <el-dropdown-item>删除子部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-row>
          </el-col>
        </el-row> -->

        <tree-tool :is-root="true" :tree-node="company" @addDept="addDept" />

        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- <el-row
            slot-scope="{ data }"
            type="flex"
            justify="space-between"
            align="middle"
            style="width: 100%"
          >
            <el-col>
              <div>{{ data.name }}</div>
            </el-col>
            <el-col>
              <el-row type="flex" justify="end">
                <span style="margin-right: 25px">{{ data.manager }}</span>
                <el-dropdown>
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                    <el-dropdown-item>编辑子部门</el-dropdown-item>
                    <el-dropdown-item>删除子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-row>
            </el-col>
          </el-row> -->
          <tree-tool
            slot-scope="{ data }"
            :tree-node="data"
            @addDept="addDept"
            @editDept="editDept"
            @delDepart="loadDepartments"
          />
        </el-tree>
      </el-card>
    </div>

    <!-- 新增部门的弹窗; 有可能取不到的时候，延迟一下 -> this.$nextTick(() => { this.$refs.deptRef }) -->
    <dept-dialog ref="deptRef" :visible.sync="visible" :node="node" @addDepts="loadDepartments" />
  </div>
</template>

<script>
import TreeTool from './components/tree-tool'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import DeptDialog from './components/dept-dialog'

export default {
  name: 'Department',
  components: { TreeTool, DeptDialog },
  data() {
    return {
      loading: false,
      company: {},
      defaultProps: {
        label: 'name'
      },
      departs: [],
      visible: false,
      node: {}
    }
  },
  created() {
    this.loadDepartments()
  },
  methods: {
    async editDept(node) {
      // 让子组件执行获取详细信息的操作
      // ref 如果是标识在组件身上的话，那就可以获取到当前这个组件的实例
      // ref 标识在 dom 元素身上，那就可以获取到当前的 dom 元素
      await this.$refs.deptRef.getDepartDetail(node.id)
      this.node = node // 当前你编辑的那条信息
      this.visible = true
    },
    addDept(node) {
      this.visible = true
      this.node = node
    },
    async loadDepartments() {
      this.loading = true
      const { companyName: name, depts } = await getDepartments()
      this.company = { name, manager: '负责人', id: '' }
      // pid 为 '' 的是父节点
      this.departs = tranListToTreeData(depts, '')
      this.loading = false
    }
  }
}
</script>

<style>
.tree-card {
  padding: 10px 100px;
  font-size: 16px;
}
</style>
