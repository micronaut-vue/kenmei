import Vue from 'vue';
import LandingPage from '@/components/TheLandingPage.vue';
import '@/plugins/element.js';
import '@/stylesheets/global.scss';
import '@/stylesheets/tailwind.css';

Vue.config.productionTip = false;

new Vue({
  render: h => h(LandingPage),
}).$mount('#app');
