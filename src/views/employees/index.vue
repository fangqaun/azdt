<template>
  <div class="dashboard-container">
    <div v-loading="loading" class="app-container">
      <page-tools>
        <!-- slot-scope 被废除了，用 v-slot 代替 -->
        <!-- v-slot:名称 -->
        <!-- v-slot 可以简写成 # -->
        <template #before>
          <span>共{{ total }}条记录</span>
        </template>
        <template #after>
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import?type=user')"
          >excel导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleExport"
          >excel导出</el-button>
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table :data="userList" border stripe>
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="70"
          />
          <el-table-column
            label="姓名"
            align="center"
            prop="username"
            width="110"
          />
          <el-table-column
            label="头像"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              <img
                v-imagerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 60px; height: 60px;"
                @click="showCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="工号"
            align="center"
            prop="workNumber"
            width="110"
          />
          <el-table-column
            label="聘用形式"
            align="center"
            prop="formOfEmployment"
            width="90"
            :formatter="formatEmploy"
          />
          <el-table-column label="部门" align="center" prop="departmentName" width="150" />
          <el-table-column label="入职时间" align="center" prop="timeOfEntry" width="140">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" align="center">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关; 状态：0为禁用 1为启用 -->
              <el-switch
                active-text="启用"
                inactive-text="禁用"
                :value="row.enableState === 1"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="editEmployee(row.id)">
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployById(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            :page-size="queryInfo.size"
            :current-page="queryInfo.page"
            :total="total"
            layout="prev, pager, next"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 修改/添加员工的弹窗 :show-dialog.sync="showDialog" -->
    <employee-dialog
      ref="employeeRef"
      v-model="showDialog"
      @update-list="loadUserList"
    />

    <!-- 显示头像的二维码弹窗 -->
    <el-dialog title="二维码" :visible="showCodeDialog" @close="showCodeDialog = false">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- 分配角色的弹窗 -->
    <assign-role ref="roleRef" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getUserList, deleteUserById } from '@/api/employees'
import Employee from '@/api/constant/employees'
import employeeDialog from './components/employee-dialog.vue'
import { formatDate } from '@/filters'
import QRcode from 'qrcode'
import AssignRole from './components/assign-role.vue'

export default {
  name: 'Employee',
  components: { employeeDialog, AssignRole },
  data() {
    return {
      userList: [],
      queryInfo: {
        page: 1,
        size: 10
      },
      total: 0,
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: ''
    }
  },
  mounted() {
    this.loadUserList()
  },
  methods: {
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          // 如果是入职时间或者是转正时间
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') { // 聘用形式
            const employee = Employee.hireType.find( // find findIndex filter
              obj => obj.id === item[headers[key]]
            )
            return employee ? employee.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // return data
      // return rows.map(item => {
      //   // item是对象  => 转化成只有值的数组 => 数组值的顺序依赖headers  {username: '张三'  }
      //   // Object.keys(headers)  => ["姓名", "手机号",...]
      //   return Object.keys(headers).map(key => {
      //     return item[headers[key]]
      //   }) // /  得到 ['张三'，’129‘，’dd‘,'dd']
      // })
    },
    handleExport() {
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getUserList({ page: 1, size: this.total })
        const data = this.formatJson(headers, rows)

        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
        // data 需要是一个二维数组：[[ '张三', 100 ], [ '李四', 200 ]]
        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
      })
    },
    async editEmployee(id) {
      // 最好添加 await
      await this.$refs.employeeRef.loadEmployeeDetail(id)
      this.showDialog = true
    },
    async loadUserList() {
      this.loading = true
      const { total, rows } = await getUserList(this.queryInfo)
      this.userList = rows
      this.total = total
      this.loading = false
    },
    pageChange(newPage) {
      this.queryInfo.page = newPage
      this.loadUserList()
    },
    formatEmploy(row, column, cellValue, index) {
      // cellValue 单元格的 value 值
      if (cellValue) {
        // hireType 聘用；解雇：fire
        return Employee.hireType.find(item => item.id === cellValue).value
      }
      // return '未知'
      // 1 -> 正式 2 -> 非正式
      // return cellValue === 1 ? '正式' : (cellValue === 2 ? '非正式' : '未知')
    },
    async deleteEmployById(id) {
      try {
        await this.$confirm('您确定要删除该员工吗？')
        await deleteUserById(id)
        this.$message.success('删除员工成功')
        this.loadUserList()
      } catch (error) {
        console.log(error)
      }
    },
    showCode(url) {
      if (url) {
        this.showCodeDialog = true
        this.$nextTick(() => {
          QRcode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('请正确上传头像先哦~')
      }
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.roleRef.loadUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>
