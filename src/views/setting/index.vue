<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="role">
            <el-row class="marginTop20">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>

            <el-table
              v-loading="loading"
              :data="roleList"
              border
              stripe
              class="marginTop20"
            >
              <el-table-column
                type="index"
                label="序号"
                width="120px"
                align="center"
              />
              <el-table-column
                label="角色名称"
                width="200px"
                align="center"
                prop="name"
              />
              <el-table-column label="描述" align="center" prop="description" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="onAssign(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">修改</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-row class="marginTop20" type="flex" justify="center">
              <el-pagination
                :current-page="queryInfo.page"
                :page-size="queryInfo.pagesize"
                layout="prev, pager, next"
                :total="total"
                @current-change="currentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="comany">
            <el-alert
              class="marginTop20"
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />

            <el-form label-width="120px" class="marginTop20">
              <el-form-item label="企业名称：">
                <el-input v-model="companyInfo.name" disabled class="width80" />
              </el-form-item>
              <el-form-item label="公司地址：">
                <el-input
                  v-model="companyInfo.companyAddress"
                  disabled
                  class="width80"
                />
              </el-form-item>
              <el-form-item label="公司电话：">
                <el-input
                  v-model="companyInfo.companyPhone"
                  disabled
                  class="width80"
                />
              </el-form-item>
              <el-form-item label="邮箱：">
                <el-input
                  v-model="companyInfo.mailbox"
                  disabled
                  class="width80"
                />
              </el-form-item>
              <el-form-item label="备注：">
                <el-input
                  v-model="companyInfo.remarks"
                  disabled
                  type="textarea"
                  rows="3"
                  class="width80"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 添加/修改角色的弹窗 v-if 用它的开销会大一些 -->
      <role-dialog ref="roleRef" :show-dialog.sync="showDialog" @update-list="loadRoleList" />

      <!-- 分配权限的弹窗 -->
      <el-dialog title="分配权限" :visible="showAssignDialog" @close="cancel">
        <el-tree
          ref="treeRef"
          :data="list"
          node-key="id"
          show-checkbox
          check-strictly
          :default-checked-keys="defaultKeys"
          :props="{ label: 'name' }"
          default-expand-all
        />
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="cancel">取消</el-button>
            <el-button type="primary" size="small" @click="confirm">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyDetailById,
  deleteRoleById,
  getRoleDetail,
  assignPerm
} from '@/api/setting'
import { mapGetters } from 'vuex'
import RoleDialog from './components/role-dialog'
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'Setting',
  components: {
    RoleDialog
  },
  data() {
    return {
      showDialog: false,
      loading: false,
      activeName: 'role',
      queryInfo: {
        page: 1,
        pagesize: 5
      },
      roleList: [],
      total: 0,
      companyInfo: {},
      showAssignDialog: false,
      list: [],
      defaultKeys: [],
      permId: null
    }
  },
  computed: {
    // 获取子模块里面的 companyId
    // this.$store.getters.companyId
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.loadRoleList()
    this.loadCompanyDetail()
  },
  methods: {
    async editRole(id) {
      await this.$refs.roleRef.loadRoleDetail(id)
      this.showDialog = true
    },
    async loadCompanyDetail() {
      this.companyInfo = await getCompanyDetailById(this.companyId)
    },
    async loadRoleList() {
      this.loading = true
      try {
        const { rows, total } = await getRoleList(this.queryInfo)
        this.roleList = rows
        this.total = total
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    currentChange(page) {
      this.queryInfo.page = page
      this.loadRoleList()
    },
    async deleteRole(id) {
      try {
        await this.$confirm('你确认要删除该角色吗？')
        await deleteRoleById(id)
        this.$message.success('删除角色成功')
        // 当前列表页面，只有一条数据时候
        if (this.roleList.length === 1 && this.queryInfo.page !== 1) {
          this.queryInfo.page--
        }
        this.loadRoleList()
      } catch (error) {
        this.$message.info('您取消了删除')
      }
    },
    async onAssign(id) {
      this.permId = id
      this.list = await tranListToTreeData(await getPermissionList(), '0')
      const { permIds } = await getRoleDetail(id)
      // setTimeout(() => {

      // }, 2000)
      this.defaultKeys = permIds
      this.showAssignDialog = true
    },
    cancel() {
      this.defaultKeys = []
      this.showAssignDialog = false
    },
    async confirm() {
      // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      // console.log(this.$refs.treeRef.getCheckedKeys())
      const input = {
        id: this.permId,
        permIds: this.$refs.treeRef.getCheckedKeys()
      }
      await assignPerm(input)
      this.$message.success('分配权限成功')
      this.showAssignDialog = false
    }
  }
}
</script>

<style>
.marginTop20 {
  margin-top: 20px;
}
.width80 {
  width: 40%;
}
</style>
