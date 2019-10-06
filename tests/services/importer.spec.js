import mangaList from '../fixtures/mangalist';
import filteredList from '../fixtures/mangaListTitleChapter';
import * as Importer from '@/services/importer';

describe('Importer', () => {
  describe('processList', () => {
    it('filters Trackr list into API ready object with MangaDex only entries', () => {
      const filtered = Importer.processList(mangaList);

      expect(Object.keys(filtered)).toEqual(
        ['Reading', 'On-Hold', 'Plan to Read']
      );
      // TODO: Test only MangaDex is being returned
    });
  });

  describe('sliceIntoBatches', () => {
    it('slices lists into chunks of 20', () => {
      const response = Importer.sliceIntoBatches(filteredList);

      expect(response).toHaveLength(2);
      expect(response[0].reading).toHaveLength(20);
      expect(response[1].reading).toHaveLength(2);
    });
  });
});
