import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Rollbar from 'vue-rollbar';
import { Loading } from 'element-ui';
import VueTippy from 'vue-tippy';
import VueScrollTo from 'vue-scrollto';
import VClickOutside from 'v-click-outside';
import Meta from 'vue-meta';
import Home from '@/views/Home.vue';
import '@/plugins/element.js';
import '@/components/_globals.js';
import '@/stylesheets/tailwind.css';
import '@/stylesheets/global.scss';
import '@/stylesheets/transitions.scss';
import 'tippy.js/themes/light.css';

import router from '@/router/';
import store from '@/store/index';

Vue.config.productionTip = false;

Vue.use(VClickOutside);
Vue.use(VueScrollTo);
Vue.use(Meta);
Vue.use(VueTippy, {
  directive: 'tippy',
  animateFill: false,
  animation: 'shift-toward',
  theme: 'light',
});
Vue.use(Loading);
Vue.use(VueAnalytics, {
  id: 'UA-145065333-1',
  router,
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production',
  },
  ignoreRoutes: ['User Confirmation', 'Reset Password'],
});

if (process.env.NODE_ENV === 'production') {
  let person = {};

  if (store.getters['user/signedIn']) {
    person = { id: store.state.user.currentUser.user_id };
  }

  Vue.use(Rollbar, {
    accessToken: '24ea50e0bffd4fa9ad42ed86399fa5b6',
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: true,
    environment: process.env.NODE_ENV,
    payload: {
      client: {
        javascript: {
          code_version: '1.0',
          source_map_enabled: true,
          guess_uncaught_frames: true,
        },
      },
      person,
    },
  });
}

Vue.config.errorHandler = (err, _vm, _info) => { Vue.rollbar.error(err); };

new Vue({
  router,
  store,
  render: (h) => h(Home),
}).$mount('#app');
