import axios from 'axios';
import * as apiService from '@/services/api';

import mangaEntryFactory from '../factories/mangaEntry';

describe('API', () => {
  describe('extractSeriesID()', () => {
    it('extracts an ID from a MangaDex series or chapter URL', () => {
      expect(
        apiService.extractSeriesID('https://mangadex.org/chapter/671525')
      ).toEqual(['671525']);
      expect(
        apiService.extractSeriesID('https://mangadex.org/title/65')
      ).toEqual(['65']);
    });
  });

  describe('getManga()', () => {
    it('makes a request to the API and returns manga if found', async () => {
      const mockData = mangaEntryFactory.build();

      axios.get.mockResolvedValue({ status: 200, data: mockData });

      const data = await apiService.getManga('123');
      expect(data).toEqual(
        {
          series: { title: mockData.title, url: mockData.url },
          latestChapter: mockData.latestChapter,
        }
      );
    });

    it('makes a request to the API and returns empty object if not found', async () => {
      axios.get.mockResolvedValue({
        status: 200, data: { error: 'not_found' }
      });

      const data = await apiService.getManga('123');
      expect(data).toEqual({});
    });
  });

  describe('getMangaBulk()', () => {
    it('makes a request to the API bulk endpoint and delegate to sanitizeManga', async () => {
      const mockData = {
        successful: {
          1: mangaEntryFactory.build(),
          2: mangaEntryFactory.build(),
        },
        failed: ['3'],
      };

      axios.post.mockResolvedValue({ status: 200, data: mockData });

      const data = await apiService.getMangaBulk('1 2 3');
      expect(data.length).toEqual(2);
    });

    it('makes a request to the API and returns empty object if not found', async () => {
      axios.post.mockResolvedValue({
        status: 200, data: { error: 'not_found' },
      });

      const data = await apiService.getMangaBulk('1 2 3');
      expect(data).toEqual([]);
    });
  });
});
