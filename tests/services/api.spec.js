import axios from 'axios';
import * as apiService from '@/services/api';

jest.mock('axios');

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
    it('makes a request to the API and returns manga if found', () => {
      const mockData = {
        title: 'Manga Title',
        url: 'series.example.url',
        latestChapter: {
          url: 'chapter.example.url',
          info: {
            chapter: '10',
            title: 'Chapter Title',
            timestamp: 1522299049,
          },
        },
      };

      axios.get.mockImplementationOnce(
        () => Promise.resolve({ status: 200, data: mockData })
      );

      apiService.getManga('123').then((data) => {
        expect(data).toEqual(
          {
            series: { title: mockData.title, url: mockData.url },
            latestChapter: mockData.latestChapter,
          }
        );
      });
    });

    it('makes a request to the API and returns empty object if not found', () => {
      axios.get.mockImplementationOnce(
        () => Promise.resolve({ status: 200, data: { error: 'not_found' } })
      );

      apiService.getManga('123').then((data) => {
        expect(data).toEqual({});
      });
    });
  });
});
