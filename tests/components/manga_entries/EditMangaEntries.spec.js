import Vuex from 'vuex';
import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import EditMangaEntries from '@/components/manga_entries/EditMangaEntries.vue';
import lists from '@/store/modules/lists';
import * as api from '@/services/api';
import * as mangaSources from '@/services/endpoints/MangaSources';

import mangaEntryFactory from '../../factories/mangaEntry';
import mangaSourceFactory from '../../factories/mangaSource';
import mangaListFactory from '../../factories/mangaList';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('EditMangaEntries.vue', () => {
  let store;
  const entry1 = mangaEntryFactory.build({ id: 1 });
  const entry2 = mangaEntryFactory.build({ id: 2 });

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        lists: {
          namespaced: true,
          state: {
            lists: [
              mangaListFactory.build({ id: '1' }),
              mangaListFactory.build({ id: '2' }),
            ],
            entries: [entry1, entry2],
          },
          mutations: lists.mutations,
        },
      },
    });
  });

  describe(':props', () => {
    describe(':selectedEntries', () => {
      let editMangaEntries;

      beforeEach(() => {
        editMangaEntries = shallowMount(EditMangaEntries, {
          store,
          localVue,
          propsData: { selectedEntries: [] },
        });
      });


      it('prefills manga list', async () => {
        editMangaEntries.setProps({ selectedEntries: [entry1] });

        await nextTick();

        expect(editMangaEntries.vm.$data.listID).toEqual(
          entry1.manga_list_id.toString()
        );
      });

      describe('when single entry selected', () => {
        it('loads available sources', async () => {
          const availableSources = mangaSourceFactory.buildList(1);
          const getMangaSourcesSpy = jest.spyOn(mangaSources, 'getMangaSources');

          getMangaSourcesSpy.mockResolvedValue({ data: availableSources });

          editMangaEntries.setProps({ selectedEntries: [entry1] });

          await flushPromises();

          expect(editMangaEntries.vm.$data.mangaSourceID).toEqual(entry1.id);
          expect(editMangaEntries.vm.$data.availableSources).toEqual(
            availableSources
          );
        });

        it("shows error when available sources didn't load", async () => {
          const errorMessageMock = jest.spyOn(Message, 'error');
          const getMangaSourcesSpy = jest.spyOn(mangaSources, 'getMangaSources');

          getMangaSourcesSpy.mockResolvedValue(false);

          editMangaEntries.setProps({ selectedEntries: [entry1] });

          await flushPromises();

          expect(editMangaEntries.vm.$data).toEqual({
            listID: entry1.manga_list_id.toString(),
            mangaSourceID: null,
            availableSources: [],
            loadingSources: true,
            loading: false,
          });
          expect(errorMessageMock).toHaveBeenCalledWith(
            "Couldn't fetch available manga sites. Try refreshing the page"
          );
        });
      });
    });
  });

  describe('when updating single manga entry', () => {
    let editMangaEntries;
    let updateMangaEntryMock;

    beforeEach(() => {
      updateMangaEntryMock = jest.spyOn(api, 'updateMangaEntry');
      editMangaEntries = shallowMount(EditMangaEntries, {
        store,
        localVue,
        propsData: { selectedEntries: [entry1] },
      });
    });

    afterEach(() => {
      expect(updateMangaEntryMock).toHaveBeenCalledWith(
        1, { manga_list_id: '2', manga_source_id: 1 }
      );
    });

    it('uses updateMangaEntry endpoint', async () => {
      editMangaEntries.setData({ listID: '2', mangaSourceID: 1 });
      const updatedEntry = mangaEntryFactory.build({ id: 1, manga_list_id: 2 });

      updateMangaEntryMock.mockResolvedValue(updatedEntry);

      editMangaEntries.vm.updateMangaEntries();

      await flushPromises();

      expect(store.state.lists.entries).not.toContain(entry1);
      expect(store.state.lists.entries).toContain(updatedEntry);
    });
  });

  describe('when updating multiple manga entries', () => {
    let editMangaEntries;
    let updateMangaEntriesMock;
    let updatedMangaEntries;

    beforeEach(() => {
      updateMangaEntriesMock = jest.spyOn(api, 'bulkUpdateMangaEntry');
      editMangaEntries = shallowMount(EditMangaEntries, {
        store,
        localVue,
        propsData: { selectedEntries: [entry1, entry2] },
      });

      updatedMangaEntries = [
        mangaEntryFactory.build({ id: 1, manga_list_id: 2 }),
        mangaEntryFactory.build({ id: 2, manga_list_id: 2 }),
      ];
    });

    afterEach(() => {
      expect(updateMangaEntriesMock).toHaveBeenCalledWith(
        [1, 2], { manga_list_id: '2' }
      );
    });

    describe('if update was successful', () => {
      beforeEach(() => {
        editMangaEntries.setData({ listID: '2' });

        updateMangaEntriesMock.mockResolvedValue(updatedMangaEntries);
      });

      it('emits editComplete', async () => {
        editMangaEntries.vm.updateMangaEntries();

        await flushPromises();

        expect(editMangaEntries.emitted('editComplete')).toBeTruthy();
      });

      it('tells user how many entries have been updated', async () => {
        const infoMessageMock = jest.spyOn(Message, 'info');

        editMangaEntries.vm.updateMangaEntries();

        await flushPromises();

        expect(infoMessageMock).toHaveBeenCalledWith('2 entries updated');
      });

      it('changes manga entries manga list', async () => {
        editMangaEntries.vm.updateMangaEntries();

        await flushPromises();

        expect(store.state.lists.entries).toEqual(updatedMangaEntries);
      });
    });

    describe('if update was unsuccessful', () => {
      it("shows couldn't update message and keeps same entries", async () => {
        const errorMessageMock = jest.spyOn(Message, 'error');

        editMangaEntries.setData({ listID: '2' });
        updateMangaEntriesMock.mockResolvedValue(false);

        editMangaEntries.vm.updateMangaEntries();

        await flushPromises();

        expect(store.state.lists.entries).toEqual([entry1, entry2]);
        expect(store.state.lists.entries).not.toEqual(updatedMangaEntries);
        expect(errorMessageMock).toHaveBeenCalledWith(
          "Couldn't update. Try refreshing the page"
        );
      });
    });
  });
});
