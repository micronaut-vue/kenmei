import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Rollbar from 'vue-rollbar';
import { Loading } from 'element-ui';
import Home from '@/views/Home.vue';
import '@/plugins/element.js';
import '@/components/_globals.js';
import '@/stylesheets/global.scss';
import '@/stylesheets/tailwind.css';

import router from '@/router/';
import store from '@/store/index';

Vue.config.productionTip = false;

Vue.use(Loading);
Vue.use(VueAnalytics, {
  id: 'UA-145065333-1',
  router,
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production',
  },
  ignoreRoutes: ['User Confirmation', 'Reset Password']
});
Vue.use(Rollbar, {
  accessToken: process.env.ROLLBAR_CLIENT_TOKEN,
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
  },
});

Vue.config.errorHandler = (err, _vm, _info) => { Vue.rollbar.error(err); };

new Vue({
  router,
  store,
  render: h => h(Home),
}).$mount('#app');
