import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import TheSignIn from '@/components/TheSignIn.vue';

import user from '@/store/modules/user';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('TheSignIn.vue', () => {
  describe(':props', () => {
    let signIn;
    let store;

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          user: {
            namespaced: true,
            state: user.state,
            actions: user.actions,
            getters: user.getters,
          },
        },
      });

      signIn = mount(TheSignIn, {
        store,
        localVue,
      });
    });

    it.skip('delegates to store to sign in user if form is valid', async () => {
      signIn.setData({ email: 'text@example.com', password: 'password' });

      signIn.find({ ref: 'signInSubmit' }).trigger('click');
    });

    it('shows validation errors if form is invalid', () => {
      signIn.find({ ref: 'signInSubmit' }).trigger('click');

      expect(signIn.text()).toContain("Password can't be blank");
    });
  });
});
