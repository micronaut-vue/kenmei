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
        tableData: mangaEntryFactory.buildList(1),
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
    it(':tableData - renders rows', async () => {
      await flushPromises();

      const table = mangaList.find('tbody');

      expect(table.html()).toMatchSnapshot();
    });

    // TODO: Can't get ElementUI table to trigger sorting on click
    // When I figure that out, update this test to actually work
    it.skip(':tableData - sorting Released at shows Unknown last', async () => {
      mangaList.setProps({
        tableData: [
          mangaEntryFactory.build(
            {
              attributes: { title: 'Manga Title Last', last_released_at: null },
            }
          ),
          mangaEntryFactory.build(
            {
              attributes: {
                title: 'Manga Title Middle',
                last_released_at: '2019-01-01T00:00:00.000Z',
              },
            }
          ),
          mangaEntryFactory.build(
            {
              attributes: {
                title: 'Manga Title First',
                last_released_at: '2019-01-10T00:00:00.000Z',
              },
            }
          ),
        ],
      });

      await flushPromises();

      const releasedAt = mangaList.find('.el-table_1_column_5').find('.cell');
      const tableRows  = mangaList.findAll('.el-table__row');

      releasedAt.trigger('click');

      expect(tableRows.at(0).text()).toContain('10 months ago');
      expect(tableRows.at(2).text()).toContain('Unknown');

      releasedAt.trigger('click');

      expect(tableRows.at(0).text()).toContain('Unknown');
      expect(tableRows.at(2).text()).toContain('10 months ago');
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
  });
});
