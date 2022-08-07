
import { RouteRecordRaw } from 'vue-router';

/**
 * 通过import.meta.glob导入的路由文件数据结构
 */
interface globEagerResult {
  [k: string]: {
    default: RouteRecordRaw
  }
}

export const routes: Array<RouteRecordRaw> = []

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const modules: globEagerResult = import.meta.glob('../pages/*/config/route.*', {
  eager: true
});

const invalidFileKey: string[] = Object.keys(modules).filter(key => {
  return !(/.+\/route\.(js|ts)/.test(key))
})
invalidFileKey.forEach(k => {
  delete modules[k]
})

// glob 导入
// 参考 https://cn.vitejs.dev/guide/features.html#glob-import
for (const path in modules) {
  routes.push(modules[path].default);
}

routes.push({ redirect: { name: 'index-index' }, path: '/' });
routes.push({ path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/index/vue/index.vue') });

routes.push({
  component: () => import('../views/json-to-table.vue'),
  name: 'json-to-table',
  path: '/json-to-table'
});
routes.push({
  component: () => import('../views/time-data-chart.vue'),
  name: 'time-data-chart',
  path: '/time-data-chart'
});
routes.push({
  component: () => import('../views/hex-ieee754.vue'),
  name: 'hex-ieee754',
  path: '/hex-ieee754'
});

export default routes;
