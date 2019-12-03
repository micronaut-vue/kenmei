import axios from 'axios';
import * as resource from '@/services/endpoints/MangaEntriesErrors';

describe('MangaEntriesErrors', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('postMangaEntriesErrors()', () => {
    it('makes a request to the resource and returns true', async () => {
      axios.post.mockResolvedValue({ status: 200 });

      const successful = await resource.postMangaEntriesErrors({ ids: ['1'] });

      expect(successful).toBeTruthy();
    });

    it('makes a request to the resource and returns false if failed', async () => {
      axios.post.mockRejectedValue({ status: 500 });

      const successful = await resource.postMangaEntriesErrors({ ids: [] });
      expect(successful).toBeFalsy();
    });
  });
});
