import { shallowMount } from '@vue/test-utils';
import TheSignOnTabs from '@/components/TheSignOnTabs.vue';

describe('TheSignOnTabs.vue', () => {
  it('renders progress bar', () => {
    const signOnTabs = shallowMount(TheSignOnTabs);

    expect(signOnTabs.html()).toMatchSnapshot();
  });
});
