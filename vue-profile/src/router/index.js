import Router from 'vue-router'
import login from '@/pages/login'

// cdn 加载 不再导入
// Vue.use(Router)

export default new Router({

  routes: [{
    path: '/',
    name: 'home',
    redirect: 'chat', // 重定向
    component: () =>
      import('../pages/home'), // 懒加载
    children: [{
      path: '/chat',
      name: 'chat',
      component: () =>
        import('../pages/chat')
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: login
  }
  ]
})
