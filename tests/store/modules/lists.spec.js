import axios from 'axios';
import flushPromises from 'flush-promises';
import { Message } from 'element-ui';
import lists from '@/store/modules/lists';

import mangaEntryFactory from '../../factories/mangaEntry';
import mangaListFactory from '../../factories/mangaList';

describe('lists', () => {
  describe('getters', () => {
    describe('getEntriesByListId', () => {
      it('returns entries based on a list id', () => {
        const listID = '1';
        const expectedReturn = mangaEntryFactory.build(
          { manga_list_id: listID }
        );
        const state = {
          entries: [
            expectedReturn,
            mangaEntryFactory.build({ manga_list_id: 2 }),
          ],
        };

        const getEntriesByListId = lists.getters.getEntriesByListId(state);

        expect(getEntriesByListId(listID)).toEqual([expectedReturn]);
      });
    });
  });

  describe('mutations', () => {
    describe('setLists', () => {
      it('sets lists state', () => {
        const newLists = mangaListFactory.buildList(1);
        const state = { lists: [] };

        lists.mutations.setLists(state, newLists);

        expect(state.lists).toEqual(newLists);
      });
    });

    describe('setEntries', () => {
      it('sets entries state', () => {
        const newEntries = mangaEntryFactory.buildList(1);
        const state = { entries: [] };

        lists.mutations.setEntries(state, newEntries);

        expect(state.entries).toEqual(newEntries);
      });
    });

    describe('addEntry', () => {
      it('adds a new manga entry to state', () => {
        const newEntry = mangaEntryFactory.build({ id: 2 });
        const state = { entries: mangaEntryFactory.buildList(1) };

        lists.mutations.addEntry(state, newEntry);

        expect(state.entries).toContain(newEntry);
      });
    });

    describe('updateEntry', () => {
      it('updates existing manga entry with the new state', () => {
        let entryToUpdate = mangaEntryFactory.build(
          { id: 1, attributes: { title: 'Manga Title' } }
        );
        let entry = mangaEntryFactory.build(
          { id: 2, attributes: { title: 'Manga Title' } }
        );

        const state = { entries: [entryToUpdate, entry] };

        const updatedEntry = mangaEntryFactory.build(
          { id: 1, attributes: { title: 'Updated Title' } }
        );

        lists.mutations.updateEntry(state, updatedEntry);

        entryToUpdate = state.entries.find(e => e.id === 1);
        entry = state.entries.find(e => e.id === 2);

        expect(entryToUpdate.attributes.title).toContain('Updated Title');
        expect(entry.attributes.title).toContain('Manga Title');
      });
    });

    describe('replaceEntry', () => {
      it('replaces existing manga entry with the one passed', () => {
        const currentEntry = mangaEntryFactory.build(
          { id: 1, attributes: { title: 'Manga Title' } }
        );

        const state = { entries: [currentEntry] };

        const newEntry = mangaEntryFactory.build(
          { id: 3, attributes: { title: 'Updated Title' } }
        );

        lists.mutations.replaceEntry(state, { currentEntry, newEntry });

        expect(state.entries.length).toBe(1);
        expect(state.entries[0]).toEqual(newEntry);
      });
    });

    describe('removeEntries', () => {
      it('removes a manga entry', () => {
        const entryToStay = mangaEntryFactory.build({ id: '1' });
        const state = {
          entries: [
            entryToStay,
            mangaEntryFactory.build({ id: '2' }),
            mangaEntryFactory.build({ id: '3' }),
          ],
        };

        lists.mutations.removeEntries(state, ['2', '3']);

        expect(state.entries).toEqual([entryToStay]);
      });
    });

    describe('setListsLoading', () => {
      it('sets lists state', () => {
        const state = { listsLoading: false };

        lists.mutations.setListsLoading(state, true);

        expect(state.listsLoading).toBeTruthy();
      });
    });
  });

  describe('actions', () => {
    let commit;

    beforeEach(() => {
      commit = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('getLists', () => {
      it('retrieves lists from the api', async () => {
        const axiosSpy     = jest.spyOn(axios, 'get');
        const initLists    = mangaListFactory.buildList(1);
        const entries      = mangaEntryFactory.buildList(1);
        const mockResponse = { data: initLists, included: entries };

        axiosSpy.mockResolvedValue({ status: 200, data: mockResponse });

        lists.actions.getLists({ commit });

        await flushPromises();

        expect(axiosSpy).toHaveBeenCalledWith('/api/v1/manga_lists/');
        expect(commit).toHaveBeenCalledWith('setLists', initLists);
      });

      it('shows error message if request has failed', async () => {
        const axiosSpy        = jest.spyOn(axios, 'get');
        const errorMessageSpy = jest.spyOn(Message, 'error');
        const mockResponse    = {
          response: { data: { error: 'Lists not found' } },
        };

        axiosSpy.mockRejectedValue(mockResponse);

        lists.actions.getLists({ commit });

        await flushPromises();

        expect(axiosSpy).toHaveBeenCalledWith('/api/v1/manga_lists/');
        expect(errorMessageSpy).toHaveBeenLastCalledWith(
          mockResponse.response.data.error
        );
        expect(commit).not.toHaveBeenCalledWith('setLists', mockResponse);
      });
    });

    describe('getEntries', () => {
      it('retrieves manga entries from the api', async () => {
        const axiosSpy = jest.spyOn(axios, 'get');
        const entries  = mangaEntryFactory.buildList(1);

        axiosSpy.mockResolvedValue({ status: 200, data: { data: entries } });

        lists.actions.getEntries({ commit });

        await flushPromises();

        expect(axiosSpy).toHaveBeenCalledWith('/api/v1/manga_entries/');
        expect(commit).toHaveBeenCalledWith('setEntries', entries);
      });

      it('shows error message if request has failed', async () => {
        const axiosSpy        = jest.spyOn(axios, 'get');
        const errorMessageSpy = jest.spyOn(Message, 'error');
        const mockResponse    = {
          response: { data: { error: 'Entries not found' } },
        };

        axiosSpy.mockRejectedValue(mockResponse);

        lists.actions.getEntries({ commit });

        await flushPromises();

        expect(axiosSpy).toHaveBeenCalledWith('/api/v1/manga_entries/');
        expect(errorMessageSpy).toHaveBeenLastCalledWith(
          mockResponse.response.data.error
        );
        expect(commit).not.toHaveBeenCalledWith('setEntries', mockResponse);
      });
    });
  });
});
