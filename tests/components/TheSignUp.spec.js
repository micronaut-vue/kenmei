import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import axios from 'axios';
import flushPromises from 'flush-promises';
import { Message } from 'element-ui';

import TheSignUp from '@/components/TheSignUp.vue';

import user from '@/store/modules/user';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('TheSignUp.vue', () => {
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

  describe('@events', () => {
    it('@click - when pressing Sign In link, emits componentChanged with TheSignIn', () => {
      signUp.find('.el-link').trigger('click');

      expect(signUp.emitted('componentChanged')[0]).toEqual(['TheSignIn']);
    });
  });
  describe(':data', () => {
    describe(':user - is valid', () => {
      beforeEach(() => {
        signUp.setData({
          user: {
            email: 'text@example.com',
            password: 'password',
            password_confirmation: 'password',
          },
        });
      });

      it.skip('delegates to store to sign in user if form is valid', async () => {
        signUp.find({ ref: 'signUpSubmit' }).trigger('click');
      });

      it('POSTs to registrations endpoint and show confirmation message', async () => {
        const axiosSpy = jest.spyOn(axios, 'post');

        axiosSpy.mockResolvedValue({ status: 200 });

        signUp.vm.signUp();

        await flushPromises();

        expect(axiosSpy).toHaveBeenCalledWith(
          '/api/v1/registrations/',
          { user: signUp.vm.$data.user }
        );
      });
    });

    describe(':user - is invalid', () => {
      it('shows validation errors if form is invalid', () => {
        signUp.find({ ref: 'signUpSubmit' }).trigger('click');

        expect(signUp.text()).toContain("Email can't be blank");
      });

      it('shows server-side errors if request failed', async () => {
        const axiosSpy        = jest.spyOn(axios, 'post');
        const errorMessageSpy = jest.spyOn(Message, 'error');

        const mockResponse = {
          response: {
            data: 'Missing password<br>Missing password confirmation',
          },
        };

        axiosSpy.mockRejectedValue(mockResponse);

        signUp.vm.signUp();

        await flushPromises();

        // TODO: Check that we actually called it with server-side errors
        expect(errorMessageSpy).toBeCalled();
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
