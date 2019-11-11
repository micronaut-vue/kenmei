import { mount, createLocalVue } from '@vue/test-utils';
import { Message } from 'element-ui';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';

import MangaList from '@/components/TheMangaList.vue';
import lists from '@/store/modules/lists';
import mangaEntryFactory from '../factories/mangaEntry';

import * as api from '@/services/api';

const localVue = createLocalVue();

localVue.directive('loading', true);
localVue.use(Vuex);

describe('TheMangaList.vue', () => {
  let mangaList;
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        lists: {
          namespaced: true,
          state: {
            lists: [],
            entries: [mangaEntryFactory.build({ id: '1' })],
          },
          mutations: lists.mutations,
        },
      },
    });
    mangaList = mount(MangaList, {
      store,
      localVue,
      sync: false,
      propsData: {
        tableData: mangaEntryFactory.buildList(1),
      },
    });
  });

  describe('when updating a manga entry', () => {
    let updateMangaEntryMock;

    beforeEach(() => {
      updateMangaEntryMock = jest.spyOn(api, 'updateMangaEntry');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('mutates the state and shows success message', async () => {
      const infoMessageMock = jest.spyOn(Message, 'info');
      const mangaEntry = mangaEntryFactory.build(
        {
          id: '1',
          attributes: {
            title: 'Manga Title',
            last_chapter_read: '2',
            last_chapter_available: '2',
          },
        }
      );

      updateMangaEntryMock.mockResolvedValue(mangaEntry);

      mangaList.find({ ref: 'updateEntryButton' }).trigger('click');

      await flushPromises();

      expect(infoMessageMock).toHaveBeenCalledWith('Updated last read chapter');
    });

    it('shows error message if update failed', async () => {
      const errorMessageMock = jest.spyOn(Message, 'error');

      // TODO: Change to correct mockRejectedValue, when I am able to fix the
      // issue with using it
      updateMangaEntryMock.mockResolvedValue(false);

      mangaList.find({ ref: 'updateEntryButton' }).trigger('click');

      await flushPromises();

      expect(errorMessageMock).toHaveBeenCalledWith(
        "Couldn't update. Try refreshing the page"
      );
    });
  });

  describe('@events', () => {
    it.skip('@handleSelectionChange - when selecting rows, emits seriesSelected', async () => {
      await flushPromises();

      mangaList.find('.el-checkbox').trigger('click');

      expect(mangaList.emitted('seriesSelected')).toBeTruthy();
    });
  });

  describe('when no last chapter is available', () => {
    it('Released at column shows Unknown', async () => {
      mangaList.setProps({
        tableData: [
          mangaEntryFactory.build(
            { attributes: { title: 'Manga Title', last_released_at: null } }
          ),
        ],
      });

      await flushPromises();

      expect(mangaList.text()).toContain('Unknown');
    });

    it('Latest Chapter column shows no chapters', async () => {
      mangaList.setProps({
        tableData: [
          mangaEntryFactory.build(
            { links: { last_chapter_available_url: null } }
          ),
        ],
      });

      await flushPromises();

      expect(mangaList.text()).toContain('No chapters');
    });
  });

  describe(':props', () => {
    it(':tableData - sanitizes manga title to convert special characters', async () => {
      mangaList.setProps({
        tableData: [
          mangaEntryFactory.build({ attributes: { title: '&Uuml;bel Blatt' } }),
        ],
      });

      await flushPromises();

      expect(mangaList.find('.el-link--inner').text()).toContain('Übel Blatt');
    });
  });
});
