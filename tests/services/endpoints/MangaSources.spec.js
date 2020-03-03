import axios from 'axios';
import * as resource from '@/services/endpoints/MangaSources';

import mangaSourceFactory from '../../factories/mangaSource';

describe('MangaSources', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getMangaSources()', () => {
    it('makes a request to the resource and returns data', async () => {
      const getMangaSourcesSpy = jest.spyOn(axios, 'get');
      const data = mangaSourceFactory.build();

      getMangaSourcesSpy.mockResolvedValue({ status: 200, data });

      const successful = await resource.getMangaSources(1);

      expect(successful).toEqual(data);
      expect(getMangaSourcesSpy).toHaveBeenCalledWith(
        '/api/v1/manga_sources',
        { params: { manga_source: { filter: { manga_series: 1 } } } }
      );
    });

    it('makes a request to the resource and returns false if failed', async () => {
      axios.get.mockRejectedValue({ status: 500 });

      const successful = await resource.getMangaSources(['a']);
      expect(successful).toBeFalsy();
    });
  });
});
