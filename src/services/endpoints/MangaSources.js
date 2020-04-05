import { secure } from '@/modules/axios';

/* eslint-disable import/prefer-default-export */
export const getMangaSources = (mangaSeriesID) => secure
  .get('/api/v1/manga_sources', {
    params: { manga_source: { filter: { manga_series: mangaSeriesID } } },
  })
  .then((response) => response.data)
  .catch(() => false);
/* eslint-enable import/prefer-default-export */
