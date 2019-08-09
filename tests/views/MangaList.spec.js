import { shallowMount, createLocalVue } from '@vue/test-utils';
import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import MangaList from '@/views/MangaList.vue';
import * as api from '@/services/api';

const localVue = createLocalVue();

// To avoid missing directive Vue warnings
localVue.directive('loading', true);

describe('MangaList.vue', () => {
  describe('when adding new MangaDex entry', () => {
    let mangaList;

    beforeEach(() => {
      mangaList = shallowMount(MangaList, { localVue });

      mangaList.setData({ mangaURL: 'some_url.example/123' });
      mangaList.find({ ref: 'openAddMangaModalButton' }).trigger('click');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('adds new Manga entry on successful API lookup', async () => {
      const getMangaMock = jest.spyOn(api, 'getManga');
      const responseValue = {
        series: {
          title: 'Manga Title',
          url: 'series.example.url',
        },
        latestChapter: {
          url: 'chapter.example.url',
          info: {
            chapter: '10',
            title: 'Chapter Title',
            timestamp: 1522299049,
          },
        },
      };
      getMangaMock.mockImplementation(() => Promise.resolve(responseValue));

      expect(mangaList.vm.$data.tableData).not.toContain(responseValue);

      mangaList.vm.mangaDexSearch();

      await flushPromises();

      expect(mangaList.vm.$data.tableData).toContain(responseValue);
    });

    it.skip('shows Manga not found message if API returns nothing', async () => {
      const infoMessageMock = jest.spyOn(Message, 'info');
      const getMangaMock    = jest.spyOn(api, 'getManga');

      getMangaMock.mockImplementation(() => Promise.resolve({}));

      mangaList.vm.mangaDexSearch();

      await flushPromises();
      expect(infoMessageMock).toHaveBeenCalledWith('Manga was not found');
    });

    it.skip('shows URL is incorrect message if response is 400', async () => {
      const infoMessageMock = jest.spyOn(Message, 'info');
      const getMangaMock    = jest.spyOn(api, 'getManga');

      getMangaMock.mockImplementation(() => Promise.resolve({}));

      mangaList.vm.mangaDexSearch();

      await flushPromises();
      expect(infoMessageMock).toHaveBeenCalledWith('URL is incorrect');
    });

    it.skip('shows error message on unsuccessful API lookup', async () => {
      const errorMessageMock = jest.spyOn(Message, 'error');
      const getMangaMock    = jest.spyOn(api, 'getManga');

      getMangaMock.mockImplementation(() => Promise.resolve());

      mangaList.vm.mangaDexSearch();

      await flushPromises();

      expect(errorMessageMock).toHaveBeenCalledWith('Something went wrong');
    });
  });
});
