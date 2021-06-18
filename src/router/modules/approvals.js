import Layout from '@/layout'

export default {
  path: '/approvals', // 审批
  name: 'approvals',
  component: Layout, // Layout 是一个外层具有包裹性质的组件
  children: [
    {
      path: '',
      component: () => import('@/views/approvals'),
      meta: {
        title: '审批',
        icon: 'tree-table'
      }
    }
  ]
}
