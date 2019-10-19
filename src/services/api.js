import { secure } from '@/modules/axios';

// This can extract both the series and chapter, we want to make use of that
export const extractSeriesID = url => url.match(/(?!\/)\d+/g)[0];

export const addMangaEntry = (seriesURL, mangaListID) => secure
  .post('/api/v1/manga_entries/', {
    manga_entry: {
      series_url: seriesURL,
      manga_list_id: mangaListID,
    },
  })
  .then((response) => {
    if (response.data.error) { return {}; }

    return response.data;
  });

export const deleteMangaEntry = seriesID => secure
  .delete(`/api/v1/manga_entries/${seriesID}`)
  .then(_response => true)
  .catch(_request => false);

export const addMangaEntries = urls => secure
  .post('/api/v1/manga_entries/bulk', { urls })
  .then((response) => {
    if (response.data.error) { return []; }

    return response.data;
  });
