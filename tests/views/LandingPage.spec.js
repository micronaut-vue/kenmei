import { shallowMount } from '@vue/test-utils';
import LandingPage from '@/views/LandingPage.vue';

describe('LandingPage.vue', () => {
  it('renders the page', () => {
    const landingPage = shallowMount(LandingPage);
    expect(landingPage.element).toMatchSnapshot();
  });
});
