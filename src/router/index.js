import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import { Message } from 'element-ui'
import Goodslist from '@/components/goodslist'
import Goodsadd from '@/components/goodsadd'
import Goodscate from '@/components/goodscate'
import Goodsparams from '@/components/goodsparams'
import Orders from '@/components/orders'
import Reports from '@/components/reports'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      }, {
        name: 'rights',
        path: '/rights',
        component: Rights
      }, {
        name: 'roles',
        path: '/roles',
        component: Roles
      },{
        name: 'goods',
        path: '/goods',
        component: Goodslist
      },{
        name: 'goodsadd',
        path: '/goodsadd',
        component: Goodsadd
      },{
        name: 'categories',
        path: '/categories',
        component: Goodscate
      },{
        name: 'params',
        path: '/params',
        component: Goodsparams
      },{
        name: 'orders',
        path: '/orders',
        component: Orders
      }, {
        name: 'reports',
        path: '/reports',
        component: Reports
  
      }
      ]

    },
    {
      name: 'login',
      path: '/login',
      component: Login

    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
Message.warning('请先登录')
      router.push({
        name: 'login'
      })
      return;
    }
    next()
  }
})

export default router