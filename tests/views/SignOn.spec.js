import { shallowMount } from '@vue/test-utils';
import SignOn from '@/views/SignOn.vue';

describe('SignOn.vue', () => {
  it('renders the page', () => {
    expect(shallowMount(SignOn).element).toMatchSnapshot();
  });
});
