import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ArticleList from '../views/articles/ArticleList.vue'
import ArticleDetail from '../views/articles/ArticleDetail.vue'
import CaseList from '../views/cases/CaseList.vue'
import CaseDetail from '../views/cases/CaseDetail.vue'
import DesignerList from '../views/designers/DesignerList.vue'
import DesignerDetail from '../views/designers/DesignerDetail.vue'
import Appointment from '../views/appointment/Appointment.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import DesignerDashboard from '../pages/Designer/DesignerDashboard.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/articles', name: 'Articles', component: ArticleList },
  { path: '/articles/:id', name: 'ArticleDetail', component: ArticleDetail },
  { path: '/cases', name: 'Cases', component: CaseList },
  { path: '/cases/:id', name: 'CaseDetail', component: CaseDetail },
  { path: '/designers', name: 'Designers', component: DesignerList },
  { path: '/designers/:id', name: 'DesignerDetail', component: DesignerDetail },
  { path: '/appointment', name: 'Appointment', component: Appointment, meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/designer-dashboard', name: 'DesignerDashboard', component: DesignerDashboard, meta: { requiresAuth: true, roles: ['DESIGNER'] } },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 未登录用户访问首页时跳转到登录页
  if (to.path === '/' && !token) {
    next('/login')
    return
  }
  
  next()
})

export default router