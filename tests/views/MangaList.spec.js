import { shallowMount, createLocalVue } from '@vue/test-utils';
import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import MangaList from '@/views/MangaList.vue';
import * as api from '@/services/api';

const localVue = createLocalVue();

// To avoid missing directive Vue warnings
localVue.directive('loading', true);

describe('MangaList.vue', () => {
  describe('when importing MangaDex entries from Trackr.moe JSON', () => {
    let list;
    let responseValue;
    let mangaList;

    beforeEach(() => {
      list = {
        series: {
          reading: {
            manga: [{
              full_title_url: 'https://mangadex.org/manga/24121',
              site_data: {
                site: 'mangadex.org',
              },
            }],
          },
        },
      };
      responseValue = {
        series: {
          title: 'Manga Title',
          url: 'https://mangadex.org/manga/24121',
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
      mangaList = shallowMount(MangaList, { localVue });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('parses manga list from a json file', async () => {
      const file = new File([list], 'list.json', { type: 'application/json' });
      const fileReaderReadTextMock = jest.spyOn(window, 'FileReader');

      fileReaderReadTextMock.mockImplementation(() => ({
        readAsText: jest.fn(),
      }));

      mangaList.vm.processUpload({ file });

      await flushPromises();

      expect(fileReaderReadTextMock).toHaveBeenCalled();
    });

    // TODO: Test this as part of the request, not by itself
    it('slices ids into chunks of ids', () => {
      const ids = Array(21).fill().map((v, i) => i);
      const result = [ids.slice(0, 20).join(' '), ids.slice(20, 21).join(' ')];

      expect(mangaList.vm.sliceIntoBatches(ids)).toEqual(result);
    });

    it('adds new manga entries and updates progress percentage if successful', async () => {
      const getMangaMock = jest.spyOn(api, 'getMangaBulk');

      getMangaMock.mockResolvedValue([responseValue]);

      mangaList.vm.processMangaDexList(list);

      await flushPromises();

      expect(mangaList.vm.$data.tableData).toContain(responseValue);
      expect(mangaList.vm.$data.importProgress).toEqual(100);
    });

    it('shows Something went wrong message if Import failed', async () => {
      const errorMessageMock = jest.spyOn(Message, 'error');
      const getMangaMock     = jest.spyOn(api, 'getMangaBulk');

      getMangaMock.mockRejectedValue();

      mangaList.vm.processMangaDexList(list);

      await flushPromises();

      expect(errorMessageMock).toHaveBeenCalledWith('Something went wrong');
    });

    it('ignores already existing entries', async () => {
      const infoMessageMock = jest.spyOn(Message, 'info');
      const getMangaMock    = jest.spyOn(api, 'getManga');

      mangaList.setData({ tableData: [responseValue] });

      getMangaMock.mockResolvedValue(responseValue);

      mangaList.vm.processMangaDexList(list);

      await flushPromises();

      expect(mangaList.vm.$data.tableData.length).toBe(1);
      expect(infoMessageMock).toHaveBeenCalledWith('Nothing new to import');
    });
  });
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

      getMangaMock.mockResolvedValue(responseValue);

      expect(mangaList.vm.$data.tableData).not.toContain(responseValue);

      mangaList.vm.mangaDexSearch();

      await flushPromises();

      expect(mangaList.vm.$data.tableData).toContain(responseValue);
    });

    it('shows Manga not found message if API returns nothing', async () => {
      const infoMessageMock = jest.spyOn(Message, 'info');
      const getMangaMock    = jest.spyOn(api, 'getManga');

      getMangaMock.mockResolvedValue({});

      mangaList.vm.mangaDexSearch();

      await flushPromises();
      expect(infoMessageMock).toHaveBeenCalledWith('Manga was not found');
    });

    it('shows Manga already added if it has already been added', () => {
      const infoMessageMock = jest.spyOn(Message, 'info');
      const mangaURL = 'https://mangadex.org/manga/24121';
      const tableData = [{ series: { title: 'Manga Title', url: mangaURL } }];

      mangaList.setData({ tableData, mangaURL });

      mangaList.vm.mangaDexSearch();

      expect(infoMessageMock).toHaveBeenCalledWith('Manga already added');
    });

    it('shows URL is incorrect message if response is 400', async () => {
      const infoMessageMock = jest.spyOn(Message, 'error');
      const getMangaMock    = jest.spyOn(api, 'getManga');

      getMangaMock.mockRejectedValue({ response: { status: 400 } });

      mangaList.vm.mangaDexSearch();

      await flushPromises();
      expect(infoMessageMock).toHaveBeenCalledWith('URL is incorrect');
    });

    it('shows error message on unsuccessful API lookup', async () => {
      const errorMessageMock = jest.spyOn(Message, 'error');
      const getMangaMock    = jest.spyOn(api, 'getManga');

      getMangaMock.mockRejectedValue({ response: { status: 500 } });

      mangaList.vm.mangaDexSearch();

      await flushPromises();

      expect(errorMessageMock).toHaveBeenCalledWith('Something went wrong');
    });
  });
});
