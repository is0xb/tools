import { RouteRecordRaw } from 'vue-router';

// index 路由
const route = (function () {
  const routes: RouteRecordRaw[] = []
  const owner: RouteRecordRaw = {
    component: () => import('@/components/route-view-level-1.vue'),
    children: routes,
    meta: {
      title: 'index page'
    },
    name: 'index',
    path: '/index',
  };

  routes.push({
    component: () => import('../vue/index.vue'),
    meta: {
      title: 'index page',
    },
    name: 'index-index',
    path: 'index'
  });

  return owner;
})();

export default route;
