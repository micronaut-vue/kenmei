import sortBy from '@/services/sorters';

import mangaEntryFactory from '../factories/mangaEntry';

describe('Sorters', () => {
  let entry1;
  let entry2;
  let entry3;

  beforeEach(() => {
    entry1 = mangaEntryFactory.build(
      {
        attributes: {
          title: 'a',
          last_released_at: '2019-01-10T00:00:00.000Z',
        },
        links: {
          last_chapter_read_url: 'example.url/manga/1/chapter/1',
          last_chapter_available_url: 'example.url/manga/1/chapter/2',
        },
      }
    );
    entry2 = mangaEntryFactory.build(
      {
        attributes: {
          title: 'b',
          last_released_at: '2019-01-01T00:00:00.000Z',
        },
        links: {
          last_chapter_read_url: 'example.url/manga/1/chapter/3',
          last_chapter_available_url: 'example.url/manga/1/chapter/4',
        },
      }
    );
    entry3 = mangaEntryFactory.build(
      {
        attributes: {
          title: 'C',
          last_released_at: null,
        },
        links: {
          last_chapter_read_url: 'example.url/manga/1/chapter/5',
          last_chapter_available_url: 'example.url/manga/1/chapter/5',
        },
      }
    );
  });
  describe('sortBy', () => {
    it('sorts by title', () => {
      const sorted = sortBy(
        [entry2, entry1, entry3], 'attributes.title', 'ascending'
      );

      expect(sorted[0]).toBe(entry1);
      expect(sorted[1]).toBe(entry2);
      expect(sorted[2]).toBe(entry3);
    });

    it('sorts by last released at, with entries without a timestamp last', () => {
      const sorted = sortBy(
        [entry2, entry1, entry3], 'attributes.last_released_at', 'ascending'
      );

      expect(sorted[0]).toBe(entry1);
      expect(sorted[1]).toBe(entry2);
      expect(sorted[2]).toBe(entry3);
    });

    it('sorts by newly released, ordered by released at', () => {
      const sorted = sortBy(
        [entry2, entry1, entry3], 'newReleases', 'ascending'
      );

      expect(sorted[0]).toBe(entry1);
      expect(sorted[1]).toBe(entry2);
      expect(sorted[2]).toBe(entry3);
    });
  });
});
