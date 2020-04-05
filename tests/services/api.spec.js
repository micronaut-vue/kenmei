import axios from 'axios';
import * as apiService from '@/services/api';

import mangaEntryFactory from '../factories/mangaEntry';

describe('API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('addMangaEntry()', () => {
    it('makes a request to the API and returns manga if found', async () => {
      const mangaURL = 'example.url/123';
      const mangaListID = 1;
      const mockData = mangaEntryFactory.build();

      axios.post.mockResolvedValue({ status: 200, data: mockData });

      const data = await apiService.addMangaEntry(mangaURL, mangaListID);
      expect(data).toEqual(mockData);
    });

    it('makes a request to the API and returns not_found status if series not found', async () => {
      const mangaURL = 'example.url/invalidURL';
      const mangaListID = 1;
      axios.post.mockResolvedValue({ status: 404, data: {} });

      const data = await apiService.addMangaEntry(mangaURL, mangaListID);
      expect(data).toEqual({});
    });
  });

  describe('updateMangaEntry()', () => {
    let mangaEntry;
    let attributes;

    beforeEach(() => {
      mangaEntry = mangaEntryFactory.build();
      attributes = {
        last_chapter_read: mangaEntry.attributes.last_chapter_available,
        last_chapter_read_url: mangaEntry.links.last_chapter_available_url,
      };
    });

    afterEach(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `/api/v1/manga_entries/${mangaEntry.id}`,
        { manga_entry: attributes }
      );
    });

    it('makes a request to the API and returns updated entry if found', async () => {
      axios.put.mockResolvedValue({ status: 200, data: { data: mangaEntry } });

      const data = await apiService.updateMangaEntry(mangaEntry.id, attributes);
      expect(data).toEqual(mangaEntry);
    });

    it('makes a request to the API and returns false if entry not found', async () => {
      axios.put.mockResolvedValue({ status: 404, data: { error: 'error' } });

      const data = await apiService.updateMangaEntry(mangaEntry.id, attributes);
      expect(data).toEqual(false);
    });

    it('makes a request to the API and returns false if API fails', async () => {
      axios.put.mockRejectedValue({ response: { data: 'Things happened' } });

      const data = await apiService.updateMangaEntry(mangaEntry.id, attributes);
      expect(data).toEqual(false);
    });
  });

  describe('bulkUpdateMangaEntry()', () => {
    let mangaEntries;
    let ids;
    let attributes;

    beforeEach(() => {
      mangaEntries = mangaEntryFactory.buildList(2);
      ids = mangaEntries.map((entry) => entry.id);
      attributes = {
        last_chapter_read: mangaEntries[0].attributes.last_chapter_available,
        last_chapter_read_url: mangaEntries[0].links.last_chapter_available_url,
      };
    });

    afterEach(() => {
      expect(axios.put).toHaveBeenCalledWith(
        '/api/v1/manga_entries/bulk_update',
        { ids, manga_entry: attributes }
      );
    });

    it('makes a request to the API and returns updated entries if found', async () => {
      axios.put.mockResolvedValue({ status: 200, data: { data: mangaEntries } });

      const data = await apiService.bulkUpdateMangaEntry(ids, attributes);
      expect(data).toEqual(mangaEntries);
    });

    it('makes a request to the API and returns false if entry not found', async () => {
      axios.put.mockResolvedValue({ status: 404, data: { error: 'error' } });

      const data = await apiService.bulkUpdateMangaEntry(ids, attributes);
      expect(data).toEqual(false);
    });

    it('makes a request to the API and returns false if API fails', async () => {
      axios.put.mockRejectedValue({ response: { data: 'Things happened' } });

      const response = await apiService.bulkUpdateMangaEntry(ids, attributes);
      expect(response).toEqual(false);
    });
  });

  describe('bulkDeleteMangaEntries()', () => {
    let ids;

    beforeEach(() => {
      ids = [1, 2];
    });

    afterEach(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        '/api/v1/manga_entries/bulk_destroy',
        { data: { ids } }
      );
    });

    it('makes a request to the API and returns true on success', async () => {
      axios.delete.mockResolvedValue();

      const data = await apiService.bulkDeleteMangaEntries(ids);
      expect(data).toBeTruthy();
    });

    it('makes a request to the API and returns false if request failed', async () => {
      const mockResponse = {
        response: { data: { error: 'Can only delete own entry' } },
      };

      axios.delete.mockRejectedValue(mockResponse);

      const data = await apiService.bulkDeleteMangaEntries(ids);
      expect(data).toBeFalsy();
    });
  });
});
