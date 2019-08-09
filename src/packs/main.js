import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import { Loading } from 'element-ui';
import Home from '@/views/Home.vue';
import '@/plugins/element.js';
import '@/stylesheets/global.scss';
import '@/stylesheets/tailwind.css';

import router from '@/router';

Vue.config.productionTip = false;

Vue.use(Loading);
Vue.use(VueAnalytics, {
  id: 'UA-145065333-1',
  router,
});

new Vue({
  router,
  render: h => h(Home),
}).$mount('#app');
