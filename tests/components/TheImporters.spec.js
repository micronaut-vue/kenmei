import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { Message } from 'element-ui';
import axios from 'axios';
import flushPromises from 'flush-promises';
import TheImporters from '@/components/TheImporters.vue';
import lists from '@/store/modules/lists';
import * as api from '@/services/api';

import mangaEntryFactory from '../factories/mangaEntry';

const localVue = createLocalVue();

localVue.use(Vuex);

// To avoid missing directive Vue warnings
localVue.directive('loading', true);

describe('TheImporters.vue', () => {
  describe('when importing MangaDex entries from Trackr.moe JSON', () => {
    let importedList;
    let mangaEntry;
    let store;
    let importers;

    beforeEach(() => {
      importedList = {
        series: {
          reading: {
            manga: [{
              full_title_url: 'example.url/manga/1',
              generated_current_data: {
                url: 'example.url/chapter/1',
              },
              title_data: {
                current_chapter: '38201:--:v5/c34',
              },
              site_data: {
                site: 'mangadex.org',
              },
            }],
          },
        },
      };
      mangaEntry = mangaEntryFactory.build();
      store = new Vuex.Store({
        modules: {
          lists: {
            namespaced: true,
            state: {
              lists: [],
              entries: [],
            },
            actions: lists.actions,
            getters: lists.getters,
            mutations: lists.mutations,
          },
        },
      });
      importers = shallowMount(TheImporters, { store, localVue });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('parses manga list from a json file', async () => {
      const file = new File(
        [importedList], 'list.json', { type: 'application/json' }
      );
      const fileReaderReadTextMock = jest.spyOn(window, 'FileReader');

      fileReaderReadTextMock.mockImplementation(() => ({
        readAsText: jest.fn(),
      }));

      importers.vm.processUpload({ file });

      await flushPromises();

      expect(fileReaderReadTextMock).toHaveBeenCalled();
    });

    it('adds new manga entries and updates progress percentage if successful', async () => {
      const addMangaEntriesMock = jest.spyOn(api, 'addMangaEntries');

      addMangaEntriesMock.mockResolvedValue({ data: [mangaEntry] });

      importers.vm.processMangaDexList(importedList);

      await flushPromises();

      // TODO: Find out why this is not woring anymore
      // expect(mangaList.vm.currentListEntries).toContain(mangaEntry);
      expect(importers.vm.$data.importProgress).toEqual(100);
      expect(importers.emitted('importCompleted')).toBeTruthy();
    });

    it('shows Something went wrong message if import failed', async () => {
      const errorMessageMock    = jest.spyOn(Message, 'error');
      const addMangaEntriesMock = jest.spyOn(api, 'addMangaEntries');

      addMangaEntriesMock.mockRejectedValue();

      importers.vm.processMangaDexList(importedList);

      await flushPromises();

      expect(errorMessageMock).toHaveBeenCalledWith('Something went wrong');
    });

    it('ignores already existing entries', async () => {
      const infoMessageMock = jest.spyOn(Message, 'info');

      store.state.lists.entries = [mangaEntry];

      importers.vm.processMangaDexList(importedList);

      await flushPromises();

      expect(infoMessageMock).toHaveBeenCalledWith('Nothing new to import');
    });
  });

  describe('when importing MangaDex entries from MangaDex MDList', () => {
    let store;
    let importers;

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          lists: {
            namespaced: true,
            state: {
              lists: [],
              entries: [],
            },
            actions: lists.actions,
            getters: lists.getters,
            mutations: lists.mutations,
          },
        },
      });
      importers = shallowMount(TheImporters, { store, localVue });
      importers.setData({ importURL: 'https://mangadex.org/list/007' });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('queues MangaDex MDList import if successful', async () => {
      const axiosSpy = jest.spyOn(axios, 'post');

      axiosSpy.mockResolvedValue({ status: 200 });

      importers.vm.importMangaDex();

      await flushPromises();

      expect(axiosSpy).toHaveBeenCalledWith(
        '/api/v1/importers/mangadex', { url: 'https://mangadex.org/list/007' }
      );
      expect(importers.text()).toContain('Your MangaDex MDList import');
    });

    it('shows Something went wrong message if import failed', async () => {
      const errorMessageMock = jest.spyOn(Message, 'error');
      const axiosSpy         = jest.spyOn(axios, 'post');

      axiosSpy.mockRejectedValue();

      importers.vm.importMangaDex();

      await flushPromises();

      expect(errorMessageMock).toHaveBeenCalledWith(
        'Something went wrong, try again later or contact hi@kenmei.co'
      );
      expect(importers.text()).not.toContain('Your MangaDex MDList import');
    });
  });
});
