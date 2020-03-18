import Vuex from 'vuex';

import TheSignIn from '@/components/TheSignIn.vue';

import user from '@/store/modules/user';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('TheSignIn.vue', () => {
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

  describe('@events', () => {
    it('@click - when pressing Forgot your password? link, emits componentChanged with TheResetPassword', () => {
      signIn.find('.el-link:first-of-type').trigger('click');

      expect(signIn.emitted('componentChanged')[0])
        .toEqual(['TheResetPassword']);
    });

    it('@click - when pressing Register link, emits componentChanged with TheSignUp', () => {
      signIn.find('.el-link:last-of-type').trigger('click');

      expect(signIn.emitted('componentChanged')[0]).toEqual(['TheSignUp']);
    });
  });

  describe(':props', () => {
    it.skip('delegates to store to sign in user if form is valid', async () => {
      signIn.setData({ email: 'text@example.com', password: 'password' });

      signIn.find({ ref: 'signInSubmit' }).trigger('click');
    });

    it('shows validation errors if form is invalid', async () => {
      signIn.find({ ref: 'signInSubmit' }).trigger('click');

      await nextTick();

      expect(signIn.text()).toContain("Password can't be blank");
    });
  });
});
