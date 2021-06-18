<template>
  <el-dialog :visible="value" :title="title" width="40%" @close="cancel">
    <el-form
      ref="employeeRef"
      label-width="120px"
      :model="employeeForm"
      :rules="rules"
    >
      <el-form-item label="姓名：" prop="username">
        <el-input
          v-model="employeeForm.username"
          class="width80"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机：" prop="mobile">
        <el-input
          v-model="employeeForm.mobile"
          maxlength="11"
          type="number"
          class="width80"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间：" prop="timeOfEntry">
        <el-date-picker v-model="employeeForm.timeOfEntry" placeholder="请选择入职时间" class="width80" />
      </el-form-item>
      <el-form-item label="聘用形式：" prop="formOfEmployment">
        <el-select v-model="employeeForm.formOfEmployment" class="width80">
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号：" prop="workNumber">
        <el-input
          v-model="employeeForm.workNumber"
          class="width80"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门：" prop="departmentName">
        <el-select
          ref="deptRef"
          v-model="employeeForm.departmentName"
          class="width80"
          @focus="loadDepartments"
        >
          <el-option label="请选择部门" value="" style="height: auto">
            <el-tree
              v-loading="loading"
              highlight-current
              node-key="id"
              :data="treeData"
              :props="treeProps"
              default-expand-all
              @node-click="nodeClick"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转正时间：" prop="correctionTime">
        <el-date-picker v-model="employeeForm.correctionTime" placeholder="请选择转正时间" class="width80" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button size="small" type="primary" @click="confirm">确定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  addEmployee,
  getEmployeeDetail,
  updateEmployee
} from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 导入聘用形式的数据字典
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'EmployeeDialog',
  props: {
    // showDialog: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 需要在 data 里面去声明一下
      treeData: [],
      showTree: false,
      loading: false,
      employeeForm: {
        username: '',
        mobile: '',
        timeOfEntry: '', // 入职时间
        formOfEmployment: '', // 聘用形式
        workNumber: '',
        departmentName: '',
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }],
        correctionTime: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ]
      },
      treeProps: {
        label: 'name'
      }
    }
  },
  computed: {
    title() {
      return this.employeeForm.id ? '编辑员工' : '新增员工'
    }
  },
  methods: {
    cancel() {
      // 关窗的时候，需要把所有的属性全部置成空 ''
      Object.keys(this.employeeForm).forEach(key => {
        this.employeeForm[key] = ''
      })
      this.$refs.employeeRef.resetFields()
      // this.$emit('update:showDialog', false)
      // 默认的属性是：value； 默认事件：input
      this.$emit('input', false)
    },
    async confirm() {
      try {
        await this.$refs.employeeRef.validate()
        if (this.employeeForm.id) {
          await updateEmployee(this.employeeForm)
        } else {
          await addEmployee(this.employeeForm)
        }
        // this.$parent.loadUserList()
        // this.$parent.showDialog = false
        this.$emit('update-list')
        this.$message.success(
          `${this.employeeForm.id ? '编辑员工成功' : '新增员工成功'}`
        )

        this.cancel()
      } catch (error) {
        console.log(error)
      }
    },
    async loadEmployeeDetail(id) {
      // this.employeeForm 做了赋值之后，可能会有很多个数据
      this.employeeForm = await getEmployeeDetail(id)
      if (!this.employeeForm.correctionTime) {
        this.employeeForm.correctionTime = +new Date()
      }
    },
    nodeClick({ name }) {
      // 获取到选中的文本，并给选择器赋值
      this.employeeForm.departmentName = name

      // 当前这个 tree 下拉框应该关闭；select 选择器应该失去焦点
      this.$refs.deptRef.blur()
    },
    async loadDepartments() {
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
.width80 {
  width: 80%;
}

.el-scrollbar {
  .el-scrollbar__view {
    >>> .el-select-dropdown__item {
      padding: 0 !important;
    }
  }
}
</style>
