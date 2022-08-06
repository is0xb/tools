import { createRouter, createWebHistory } from 'vue-router';
import { routes as routeItems } from './routes';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routeItems
});

export const routes = routeItems;

export default router;
