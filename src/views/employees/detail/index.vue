<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="userRef"
              class="user-form"
              :label-position="'right'"
              :model="userInfo"
              :rules="rules"
              label-width="120px"
            >
              <el-form-item label="用户名:" prop="username">
                <el-input v-model="userInfo.username" style="width:450px" />
              </el-form-item>
              <br>
              <el-form-item label="密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  maxlength="9"
                  style="width:450px"
                  type="password"
                />
              </el-form-item>
              <br>
              <el-form-item>
                <el-button type="primary" @click="update">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- <user-info /> -->
            <!-- 渲染一个“元组件”为动态组件。依 is 的值，来决定哪个组件被渲染 -->
            <component :is="userInfoComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- <job-info /> -->
            <component :is="JobInfoComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, updateUser } from '@/api/user'
import UserInfo from '../components/user-info.vue'
import JobInfo from '../components/job-info.vue'

export default {
  name: 'UserInfo',
  components: { UserInfo, JobInfo },
  data() {
    return {
      userInfoComponent: UserInfo, // 需要在data中初始化一下当前要被渲染的组件
      JobInfoComponent: JobInfo,
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        password2: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      },
      userId: this.$route.params.id
    }
  },
  mounted() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      // 获取跳转到当前页面的参数时，使用的是 this.$route.params.id
      const { username } = await getUserDetailById(
        this.$route.params.id
      )
      this.userInfo.username = username // 给用户名进行赋值
    },
    async update() {
      // 更新用户姓名和密码的操作
      try {
        await this.$refs.userRef.validate()
        const { username, password2 } = this.userInfo
        const inputParams = {
          id: this.$route.params.id, // 获取当前地址栏中的 id
          username,
          password: password2 // 这一项，键需要是 password，值：this.userInfo.password2
        }
        await updateUser(inputParams)
        this.$message.success('更新账户信息成功')
        this.loadUserInfo()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.user-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
</style>
