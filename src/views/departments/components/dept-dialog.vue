<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="visible" @close="cancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptRef" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model.trim="formData.name"
          class="width80"
          placeholder="请输入1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model.trim="formData.code"
          class="width80"
          placeholder="请输入1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          class="width80"
          placeholder="请选择"
          @focus="loadEmployees"
        >
          <el-option
            v-for="item in employeeList"
            :key="item.id"
            :value="item.username"
            :label="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          class="width80"
          placeholder="请输入部门介绍，在1-300个字符之间"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirm">确定</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepart, getDepartDetailById, updateDepartById } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  name: 'DeptDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      // 当前自定义规则里面，是可以去请求接口数据
      const { depts } = await getDepartments()
      // 部门名称不能和同级别的重复，我们需要找到所有同级别的数据
      let isRepeat = false
      if (this.formData.id) {
        // 编辑状态下，不能有重复的
        isRepeat = depts
          .filter(dept => dept.id !== this.node.id && dept.pid === this.node.pid)
          .some(item => item.name === value)
      } else {
        // 1.同级别( this.treeNode.id ==> id === pid ), 2.部门名称有没有重复
        isRepeat = depts
          .filter(dept => dept.pid === this.node.id)
          .some(item => item.name === value)
      }
      isRepeat
        ? callback(new Error(`同级别下已经有部门名称为${value}的了`))
        : callback()
    }

    // 这个是检查当前 depts 所有人的 code 和 value，有没有重复的
    // some 就是表示如果有一个条件符合，就返回 true
    // every 表示只有当所有人都符合条件的时候，才返回 true
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // const isRepeat = depts
      //   .some(item => item.code === value && item.code)
      let codes = []
      if (this.formData.id) {
        // 编辑状态, 需要先剔除掉自己，然后再去比对
        codes = depts.filter(item => item.code !== this.formData.code).map(item => item.code)
      } else {
        // 新增状态
        codes = depts.map(item => item.code) // ['code', 'code1', 'code2']
      }

      codes.includes(value)
        ? callback(new Error(`组织架构下已经有部门编码为${value}的了`))
        : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          {
            // 添加自定义校验规则：函数（当前规则，当前值，callback）
            validator: checkNameRepeat,
            trigger: 'blur' // 触发条件，当失去焦点的时候触发
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          {
            validator: checkCodeRepeat,
            trigger: 'blur'
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      },
      employeeList: []
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  // created() {
  //   this.loadEmployees()
  // },
  methods: {
    cancel() {
      this.$refs.deptRef.resetFields() // 重置表单，并移除校验结果
      this.formData = { // 将 formData 重新赋值
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 只有传递属性的时候使用了，sync 这个修饰符之后，this.$emit('update:prop', false)
      this.$emit('update:visible', false) // 更新父组件传递过来的 visible
    },
    async confirm() {
      try {
        await this.$refs.deptRef.validate()
        try {
          if (this.formData.id) {
            await updateDepartById(this.formData.id, this.formData)
            this.$message.success('编辑成功')
          } else {
            // 新增的时候，是需要 pid 属性的
            // this.formData.pid = this.node.id
            await addDepart({ ...this.formData, pid: this.node.id })
            this.$message.success('添加成功')
          }
          // 主动关窗, 会自动帮我们调用弹窗的 close 事件
          this.$emit('update:visible', false)
          this.$emit('addDepts')
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async loadEmployees() {
      const res = await getEmployeeSimple()
      this.employeeList = res
    },
    // 回显操作
    async getDepartDetail(id) {
      // const res = await getDepartDetailById(id)
      // this.formData = { ...this.formData, ...res }
      this.formData = await getDepartDetailById(id)
    }
  }
}
</script>

<style scoped>
.width80 {
  width: 80%;
}
</style>
