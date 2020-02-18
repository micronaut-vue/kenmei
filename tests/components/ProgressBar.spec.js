import ProgressBar from '@/components/ProgressBar.vue';

describe('ProgressBar.vue', () => {
  it('renders progress bar', () => {
    const mangaList = shallowMount(ProgressBar);

    expect(mangaList.html()).toMatchSnapshot();
  });
});
