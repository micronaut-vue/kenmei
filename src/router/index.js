import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
import store from '@/store/index';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: () => import(/* webpackChunkName: "landing_page" */ '@/views/LandingPage.vue')
    },
    {
      path: '/manga-list',
      name: 'manga-list',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "manga_list" */ '@/views/MangaList.vue'),
      beforeEnter: (to, from, next) => {
        if (store.getters["user/signedIn"]) {
          next();
        } else {
          Message.error('Please sign in first');
          next('/');
        }
      },
    },
    {
      path: '/reset-password/:resetPasswordToken',
      name: 'Reset Password',
      component: () => import(/* webpackChunkName: "sign_in" */ '@/views/ResetPassword.vue'),
      props: true,
      beforeEnter: (to, from, next) => {
        if (store.getters["user/signedIn"]) {
          Message.info('You are already signed in');
          next('/manga-list');
        } else {
          next();
        }
      },
    },
    {
      path: '/confirmation/:confirmationToken',
      name: 'User Confirmation',
      component: () => import(/* webpackChunkName: "user_confirmation" */ '@/views/UserConfirmation.vue'),
      props: true,
      beforeEnter: (to, from, next) => {
        if (store.getters["user/signedIn"]) {
          Message.info("You've already signed in");
          next('/manga-list');
        } else {
          next();
        }
      },
    },
  ]
})
