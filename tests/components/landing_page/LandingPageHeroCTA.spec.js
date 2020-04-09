import { RouterLinkStub } from '@vue/test-utils';
import Vuex from 'vuex';
import user from '@/store/modules/user';

import LPCTA from '@/components/landing_page/LandingPageCTA.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('LandingPageHeroSection.vue', () => {
  let store;
  let hero;

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

    hero = shallowMount(LPCTA, { store, localVue });
  });

  it('renders component', () => {
    expect(hero.text()).toContain('Ready to dive in?');
  });

  describe('when not signed in', () => {
    it('emits @signOnOpened when not signed in and clicking Get started', () => {
      hero.find('button').trigger('click');

      expect(hero.emitted('signOnOpened')).toBeTruthy();
    });
  });

  describe('when signed in', () => {
    it('makes Get started a link to manga list', () => {
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

      hero = shallowMount(LPCTA, {
        store,
        localVue,
        stubs: {
          RouterLink: RouterLinkStub,
        },
      });

      expect(hero.find('a').exists()).toBeTruthy();
    });
  });
});
