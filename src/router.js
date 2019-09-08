import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
import store from '@/store/store';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: () => import(/* webpackChunkName: "landing_page" */ './views/LandingPage.vue')
    },
    {
      path: '/manga-list',
      name: 'manga-list',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "manga_list" */ './views/MangaList.vue'),
      beforeEnter: (to, from, next) => {
        if (store.getters["user/signedIn"]) {
          next();
        } else {
          Message.error('Please sign in first');
          next('/sign-in');
        }
      },
    },
    {
      path: '/sign-in',
      name: 'Sign In',
      component: () => import(/* webpackChunkName: "sign_in" */ './views/SignOn.vue'),
      beforeEnter: (to, from, next) => {
        if (store.getters["user/signedIn"]) {
          Message.info('You are already signed in');
          next('/manga-list');
        } else {
          next();
        }
      },
    },
  ]
})
