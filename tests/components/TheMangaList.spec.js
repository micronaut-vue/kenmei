import { mount } from '@vue/test-utils';
import MangaList from '@/components/TheMangaList.vue';

describe('TheMangaList.vue', () => {
  describe(':props', () => {
    let mangaList;

    beforeEach(() => {
      mangaList = mount(MangaList, {
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

    it(':tableData - renders rows', () => {
      const table = mangaList.find('tbody');

      expect(table.html()).toMatchSnapshot();
    });
  });
});
