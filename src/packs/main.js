import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import LandingPage from '@/components/TheLandingPage.vue';
import '@/plugins/element.js';
import '@/stylesheets/global.scss';
import '@/stylesheets/tailwind.css';

Vue.config.productionTip = false;

Vue.use(VueAnalytics, {
  id: 'UA-145065333-1',
});

new Vue({
  render: h => h(LandingPage),
}).$mount('#app');
