import { shallowMount } from '@vue/test-utils';
import LandingPage from '@/components/TheLandingPage.vue';

describe('LandingPage.vue', () => {
  it('renders the page', () => {
    const landingPage = shallowMount(LandingPage);
    expect(landingPage.element).toMatchSnapshot();
  });
});
