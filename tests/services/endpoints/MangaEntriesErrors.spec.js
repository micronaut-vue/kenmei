import axios from 'axios';
import * as resource from '@/services/endpoints/MangaEntriesErrors';

describe('MangaEntriesErrors', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('postMangaEntriesErrors()', () => {
    it('makes a request to the resource and returns true', async () => {
      const reportMangaEntriesMock = jest.spyOn(axios, 'post');

      reportMangaEntriesMock.mockResolvedValue({ status: 200 });

      const successful = await resource.postMangaEntriesErrors(['1'], 0);

      expect(successful).toBeTruthy();
      expect(reportMangaEntriesMock).toHaveBeenCalledWith(
        '/api/v1/manga_entries_errors/',
        { ids: ['1'], issue_id: 0 }
      );
    });

    it('makes a request to the resource and returns false if failed', async () => {
      axios.post.mockRejectedValue({ status: 500 });

      const successful = await resource.postMangaEntriesErrors([], 0);
      expect(successful).toBeFalsy();
    });
  });
});
