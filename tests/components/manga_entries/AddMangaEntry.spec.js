import Vuex from 'vuex';
import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import AddMangaEntry from '@/components/manga_entries/AddMangaEntry.vue';
import lists from '@/store/modules/lists';
import * as api from '@/services/api';

import mangaEntryFactory from '../../factories/mangaEntry';
import mangaListFactory from '../../factories/mangaList';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('AddMangaEntry.vue', () => {
  describe('when adding new MangaDex entry', () => {
    let store;
    let addMangaEntry;

    const mangaList = mangaListFactory.build();

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          lists: {
            namespaced: true,
            state: {
              lists: [mangaList],
              entries: [],
            },
            mutations: lists.mutations,
          },
        },
      });
      addMangaEntry = shallowMount(AddMangaEntry, {
        store,
        localVue,
        data() {
          return {
            mangaURL: 'example.url/manga/1',
          };
        },
        propsData: {
          currentListID: '1',
        },
      });
    });

    it('adds new Manga entry on successful API lookup', async () => {
      const addMangaEntryMock = jest.spyOn(api, 'addMangaEntry');
      const mangaEntry        = mangaEntryFactory.build();

      addMangaEntryMock.mockResolvedValue({ data: mangaEntry });

      expect(store.state.lists.entries).toEqual([]);

      addMangaEntry.vm.mangaDexSearch();

      await flushPromises();

      expect(store.state.lists.entries).toContain(mangaEntry);
      expect(addMangaEntry.emitted('dialogClosed')).toBeTruthy();
    });

    describe('when receiving 404 status', () => {
      it('shows info message with payload data', async () => {
        const infoMessageMock   = jest.spyOn(Message, 'info');
        const addMangaEntryMock = jest.spyOn(api, 'addMangaEntry');

        addMangaEntryMock.mockRejectedValue(
          { response: { status: 404, data: 'Manga was not found' } }
        );

        addMangaEntry.vm.mangaDexSearch();

        await flushPromises();
        expect(infoMessageMock).toHaveBeenCalledWith('Manga was not found');
      });
    });

    describe('when receiving 406 status', () => {
      it('shows info message with payload data', async () => {
        const infoMessageMock   = jest.spyOn(Message, 'info');
        const addMangaEntryMock = jest.spyOn(api, 'addMangaEntry');

        addMangaEntryMock.mockRejectedValue(
          { response: { status: 406, data: 'Manga already added' } }
        );

        addMangaEntry.vm.mangaDexSearch();

        await flushPromises();
        expect(infoMessageMock).toHaveBeenCalledWith('Manga already added');
      });
    });

    it('shows error message on unsuccessful API lookup', async () => {
      const errorMessageMock  = jest.spyOn(Message, 'error');
      const addMangaEntryMock = jest.spyOn(api, 'addMangaEntry');

      addMangaEntryMock.mockRejectedValue({ response: { status: 500 } });

      addMangaEntry.vm.mangaDexSearch();

      await flushPromises();

      expect(errorMessageMock).toHaveBeenCalledWith('Something went wrong');
      expect(addMangaEntry.emitted('dialogClosed')).toBeTruthy();
    });
  });
});
