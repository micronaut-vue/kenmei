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
          { relationships: { manga_list: { data: { id: listID } } } }
        );
        const state = {
          entries: [
            expectedReturn,
            mangaEntryFactory.build(
              { relationships: { manga_list: { data: { id: '2' } } } }
            ),
          ],
        };

        const getEntriesByListId = lists.getters.getEntriesByListId(state);

        expect(getEntriesByListId(listID)).toEqual([expectedReturn]);
      });
    });

    describe('entryAlreadyExists', () => {
      it('returns entries based on a list id', () => {
        const state = { entries: mangaEntryFactory.buildList(1) };

        const entryAlreadyExists = lists.getters.entryAlreadyExists(state);

        expect(entryAlreadyExists('example.url/manga/1')).toBeTruthy();
        expect(entryAlreadyExists('example.url/manga/2')).not.toBeTruthy();
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
        expect(commit).toHaveBeenCalledWith('setEntries', entries);
        expect(commit).toHaveBeenCalledWith('setListsLoading', true);
        expect(commit).toHaveBeenLastCalledWith('setListsLoading', false);
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
  });
});