import { RouterLinkStub } from '@vue/test-utils';
import Vuex from 'vuex';
import user from '@/store/modules/user';

import LPHero from '@/components/landing_page/LandingPageHeroSection.vue';
import Nav from '@/components/landing_page/LandingPageNavigation.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

// To avoid missing directive Vue warnings
localVue.directive('loading', true);

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

    hero = shallowMount(LPHero, { store, localVue });
  });

  it('renders component', () => {
    expect(hero.text()).toContain('Start tracking now');
  });

  describe('when not signed in', () => {
    it('emits sign on when clicking Start Tracking', () => {
      hero.find('button').trigger('click');

      expect(hero.emitted('signOnOpened')).toBeTruthy();
    });

    describe('@events', () => {
      it('@signOnOpened - emits signOnOpened with nav event', () => {
        hero.find(Nav).vm.$emit('signOnOpened', 'TheSignIn');

        expect(hero.emitted('signOnOpened')[0]).toEqual(['TheSignIn']);
      });
    });
  });

  describe('when signed in', () => {
    it('makes Start Tracking a link to manga list', () => {
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

      hero = shallowMount(LPHero, {
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
