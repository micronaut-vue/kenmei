import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import MangaList from '@/views/MangaList.vue';
import TheMangaList from '@/components/TheMangaList.vue';
import TheImporters from '@/components/TheImporters.vue';
import AddMangaEntry from '@/components/manga_entries/AddMangaEntry.vue';
import EditMangaEntries from '@/components/manga_entries/EditMangaEntries.vue';
import lists from '@/store/modules/lists';
import * as api from '@/services/api';

import mangaEntryFactory from '../factories/mangaEntry';
import mangaListFactory from '../factories/mangaList';

const localVue = createLocalVue();

localVue.use(Vuex);

// To avoid missing directive Vue warnings
localVue.directive('loading', true);
localVue.directive('tippy', true);

describe('MangaList.vue', () => {
  let store;
  let firstMangaList;
  let entry1;
  let entry2;

  beforeEach(() => {
    firstMangaList = mangaListFactory.build({ id: '1' });
    entry1 = mangaEntryFactory.build(
      { id: 1, attributes: { title: 'Boku no Hero' } }
    );
    entry2 = mangaEntryFactory.build(
      { id: 2, attributes: { title: 'Attack on Titan' } }
    );

    store = new Vuex.Store({
      modules: {
        lists: {
          namespaced: true,
          state: {
            lists: [firstMangaList],
            entries: [entry1, entry2],
          },
          actions: lists.actions,
          getters: lists.getters,
          mutations: lists.mutations,
        },
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when adding new MangaDex entry', () => {
    let mangaList;

    beforeEach(() => {
      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        data() {
          return {
            selectedEntriesIDs: [entry1.id],
            currentListID: firstMangaList.id,
          };
        },
        methods: {
          clearTableSelection() {
            return true;
          },
        },
      });
    });

    describe('@events', () => {
      it('@dialogClosed - closes add manga dialog', () => {
        mangaList.find(AddMangaEntry).vm.$emit('dialogClosed');

        expect(mangaList.vm.$data.dialogVisible).toBe(false);
      });
    });
  });
  describe('when updating manga entries', () => {
    let mangaList;

    beforeEach(() => {
      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        data() {
          return {
            selectedEntriesIDs: [entry1.id],
            currentListID: firstMangaList.id,
          };
        },
        methods: {
          clearTableSelection() {
            return true;
          },
        },
      });
    });

    describe('@events', () => {
      it('@cancelEdit - closes edit manga entries dialog', () => {
        mangaList.find(EditMangaEntries).vm.$emit('cancelEdit');
      });
      it('@editComplete - resets selected manga entries and closes modal', () => {
        mangaList.find(EditMangaEntries).vm.$emit('editComplete');

        expect(mangaList.vm.$data.editDialogVisible).toBe(false);
        expect(mangaList.vm.$data.selectedEntriesIDs).toEqual([]);
      });
      it('@editEntry - shows edit manga entry dialog with specific entry', () => {
        mangaList.find(TheMangaList).vm.$emit('editEntry', entry1.id);

        expect(mangaList.vm.$data.editDialogVisible).toBe(true);
        expect(mangaList.vm.$data.selectedEntriesIDs).toEqual([entry1.id]);
      });
    });
  });
  describe('when deleting manga entries', () => {
    let mangaList;
    let bulkDeleteMangaEntriesMock;

    beforeEach(() => {
      bulkDeleteMangaEntriesMock = jest.spyOn(api, 'bulkDeleteMangaEntries');

      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        data() {
          return {
            selectedEntriesIDs: [entry1.id],
            currentListID: firstMangaList.id,
          };
        },
        methods: {
          clearTableSelection() {
            return true;
          },
        },
      });
    });

    afterEach(() => {
      expect(bulkDeleteMangaEntriesMock).toHaveBeenCalledWith([entry1.id]);
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

        expect(mangaList.vm.currentListEntries).not.toContain(entry1);
      });
    });

    describe('if deletion was unsuccessful', () => {
      it('shows deletion fail message and keeps entry persisted', async () => {
        const errorMessageMock = jest.spyOn(Message, 'error');

        bulkDeleteMangaEntriesMock.mockResolvedValue(false);

        mangaList.vm.removeSeries();

        await flushPromises();

        expect(mangaList.vm.currentListEntries).toContain(entry1);
        expect(errorMessageMock).toHaveBeenCalledWith(
          'Deletion failed. Try reloading the page before trying again'
        );
      });
    });
  });
  describe('@events', () => {
    let mangaList;

    beforeEach(() => {
      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        data() {
          return {
            currentListID: firstMangaList.id,
          };
        },
      });
    });

    it('@seriesSelected - toggles bulk actions and sets selected series', () => {
      const deleteButton = mangaList.find({ ref: 'removeSeriesButton' });
      const editButton = mangaList.find({ ref: 'editMangaEntriesButton' });
      const reportButton = mangaList.find({ ref: 'reportMangaEntriesButton' });

      expect(deleteButton.isVisible()).not.toBeTruthy();
      expect(editButton.isVisible()).not.toBeTruthy();
      expect(reportButton.isVisible()).not.toBeTruthy();

      mangaList.find(TheMangaList).vm.$emit('seriesSelected', ['1']);

      expect(deleteButton.isVisible()).toBeTruthy();
      expect(editButton.isVisible()).toBeTruthy();
      expect(reportButton.isVisible()).toBeTruthy();
      expect(mangaList.vm.$data.selectedEntriesIDs).toContain('1');
    });

    it('@importCompleted - refreshes manga list', () => {
      const retrieveListsSpy = jest.spyOn(mangaList.vm, 'retrieveLists');
      mangaList.find(TheImporters).vm.$emit('importCompleted');

      expect(retrieveListsSpy).toHaveBeenCalled();
    });
  });
  describe(':data', () => {
    describe(':selectedEntriesIDs', () => {
      let mangaList;
      let dialog;

      beforeEach(() => {
        mangaList = shallowMount(MangaList, {
          store,
          localVue,
          data() { return { currentListID: firstMangaList.id }; },
        });
        dialog = mangaList.find({ ref: 'editMangaEntryDialog' });
      });

      it('shows plural title in edit entry modal if there are more than one entry selected', () => {
        mangaList.setData({ selectedEntriesIDs: [entry1.id, entry2.id] });

        expect(dialog.attributes('title')).toEqual('Edit Manga Entries');
      });

      it('shows singular title in edit entry modal if there is one entry selected', () => {
        mangaList.setData({ selectedEntriesIDs: [entry1.id] });

        expect(dialog.attributes('title')).toEqual('Edit Manga Entry');
      });
    })
    it(':searchTerm - if present, filters manga entries', () => {
      const mangaList = shallowMount(MangaList, {
        store,
        localVue,
        data() {
          return {
            currentListID: firstMangaList.id,
          };
        },
        computed: {
          currentListEntries: () => [entry1, entry2],
        },
      });
      jest.useFakeTimers();

      expect(mangaList.vm.filteredEntries).toEqual([entry1, entry2]);

      mangaList.vm.debouncedSearchTerm = 'Boku no';
      jest.runAllTimers();

      expect(mangaList.vm.filteredEntries).toEqual([entry1]);

      mangaList.setData({ searchTerm: 'Attack' });
      jest.runAllTimers();

      expect(mangaList.vm.filteredEntries).toEqual([entry2]);
    });
  });
  describe(':lifecycle', () => {
    it(':mounted() - loads lists and entries, while toggling loading', async () => {
      const retrieveListsSpy   = jest.spyOn(MangaList.methods, 'retrieveLists');
      const retrieveEntriesSpy = jest.spyOn(MangaList.methods, 'retrieveEntries');

      retrieveListsSpy.mockResolvedValue();

      shallowMount(MangaList, {
        store,
        localVue,
        data() { return { currentListID: firstMangaList.id }; },
      });

      await flushPromises();

      expect(retrieveListsSpy).toHaveBeenCalled();
      expect(retrieveEntriesSpy).toHaveBeenCalled();
    });
  });
});
