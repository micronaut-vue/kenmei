import Vuex from 'vuex';
import axios from 'axios';
import flushPromises from 'flush-promises';

import UserConfirmation from '@/views/UserConfirmation.vue';

import user from '@/store/modules/user';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('UserConfirmation.vue', () => {
  let userConfirmation;
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        user: {
          namespaced: true,
          state: user.state,
          getters: user.getters,
        },
      },
    });

    userConfirmation = shallowMount(UserConfirmation, {
      store,
      localVue,
      propsData: {
        confirmationToken: 'token',
      },
    });
  });

  describe('when visiting the page', () => {
    it('shows token is validating message if validating token', async () => {
      expect(userConfirmation.text()).toContain('Checking token validity');
    });

    describe('when token is invalid', () => {
      let axiosSpy;

      beforeEach(() => {
        axiosSpy = jest.spyOn(axios, 'get');
      });

      it('shows token not valid validation error', async () => {
        axiosSpy.mockRejectedValue(
          { response: { data: { error: 'Token not found' } } }
        );

        userConfirmation = shallowMount(UserConfirmation, {
          store,
          localVue,
          propsData: {
            confirmationToken: 'token',
          },
        });

        await flushPromises();

        expect(userConfirmation.text()).toContain('Token not found');
      });

      it('shows generic validation error', async () => {
        const error = 'Something went wrong, try again later or contact hi@kenmei.co';

        axiosSpy.mockRejectedValue(
          { response: { data: { error: 'Unexpected' } } }
        );

        userConfirmation = shallowMount(UserConfirmation, {
          store,
          localVue,
          propsData: {
            confirmationToken: 'token',
          },
        });

        await flushPromises();

        expect(userConfirmation.text()).toContain(error);
      });
    });
  });
});
