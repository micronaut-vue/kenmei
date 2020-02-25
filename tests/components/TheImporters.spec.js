import Vuex from 'vuex';
import { Message } from 'element-ui';
import axios from 'axios';
import flushPromises from 'flush-promises';
import TheImporters from '@/components/TheImporters.vue';
import lists from '@/store/modules/lists';
import * as importersEndpoint from '@/services/endpoints/importers';

const localVue = createLocalVue();

localVue.use(Vuex);

// To avoid missing directive Vue warnings
localVue.directive('loading', true);

describe('TheImporters.vue', () => {
  describe('when importing MangaDex entries from Trackr.moe JSON', () => {
    let importedList;
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
                number: 'v5/c34',
              },
              site_data: {
                site: 'mangadex.org',
              },
            }],
          },
        },
      };
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

    describe('when file is valid', () => {
      it('parses manga list', async () => {
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

      it('shows success message', async () => {
        const postTrackrMoeMock = jest.spyOn(
          importersEndpoint, 'postTrackrMoe'
        );

        postTrackrMoeMock.mockResolvedValue(true);

        importers.vm.processMangaDexList(importedList);

        await flushPromises();

        expect(importers.text()).toContain(
          'Your Trackr.moe import has started'
        );
      });

      it('shows Something went wrong message if import failed', async () => {
        const errorMessageMock  = jest.spyOn(Message, 'error');
        const postTrackrMoeMock = jest.spyOn(
          importersEndpoint, 'postTrackrMoe'
        );

        postTrackrMoeMock.mockResolvedValue(false);

        importers.vm.processMangaDexList(importedList);

        await flushPromises();

        expect(errorMessageMock).toHaveBeenCalledWith(
          'Something went wrong, try again later or contact hi@kenmei.co'
        );
      });
    });

    describe('when file is invalid', () => {
      it.todo('raises an File is incorrect error if not trackr.moe file');
      it.todo('raises a Partial list error if trackr.moe list is incomplete');
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
