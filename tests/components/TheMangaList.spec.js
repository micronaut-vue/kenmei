import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

import MangaList from '@/components/TheMangaList.vue';

describe('TheMangaList.vue', () => {
  describe(':props', () => {
    let mangaList;

    beforeEach(() => {
      mangaList = mount(MangaList, {
        sync: false,
        propsData: {
          tableData: [
            {
              series: {
                title: 'Manga Title',
                url: 'series.example.url',
              },
              latestChapter: {
                url: 'chapter.example.url',
                info: {
                  chapter: '10',
                  title: 'Chapter Title',
                  timestamp: 1522299049,
                },
              },
            },
          ],
        },
      });
    });

    it(':tableData - renders rows', async () => {
      await flushPromises();

      const table = mangaList.find('tbody');

      expect(table.html()).toMatchSnapshot();
    });

    it(':tableData - sanitizes manga title to convert special characters', async () => {
      mangaList.setProps({
        tableData: [
          {
            series: {
              title: '&Uuml;bel Blatt',
              url: 'series.example.url',
            },
            latestChapter: {
              url: 'chapter.example.url',
              info: {
                chapter: '10',
                title: 'Chapter Title',
                timestamp: 1522299049,
              },
            },
          },
        ],
      });

      await flushPromises();

      expect(mangaList.find('.el-link--inner').text()).toContain('Übel Blatt');
    });
  });
});
