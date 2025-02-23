import { createRouter, createWebHistory } from 'vue-router';

// 导入组件
import Home from '@/views/home/home.vue';

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
