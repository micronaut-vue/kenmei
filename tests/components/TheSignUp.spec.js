import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import TheSignUp from '@/components/TheSignUp.vue';

import user from '@/store/modules/user';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('TheSignUp.vue', () => {
  describe(':data', () => {
    let signUp;
    let store;

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          user: {
            namespaced: true,
            state: user.state,
            actions: {
              signUp: jest.fn(),
            },
            getters: user.getters,
          },
        },
      });

      signUp = mount(TheSignUp, {
        store,
        localVue,
      });
    });

    describe(':user - is valid', () => {
      beforeEach(() => {
        signUp.setData({
          email: 'text@example.com',
          password: 'password',
          password_confirmation: 'password',
        });
      });

      it.skip('delegates to store to sign in user if form is valid', async () => {
        signUp.find({ ref: 'signUpSubmit' }).trigger('click');
      });
    });

    describe(':user - is invalid', () => {
      it('shows validation errors if form is invalid', () => {
        signUp.find({ ref: 'signUpSubmit' }).trigger('click');

        expect(signUp.text()).toContain("Email can't be blank");
      });

      it('tests that passwords match each other', () => {
        signUp.setData({
          user: {
            email: 'text@example.com',
            password: 'pass',
            password_confirmation: 'passwo',
          },
        });

        signUp.find({ ref: 'signUpSubmit' }).trigger('click');

        expect(signUp.text()).toContain('Passwords do not match');
      });
    });
  });
});
