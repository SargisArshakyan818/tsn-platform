import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'

const routes = [
    { path: '/login', component: LoginPage },
    { path: '/', component: DashboardPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
