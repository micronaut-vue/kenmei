import { RouterLinkStub } from '@vue/test-utils';
import Vuex from 'vuex';
import user from '@/store/modules/user';

import LPNavigation from '@/components/landing_page/LandingPageNavigation.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

// To avoid missing directive Vue warnings
localVue.directive('loading', true);
localVue.directive('scroll-to', true);

describe('LandingPageNavigation.vue', () => {
  describe('when not signed in', () => {
    let store;
    let nav;

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          user: {
            namespaced: true,
            state: user.state,
            actions: user.actions,
            getters: {
              signedIn: () => false,
            },
          },
        },
      });

      nav = shallowMount(LPNavigation, {
        store,
        localVue,
        stubs: {
          RouterLink: RouterLinkStub,
        },
      });
    });

    it('shows sign on buttons', () => {
      expect(nav.text()).toContain('Log in');
      expect(nav.text()).toContain('Register');
    });

    describe('@events', () => {
      it('@signOnOpened - emits TheSignIn when clicking Sign In', () => {
        nav.find({ ref: 'SignInButton' }).trigger('click');

        expect(nav.emitted('signOnOpened')[0]).toEqual(['TheSignIn']);
      });

      it('@signOnOpened - emits TheSignUp when clicking Register', () => {
        nav.find({ ref: 'SignUpButton' }).trigger('click');

        expect(nav.emitted('signOnOpened')[0]).toEqual(['TheSignUp']);
      });
    });
  });

  describe('when signed in', () => {
    let store;
    let nav;

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          user: {
            namespaced: true,
            state: user.state,
            actions: user.actions,
            getters: {
              signedIn: () => true,
            },
          },
        },
      });

      nav = shallowMount(LPNavigation, {
        store,
        localVue,
        stubs: {
          RouterLink: RouterLinkStub,
        },
      });
    });

    it('shows go to dashboard button', () => {
      expect(nav.text()).toContain('Go to Dashboard');
    });
  });
});
