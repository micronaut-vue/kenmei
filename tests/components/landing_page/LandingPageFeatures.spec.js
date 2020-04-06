import LPFeatures from '@/components/landing_page/LandingPageFeatures.vue';

describe('LandingPageFeatures.vue', () => {
  it('renders component', () => {
    expect(shallowMount(LPFeatures).text()).toContain('Manga Control Centre');
  });
});
