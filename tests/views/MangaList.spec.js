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

    entry1 = mangaEntryFactory.build({ id: 1 });
    entry2 = mangaEntryFactory.build({ id: 2 });

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

  describe('when adding new manga entry', () => {
    let mangaList;
    let modal;

    beforeEach(() => {
      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        data() {
          return {
            selectedEntries: [entry1],
            currentListID: firstMangaList.id,
          };
        },
        methods: {
          clearTableSelection() {
            return true;
          },
        },
      });

      modal = mangaList.find({ ref: 'addMangaEntryModal' });
    });

    it('shows add manga entry modal', async () => {
      mangaList.find({ ref: 'addMangaEntryModalButton' }).trigger('click');

      await nextTick();

      expect(modal.isVisible()).toBeTruthy();
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
    let modal;

    beforeEach(() => {
      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        data() {
          return {
            selectedEntries: [entry1],
            currentListID: firstMangaList.id,
          };
        },
        methods: {
          clearTableSelection() {
            return true;
          },
        },
      });

      modal = mangaList.find({ ref: 'editMangaEntryModal' });
    });

    it('shows edit manga entries modal', async () => {
      mangaList.find({ ref: 'editMangaEntriesButton' }).trigger('click');

      await nextTick();

      expect(modal.isVisible()).toBeTruthy();
    });

    describe('@events', () => {
      it('@cancelEdit - closes edit manga entries dialog', async () => {
        mangaList.setData({ editDialogVisible: true });

        await nextTick();

        mangaList.find(EditMangaEntries).vm.$emit('cancelEdit');

        expect(mangaList.vm.$data.editDialogVisible).toBeFalsy();
      });

      it('@editComplete - resets selected manga entries and closes modal', async () => {
        mangaList.setData({ editDialogVisible: true });

        await nextTick();

        mangaList.find(EditMangaEntries).vm.$emit('editComplete');

        expect(mangaList.vm.$data.editDialogVisible).toBeFalsy();
        expect(mangaList.vm.$data.selectedEntries).toEqual([]);
      });

      it('@editEntry - shows edit manga entry dialog with specific entry', () => {
        mangaList.find(TheMangaList).vm.$emit('editEntry', entry1);

        expect(mangaList.vm.$data.editDialogVisible).toBeTruthy();
        expect(mangaList.vm.$data.selectedEntries).toEqual([entry1]);
      });
    });
  });
  describe('when deleting manga entries', () => {
    let mangaList;

    beforeEach(() => {
      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        data() {
          return {
            selectedEntries: [entry1],
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

    describe('when entry has multiple sources tracked', () => {
      it('shows deleteMangaEntries modal', () => {
        const entry3 = mangaEntryFactory.build({
          id: 3,
          attributes: { tracked_entries: [{ id: 3 }, { id: 12 }] },
        });

        mangaList.setData({
          selectedEntries: [entry1, entry3],
          currentListID: firstMangaList.id,
        });

        mangaList.vm.deleteEntries();

        expect(mangaList.vm.$data.deleteDialogVisible).toBeTruthy();
      });
    });

    describe('when entry does not have multiple sources tracked', () => {
      let bulkDeleteMangaEntriesMock;

      beforeEach(() => {
        bulkDeleteMangaEntriesMock = jest.spyOn(api, 'bulkDeleteMangaEntries');
      });

      afterEach(() => {
        expect(bulkDeleteMangaEntriesMock).toHaveBeenCalledWith([entry1.id]);
      });

      describe('and deletion was successful', () => {
        beforeEach(() => { bulkDeleteMangaEntriesMock.mockResolvedValue(true); });

        it('tells user how many entries have been deleted', async () => {
          const infoMessageMock = jest.spyOn(Message, 'info');

          mangaList.vm.deleteEntries();

          await flushPromises();

          expect(infoMessageMock).toHaveBeenCalledWith('1 entries deleted');
        });

        it('removes deleted entries', async () => {
          mangaList.vm.deleteEntries();

          await flushPromises();

          expect(mangaList.vm.currentListEntries).not.toContain(entry1);
        });
      });

      describe('and deletion was unsuccessful', () => {
        it('shows deletion fail message and keeps entry persisted', async () => {
          const errorMessageMock = jest.spyOn(Message, 'error');

          bulkDeleteMangaEntriesMock.mockResolvedValue(false);

          mangaList.vm.deleteEntries();

          await flushPromises();

          expect(mangaList.vm.currentListEntries).toContain(entry1);
          expect(errorMessageMock).toHaveBeenCalledWith(
            'Deletion failed. Try reloading the page before trying again'
          );
        });
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

    it('@seriesSelected - toggles bulk actions and sets selected series', async () => {
      const deleteButton = mangaList.find({ ref: 'removeSeriesButton' });
      const editButton = mangaList.find({ ref: 'editMangaEntriesButton' });
      const reportButton = mangaList.find({ ref: 'reportMangaEntriesButton' });

      expect(deleteButton.isVisible()).not.toBeTruthy();
      expect(editButton.isVisible()).not.toBeTruthy();
      expect(reportButton.isVisible()).not.toBeTruthy();

      mangaList.find(TheMangaList).vm.$emit('seriesSelected', [entry1]);

      await nextTick();

      expect(deleteButton.isVisible()).toBeTruthy();
      expect(editButton.isVisible()).toBeTruthy();
      expect(reportButton.isVisible()).toBeTruthy();
      expect(mangaList.vm.$data.selectedEntries).toContain(entry1);
    });

    it('@importCompleted - refreshes manga list', () => {
      const retrieveListsSpy = jest.spyOn(mangaList.vm, 'retrieveLists');
      mangaList.find(TheImporters).vm.$emit('importCompleted');

      expect(retrieveListsSpy).toHaveBeenCalled();
    });
  });
  describe(':data', () => {
    it(':searchTerm - if present, filters manga entries', () => {
      const entry1 = mangaEntryFactory.build(
        { attributes: { title: 'Boku no Hero' } }
      );
      const entry2 = mangaEntryFactory.build(
        { attributes: { title: 'Attack on Titan' } }
      );

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

      mangaList.setData({ searchTerm: 'Boku no' });
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
