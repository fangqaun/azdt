<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="cancel">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">
        {{ role.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { addPermission } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: true
    },
    userId: {
      type: [Number, String],
      default: null
    //   required: true
    }
  },
  data() {
    return {
      checkList: [],
      roleList: [],
      roleIds: []
    }
  },
  created() {
    this.loadRoleList()
  },
  methods: {
    async loadRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.roleList = rows
    },
    async loadUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    cancel() {
      // 此处，不需要重置 this.roleIds
      this.$emit('update:show-role-dialog', false)
    },
    async btnOK() {
      try {
        await addPermission({ id: this.userId, roleIds: this.roleIds })
        this.$message.success('分配角色成功')
        this.cancel()
      } catch (error) {
        // this.$message.error(error.message)
      }
    }
  }
}
</script>

<style scoped>

</style>
