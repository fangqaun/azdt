<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { batchEmployee } from '@/api/employees'

export default {
  name: '',
  data() {
    return {
      // 获取到当前页面跳转过来携带的参数 xx?type=user -> this.$route.query.type
      //                             xx/id=1 -> this.$route.params.id
      type: this.$route.query.type
    }
  },
  methods: {
    async success({ header, results }) {
      // 如果是导入员工
      // 需要将中文转成英文
      // 需要自己组装成自己想要的数据结构
      // 原先的数据结构：[{ '手机号': 13041139871, '姓名': '高大山' }, { '手机号': 13041139872, '姓名': '高小山' }]
      // 我们想要的数据结构：[ { mobile: 13041139871, username: '高大山' }, { mobile: 13041139872, username: '高小山' } ]
      if (this.type === 'user') {
        // 这个 userRelations 我们是可以维护出来的
        const userRelations = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber'
        }
        // const arr = results.reduce((prev, curr) => {
        //   const obj = {}
        //   Object.keys(curr).forEach(item => {
        //     if (item === '入职日期' || item === '转正日期') {
        //       obj[userRelations[item]] = new Date(this.formatDate(curr[item], '/'))
        //     } else {
        //       obj[userRelations[item]] = curr[item]
        //     }
        //   })
        //   prev.push(obj)
        //   return prev
        // }, [])
        // console.log(arr)
        // 组装数据格式的时候：map (映射)  reduce (重新计算，重新组装数据格式)
        const arr = []
        results.forEach(item => {
          const userInfo = {}
          Object.keys(item).forEach(key => {
            if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
              // 错误的结构：2020-01-04 -> 这种结构是正确的：2020/01/04
              userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样, 才能入库
              return
            }
            userInfo[userRelations[key]] = item[key]
          })
          arr.push(userInfo)
        })
        console.log(arr)
        await batchEmployee(arr)
        this.$message.success('导入员工成功')
        this.$router.back() // 后退一步
        // this.$router.go(-1)
      }
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped lang="less">
</style>
