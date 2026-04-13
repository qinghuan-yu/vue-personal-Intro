import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import Identity from '../views/Identity/Index.vue';
import Projects from '../views/Projects/Index.vue';
import Music from '../views/Music/Index.vue';
import Contact from '../views/Contact/Index.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/identity', // 根路径重定向
    children: [
      { path: 'identity', name: 'identity', component: Identity },
      { path: 'projects', name: 'projects', component: Projects },
      { path: 'music', name: 'music', component: Music },
      { path: 'contact', name: 'contact', component: Contact },
    ],
  },
  // 🛡️ 捕获所有未知路径，重回起点
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;