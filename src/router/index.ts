import { createRouter, createWebHistory } from 'vue-router'
import DetailView from '../views/DetailView.vue'
import ListView from '../views/ListView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: ListView,
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: DetailView,
    },
  ],
})

export default router
