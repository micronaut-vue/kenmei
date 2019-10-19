import axios from 'axios';
import * as apiService from '@/services/api';

import mangaEntryFactory from '../factories/mangaEntry';

describe('API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('extractSeriesID()', () => {
    it('extracts an ID from a MangaDex series or chapter URL', () => {
      expect(
        apiService.extractSeriesID('https://mangadex.org/chapter/671525')
      ).toEqual('671525');
      expect(
        apiService.extractSeriesID('https://mangadex.org/title/65')
      ).toEqual('65');
    });
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

  describe('deleteMangaEntry()', () => {
    it('makes a request to the API and returns true on success', async () => {
      const axiosSpy = jest.spyOn(axios, 'delete');

      axiosSpy.mockResolvedValue();

      const data = await apiService.deleteMangaEntry(1);
      expect(axiosSpy).toHaveBeenCalledWith('/api/v1/manga_entries/1');
      expect(data).toBeTruthy();
    });

    it('makes a request to the API and returns not_found status if series not found', async () => {
      const axiosSpy     = jest.spyOn(axios, 'delete');
      const mockResponse = {
        response: { data: { error: 'Can only delete own entry' } },
      };

      axiosSpy.mockRejectedValue(mockResponse);

      const data = await apiService.deleteMangaEntry(1);
      expect(axiosSpy).toHaveBeenCalledWith('/api/v1/manga_entries/1');
      expect(data).not.toBeTruthy();
    });
  });

  describe('addMangaEntries()', () => {
    it('makes a request to the API bulk endpoint and returns new entries', async () => {
      const mockData = {
        successful: {
          1: mangaEntryFactory.build(),
          2: mangaEntryFactory.build(),
        },
        failed: ['3'],
      };

      axios.post.mockResolvedValue({ status: 200, data: mockData });

      const data = await apiService.addMangaEntries(
        'example.url/manga/1 example.url/manga/2'
      );

      expect(data).toEqual(mockData);
    });

    it('makes a request to the API and returns empty object if not found', async () => {
      axios.post.mockResolvedValue({
        status: 200, data: { error: 'not_found' },
      });

      const data = await apiService.addMangaEntries(
        'example.url/manga/1 example.url/manga/2'
      );
      expect(data).toEqual([]);
    });
  });
});
