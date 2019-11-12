import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import MangaList from '@/views/MangaList.vue';
import TheMangaList from '@/components/TheMangaList.vue';
import TheImporters from '@/components/TheImporters.vue';
import lists from '@/store/modules/lists';
import * as api from '@/services/api';

import mangaEntryFactory from '../factories/mangaEntry';
import mangaListFactory from '../factories/mangaList';

const localVue = createLocalVue();

localVue.use(Vuex);

// To avoid missing directive Vue warnings
localVue.directive('loading', true);

describe('MangaList.vue', () => {
  describe('when adding new MangaDex entry', () => {
    let store;
    let mangaList;

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          lists: {
            namespaced: true,
            state: {
              lists: [mangaListFactory.build()],
              entries: [],
            },
            actions: lists.actions,
            getters: lists.getters,
            mutations: lists.mutations,
          },
        },
      });
      mangaList = shallowMount(MangaList, { store, localVue });

      mangaList.setData({ mangaURL: 'example.url/manga/1' });
      mangaList.find({ ref: 'openAddMangaModalButton' }).trigger('click');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('adds new Manga entry on successful API lookup', async () => {
      const addMangaEntryMock = jest.spyOn(api, 'addMangaEntry');
      const mangaEntry        = mangaEntryFactory.build();

      mangaList.setData({
        mangaURL: 'example.url/manga/1', currentListID: '1',
      });

      addMangaEntryMock.mockResolvedValue({ data: mangaEntry });

      expect(mangaList.vm.currentListEntries).not.toContain(mangaEntry);

      mangaList.vm.mangaDexSearch();

      await flushPromises();

      expect(mangaList.vm.currentListEntries).toContain(mangaEntry);
    });

    it('shows Manga not found message if API returns nothing', async () => {
      const infoMessageMock   = jest.spyOn(Message, 'info');
      const addMangaEntryMock = jest.spyOn(api, 'addMangaEntry');

      addMangaEntryMock.mockRejectedValue({ response: { status: 404 } });

      mangaList.vm.mangaDexSearch();

      await flushPromises();
      expect(infoMessageMock).toHaveBeenCalledWith('Manga was not found');
    });

    it('shows Manga already added if it has already been added', () => {
      const infoMessageMock = jest.spyOn(Message, 'info');

      store.state.lists.entries = [mangaEntryFactory.build()];

      mangaList = shallowMount(MangaList, { store, localVue });

      mangaList.setData({ mangaURL: 'example.url/manga/1' });

      mangaList.vm.mangaDexSearch();

      expect(infoMessageMock).toHaveBeenCalledWith('Manga already added');
    });

    it('shows URL is incorrect message if response is 400', async () => {
      const infoMessageMock   = jest.spyOn(Message, 'error');
      const addMangaEntryMock = jest.spyOn(api, 'addMangaEntry');

      addMangaEntryMock.mockRejectedValue({ response: { status: 400 } });

      mangaList.vm.mangaDexSearch();

      await flushPromises();
      expect(infoMessageMock).toHaveBeenCalledWith('URL is incorrect');
    });

    it('shows error message on unsuccessful API lookup', async () => {
      const errorMessageMock  = jest.spyOn(Message, 'error');
      const addMangaEntryMock = jest.spyOn(api, 'addMangaEntry');

      addMangaEntryMock.mockRejectedValue({ response: { status: 500 } });

      mangaList.vm.mangaDexSearch();

      await flushPromises();

      expect(errorMessageMock).toHaveBeenCalledWith('Something went wrong');
    });
  });
  describe('watchers', () => {
    let store;

    beforeEach(() => {
      jest.useFakeTimers();
      store = new Vuex.Store({
        modules: {
          lists: {
            namespaced: true,
            state: lists.store,
            actions: lists.actions,
            getters: lists.getters,
            mutations: lists.mutations,
          },
        },
      });
    });

    it('searchTerm - adds filtered series to the filteredEntries', () => {
      const entry1 = mangaEntryFactory.build(
        { attributes: { title: 'Boku no Hero' } }
      );
      const entry2 = mangaEntryFactory.build(
        { attributes: { title: 'Attack on Titan' } }
      );
      const mangaList = shallowMount(MangaList, {
        store,
        localVue,
        computed: {
          currentListEntries: () => [entry1, entry2],
        },
      });

      expect(mangaList.vm.filteredEntries).toBe(null);

      mangaList.setData({ searchTerm: 'Boku no' });
      jest.runAllTimers();

      expect(mangaList.vm.filteredEntries).toContain(entry1);

      mangaList.setData({ searchTerm: 'Attack' });
      jest.runAllTimers();

      expect(mangaList.vm.filteredEntries).toContain(entry2);
    });
  });
  describe('@events', () => {
    let mangaList;
    let store;

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          lists: {
            namespaced: true,
            state: {
              lists: [mangaListFactory.build()],
              entries: [mangaEntryFactory.build()],
            },
            actions: lists.actions,
            getters: lists.getters,
            mutations: lists.mutations,
          },
        },
      });
      mangaList = shallowMount(MangaList, { store, localVue });
    });

    it('@seriesSelected - toggles delete button and sets selected series', () => {
      mangaList.find(TheMangaList).vm.$emit('seriesSelected', ['1']);

      expect(mangaList.html()).toContain('Remove');
      expect(mangaList.vm.$data.selectedSeriesIDs).toContain('1');
    });

    it('@importCompleted - refreshes manga list', () => {
      const retrieveListsSpy = jest.spyOn(mangaList.vm, 'retrieveLists');
      mangaList.find(TheImporters).vm.$emit('importCompleted');

      expect(retrieveListsSpy).toHaveBeenCalled();
    });
  });
  describe(':data', () => {
    let mangaList;
    let store;

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          lists: {
            namespaced: true,
            state: {
              lists: mangaListFactory.buildList(1),
              entries: [
                mangaEntryFactory.build({ id: 1 }),
                mangaEntryFactory.build({ id: 2 }),
              ],
            },
            actions: lists.actions,
            getters: lists.getters,
            mutations: lists.mutations,
          },
        },
      });
      mangaList = shallowMount(MangaList, { store, localVue });

      mangaList.setData({ selectedSeriesIDs: ['2'] });
    });

    it(':selectedSeries - if present, can remove them by pressing Remove button', () => {
      mangaList.vm.removeSeries();

      expect(mangaList.vm.currentListEntries).not.toContain({
        id: '2',
        type: 'manga_entry',
        attributes: {},
        relationships: {},
        links: {},
      });
    });
  });
});
