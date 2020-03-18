import Vuex from 'vuex';
import axios from 'axios';
import flushPromises from 'flush-promises';

import ResetPassword from '@/views/ResetPassword.vue';

import user from '@/store/modules/user';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('ResetPassword.vue', () => {
  let resetPassword;
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

    resetPassword = shallowMount(ResetPassword, {
      store,
      localVue,
      propsData: {
        resetPasswordToken: 'token',
      },
    });
  });

  describe('when visiting the page', () => {
    it('shows token is validating message if validating token', async () => {
      expect(resetPassword.text()).toContain('Checking token validity');
    });

    it('shows reset password form if token is valid', async () => {
      const axiosSpy = jest.spyOn(axios, 'get');

      axiosSpy.mockResolvedValue({ status: 200 });

      resetPassword = shallowMount(ResetPassword, {
        store,
        localVue,
        propsData: {
          resetPasswordToken: 'token',
        },
      });

      await flushPromises();

      expect(resetPassword.text()).toContain('Reset Password');
    });

    describe('when token is invalid', () => {
      let axiosSpy;

      beforeEach(() => {
        axiosSpy = jest.spyOn(axios, 'get');
      });

      it('shows token not valid validation error', async () => {
        const error = 'Token not found, please reset your password again';

        axiosSpy.mockRejectedValue(
          { response: { data: { error: 'Token not found' } } }
        );

        resetPassword = shallowMount(ResetPassword, {
          store,
          localVue,
          propsData: {
            resetPasswordToken: 'token',
          },
        });

        await flushPromises();

        expect(resetPassword.text()).toContain(error);
      });

      it('shows token has expired validation error', async () => {
        const error = 'Token has expired, please reset your password again';

        axiosSpy.mockRejectedValue(
          { response: { data: { error: 'Token has expired' } } }
        );

        resetPassword = shallowMount(ResetPassword, {
          store,
          localVue,
          propsData: {
            resetPasswordToken: 'token',
          },
        });

        await flushPromises();

        expect(resetPassword.text()).toContain(error);
      });

      it('shows generic validation error', async () => {
        const error = 'Something went wrong, try again later or contact hi@kenmei.co';

        axiosSpy.mockRejectedValue(
          { response: { data: { error: 'Unexpected' } } }
        );

        resetPassword = shallowMount(ResetPassword, {
          store,
          localVue,
          propsData: {
            resetPasswordToken: 'token',
          },
        });

        await flushPromises();

        expect(resetPassword.text()).toContain(error);
      });
    });
  });

  describe('when updating the password', () => {
    beforeEach(() => {
      resetPassword = mount(ResetPassword, {
        store,
        localVue,
        propsData: {
          resetPasswordToken: 'token',
        },
      });
    });

    it('tests that passwords match each other', async () => {
      resetPassword.setData({
        tokenValid: true,
        user: {
          password: 'pass',
          password_confirmation: 'passwo',
        },
      });

      await nextTick();

      resetPassword.find({ ref: 'resetPasswordSubmit' }).trigger('click');

      await nextTick();

      expect(resetPassword.text()).toContain('Passwords do not match');
    });

    it.skip('delegates to user module updatePassword action', async () => {
      const userSpy = jest.spyOn(user, 'updatePassword');

      userSpy.mockResolvedValue({ status: 200 });

      resetPassword.vm.submitNewPassword();

      await flushPromises();

      expect(userSpy).toHaveBeenCalledWith(
        '/auth/passwords',
        { email: 'test@example.com' }
      );
    });
  });
});
