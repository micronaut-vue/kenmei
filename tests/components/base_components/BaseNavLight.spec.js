import { RouterLinkStub } from '@vue/test-utils';
import Vuex from 'vuex';

import BaseNavLight from '@/components/base_components/BaseNavLight.vue';

import user from '@/store/modules/user';

const localVue = createLocalVue();

localVue.use(Vuex);

// To avoid missing directive Vue warnings
localVue.directive('loading', true);

describe('BaseNavLight.vue', () => {
  describe('when user is not signed in', () => {
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

      nav = shallowMount(BaseNavLight, {
        store,
        localVue,
        stubs: {
          RouterLink: RouterLinkStub,
        },
      });
    });

    it('renders sign on buttons', () => {
      expect(nav.contains('base-button-stub')).toBeTruthy();
    });

    it('does not render navigation', () => {
      expect(nav.contains('.btn-menu')).toBeFalsy();
      expect(nav.contains('.mobile-link')).toBeFalsy();
      expect(nav.contains('.desktop-link')).toBeFalsy();
    });

    describe('when clicking Sign In ', () => {
      it('opens SignOn modal', async () => {
        nav = mount(BaseNavLight, {
          store,
          localVue,
          stubs: {
            RouterLink: RouterLinkStub,
          },
        });

        expect(nav.vm.$data.activeSignOnComponent).toContain('TheSignIn');
        expect(nav.vm.$data.signOnVisible).toBeFalsy();

        nav.find({ ref: 'signUpButton' }).trigger('click');

        await nextTick();

        expect(nav.vm.$data.activeSignOnComponent).toContain('TheSignUp');
        expect(nav.vm.$data.signOnVisible).toBeTruthy();
      });
    });
  });

  describe('when user is signed in', () => {
    let store;
    let nav;

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          user: {
            namespaced: true,
            state: {
              currentUser: { email: 'user1@example.com' },
            },
            actions: user.actions,
            getters: {
              signedIn: () => true,
            },
          },
        },
      });

      nav = shallowMount(BaseNavLight, {
        store,
        localVue,
        stubs: {
          RouterLink: RouterLinkStub,
        },
      });
    });

    it('does not render signOn modal', () => {
      expect(nav.contains('base-modal-stub')).toBeFalsy();
    });

    describe('lifecycle', () => {
      describe('mounted()', () => {
        it('sets on-click event to hide menus', async () => {
          nav = shallowMount(BaseNavLight, {
            store,
            localVue,
            attachToDocument: true,
            stubs: {
              RouterLink: RouterLinkStub,
            },
            data() {
              return {
                profileVisible: true,
                menuVisible: true,
              };
            },
          });

          const profileDropdown = nav.find('.profile-dropdown');
          const menuDropdown    = nav.find('.menu-dropdown');

          expect(profileDropdown.isVisible()).toBeTruthy();
          expect(menuDropdown.isVisible()).toBeTruthy();

          nav.find('.desktop-links').trigger('click');

          await nextTick();

          expect(profileDropdown.isVisible()).toBeFalsy();
          expect(menuDropdown.isVisible()).toBeFalsy();
        });
      });
    });
  });
});
