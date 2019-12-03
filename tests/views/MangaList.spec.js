import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import MangaList from '@/views/MangaList.vue';
import TheMangaList from '@/components/TheMangaList.vue';
import TheImporters from '@/components/TheImporters.vue';
import lists from '@/store/modules/lists';
import * as api from '@/services/api';
import * as mangaEntriesErrors from '@/services/endpoints/MangaEntriesErrors';

import mangaEntryFactory from '../factories/mangaEntry';
import mangaListFactory from '../factories/mangaList';

const localVue = createLocalVue();

localVue.use(Vuex);

// To avoid missing directive Vue warnings
localVue.directive('loading', true);

describe('MangaList.vue', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

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
  describe('when updating manga entries', () => {
    let store;
    let mangaList;
    let mangaEntry;
    let updateMangaEntriesMock;

    beforeEach(() => {
      updateMangaEntriesMock = jest.spyOn(api, 'bulkUpdateMangaEntry');
      mangaEntry = mangaEntryFactory.build({ id: 1 });

      store = new Vuex.Store({
        modules: {
          lists: {
            namespaced: true,
            state: {
              lists: [
                mangaListFactory.build({ id: '1' }),
                mangaListFactory.build({ id: '2' }),
              ],
              entries: [mangaEntry],
            },
            actions: lists.actions,
            getters: lists.getters,
            mutations: lists.mutations,
          },
        },
      });
      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        methods: {
          clearTableSelection() {
            return true;
          },
        },
      });
      mangaList.setData({
        selectedSeriesIDs: ['1'],
        currentListID: '1',
        newListID: '2',
        editDialogVisible: true,
      });
      mangaList.find({ ref: 'editMangaEntriesButton' }).trigger('click');
    });

    afterEach(() => {
      expect(updateMangaEntriesMock).toHaveBeenCalledWith(
        ['1'], { manga_list_id: '2' }
      );
    });

    describe('if update was successful', () => {
      let updatedMangaEntry;

      beforeEach(() => {
        updatedMangaEntry = mangaEntryFactory.build(
          { relationships: { manga_list: { data: { id: '2' } } } }
        );

        updateMangaEntriesMock.mockResolvedValue([updatedMangaEntry]);
      });

      it('resets edit manga entries modal', async () => {
        mangaList.vm.updateMangaEntries();

        await flushPromises();

        expect(mangaList.vm.$data.selectedSeriesIDs).toEqual([]);
        expect(mangaList.vm.$data.editDialogVisible).toBe(false);
        expect(mangaList.vm.$data.newListID).toBe(null);
      });

      it('tells user how many entries have been updated', async () => {
        const infoMessageMock = jest.spyOn(Message, 'info');

        mangaList.vm.updateMangaEntries();

        await flushPromises();

        expect(infoMessageMock).toHaveBeenCalledWith('1 entries updated');
      });

      it("changes manga entry's manga list", async () => {
        mangaList.vm.updateMangaEntries();

        await flushPromises();

        expect(mangaList.vm.currentListEntries).not.toContain(mangaEntry);

        mangaList.setData({ currentListID: '2' });

        expect(mangaList.vm.currentListEntries).toContain(updatedMangaEntry);
      });
    });

    describe('if update was unsuccessful', () => {
      it("shows couldn't update message and keeps entry the same", async () => {
        const errorMessageMock = jest.spyOn(Message, 'error');

        updateMangaEntriesMock.mockResolvedValue(false);

        mangaList.vm.updateMangaEntries();

        await flushPromises();

        expect(mangaList.vm.currentListEntries).toContain(mangaEntry);
        expect(errorMessageMock).toHaveBeenCalledWith(
          "Couldn't update. Try refreshing the page"
        );
      });
    });
  });
  describe('when reporting manga entries', () => {
    let store;
    let mangaList;
    let postMangaEntriesErrorsMock;

    beforeEach(() => {
      postMangaEntriesErrorsMock = jest.spyOn(
        mangaEntriesErrors, 'postMangaEntriesErrors'
      );

      store = new Vuex.Store({
        modules: {
          lists: {
            namespaced: true,
            state: {
              lists: mangaListFactory.buildList(1),
              entries: mangaEntryFactory.buildList(1),
            },
            actions: lists.actions,
            getters: lists.getters,
            mutations: lists.mutations,
          },
        },
      });
      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        methods: {
          clearTableSelection() {
            return true;
          },
        },
      });
      mangaList.setData({
        selectedSeriesIDs: ['1'],
        currentListID: '1',
        newListID: '2',
      });
    });

    afterEach(() => {
      expect(postMangaEntriesErrorsMock).toHaveBeenCalledWith(['1']);
    });

    describe('if report was successful', () => {
      it('shows successful message', async () => {
        const infoMessageMock = jest.spyOn(Message, 'success');

        postMangaEntriesErrorsMock.mockResolvedValue(true);

        mangaList.vm.reportEntryError();

        await flushPromises();

        expect(infoMessageMock).toHaveBeenCalledWith(
          'Issue reported. Entries will be updated'
            + ' automatically shortly or investigated in detail later'
        );
      });
    });

    describe('if report was unsuccessful', () => {
      it('shows failure message', async () => {
        const errorMessageMock = jest.spyOn(Message, 'error');

        postMangaEntriesErrorsMock.mockResolvedValue(false);

        mangaList.vm.reportEntryError();

        await flushPromises();

        expect(errorMessageMock).toHaveBeenCalledWith(
          'Failed to report. Try reloading the page before trying again'
        );
      });
    })
  });
  describe('when deleting manga entries', () => {
    let store;
    let mangaList;
    let mangaEntry;
    let bulkDeleteMangaEntriesMock;

    beforeEach(() => {
      bulkDeleteMangaEntriesMock = jest.spyOn(api, 'bulkDeleteMangaEntries');
      mangaEntry = mangaEntryFactory.build({ id: '1' });

      store = new Vuex.Store({
        modules: {
          lists: {
            namespaced: true,
            state: {
              lists: [mangaListFactory.build({ id: '1' })],
              entries: [mangaEntry],
            },
            actions: lists.actions,
            getters: lists.getters,
            mutations: lists.mutations,
          },
        },
      });
      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        methods: {
          clearTableSelection() {
            return true;
          },
        },
      });
      mangaList.setData({ selectedSeriesIDs: ['1'], currentListID: '1' });
    });

    afterEach(() => {
      expect(bulkDeleteMangaEntriesMock).toHaveBeenCalledWith(['1']);
    });

    describe('if deletion was successful', () => {
      beforeEach(() => { bulkDeleteMangaEntriesMock.mockResolvedValue(true); });

      it('tells user how many entries have been deleted', async () => {
        const infoMessageMock = jest.spyOn(Message, 'info');

        mangaList.vm.removeSeries();

        await flushPromises();

        expect(infoMessageMock).toHaveBeenCalledWith('1 entries deleted');
      });

      it('removes deleted entries', async () => {
        mangaList.vm.removeSeries();

        await flushPromises();

        expect(mangaList.vm.currentListEntries).not.toContain(mangaEntry);
      });
    });

    describe('if deletion was unsuccessful', () => {
      it('shows deletion fail message and keeps entry persisted', async () => {
        const errorMessageMock = jest.spyOn(Message, 'error');

        bulkDeleteMangaEntriesMock.mockResolvedValue(false);

        mangaList.vm.removeSeries();

        await flushPromises();

        expect(mangaList.vm.currentListEntries).toContain(mangaEntry);
        expect(errorMessageMock).toHaveBeenCalledWith(
          'Deletion failed. Try reloading the page before trying again'
        );
      });
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
