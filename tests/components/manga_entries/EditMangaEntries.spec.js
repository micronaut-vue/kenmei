import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import EditMangaEntries from '@/components/manga_entries/EditMangaEntries.vue';
import lists from '@/store/modules/lists';
import * as api from '@/services/api';

import mangaEntryFactory from '../../factories/mangaEntry';
import mangaListFactory from '../../factories/mangaList';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('EditMangaEntries.vue', () => {
  let store;
  let editMangaEntries;
  let mangaEntry;

  beforeEach(() => {
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
          mutations: lists.mutations,
        },
      },
    });
    editMangaEntries = shallowMount(EditMangaEntries, {
      store,
      localVue,
      data() {
        return {
          newListID: '2',
        };
      },
      propsData: {
        selectedEntriesIDs: ['1'],
      },
    });
  });
  describe('when updating manga entries', () => {
    let updateMangaEntriesMock;
    let updatedMangaEntry;

    beforeEach(() => {
      updateMangaEntriesMock = jest.spyOn(api, 'bulkUpdateMangaEntry');
      updatedMangaEntry = mangaEntryFactory.build(
        { relationships: { manga_list: { data: { id: '2' } } } }
      );
    });

    afterEach(() => {
      expect(updateMangaEntriesMock).toHaveBeenCalledWith(
        ['1'], { manga_list_id: '2' }
      );
    });

    describe('if update was successful', () => {
      beforeEach(() => {
        updateMangaEntriesMock.mockResolvedValue([updatedMangaEntry]);
      });

      it('emits editComplete and sets newListID to null', async () => {
        editMangaEntries.vm.updateMangaEntries();

        await flushPromises();

        expect(editMangaEntries.vm.$data.newListID).toEqual(null);
        expect(editMangaEntries.emitted('editComplete')).toBeTruthy();
      });

      it('tells user how many entries have been updated', async () => {
        const infoMessageMock = jest.spyOn(Message, 'info');

        editMangaEntries.vm.updateMangaEntries();

        await flushPromises();

        expect(infoMessageMock).toHaveBeenCalledWith('1 entries updated');
      });

      it("changes manga entry's manga list", async () => {
        editMangaEntries.vm.updateMangaEntries();

        await flushPromises();

        expect(store.state.lists.entries).not.toContain(mangaEntry);
        expect(store.state.lists.entries).toContain(updatedMangaEntry);
      });
    });

    describe('if update was unsuccessful', () => {
      it("shows couldn't update message and keeps entry the same", async () => {
        const errorMessageMock = jest.spyOn(Message, 'error');

        updateMangaEntriesMock.mockResolvedValue(false);

        editMangaEntries.vm.updateMangaEntries();

        await flushPromises();

        expect(store.state.lists.entries).toContain(mangaEntry);
        expect(store.state.lists.entries).not.toContain(updatedMangaEntry);
        expect(errorMessageMock).toHaveBeenCalledWith(
          "Couldn't update. Try refreshing the page"
        );
      });
    });
  });
});
