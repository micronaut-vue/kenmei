import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import user from './modules/user';

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  modules: ['user'],
});

export default new Vuex.Store({
  modules: {
    user,
  },
  plugins: [vuexLocalStorage.plugin],
});
