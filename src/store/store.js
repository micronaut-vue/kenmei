import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import user from './modules/user';
import lists from './modules/lists';

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  modules: ['user'],
});

export default new Vuex.Store({
  modules: {
    user,
    lists,
  },
  plugins: [vuexLocalStorage.plugin],
});
