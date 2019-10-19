import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';

import MangaList from '@/components/TheMangaList.vue';
import lists from '@/store/modules/lists';
import mangaEntryFactory from '../factories/mangaEntry';

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
          state: lists.store,
        },
      },
    });
    mangaList = mount(MangaList, {
      store,
      localVue,
      sync: false,
      propsData: {
        tableData: [mangaEntryFactory.build()],
      },
    });
  });

  describe('@events', () => {
    it.skip('@handleSelectionChange - when selecting rows, emits seriesSelected', async () => {
      await flushPromises();

      mangaList.find('.el-checkbox').trigger('click');

      expect(mangaList.emitted('seriesSelected')).toBeTruthy();
    });
  });

  describe(':props', () => {
    it(':tableData - renders rows', async () => {
      await flushPromises();

      const table = mangaList.find('tbody');

      expect(table.html()).toMatchSnapshot();
    });

    it(':tableData - sanitizes manga title to convert special characters', async () => {
      mangaList.setProps({
        tableData: [
          mangaEntryFactory.build({ attributes: { title: '&Uuml;bel Blatt' } }),
        ],
      });

      await flushPromises();

      expect(mangaList.find('.el-link--inner').text()).toContain('Übel Blatt');
    });

    it(':tableData - shows Released at as Unknown if no latest chapters availiable', async () => {
      mangaList.setProps({
        tableData: [
          mangaEntryFactory.build(
            { links: { last_chapter_available_url: null } }
          ),
        ],
      });

      await flushPromises();

      expect(mangaList.find('.el-link--inner').text()).toContain('No chapters');
    });
  });
});
