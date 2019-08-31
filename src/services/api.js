import axios from 'axios';

const sanitizeManga = (manga) => {
  const newManga = {};
  const { title, url, latestChapter } = manga;

  newManga.series = { title, url };
  newManga.latestChapter = latestChapter;

  return newManga;
};

// This can extract both the series and chapter, we want to make use of that
export const extractSeriesID = url => url.match(/(?!\/)\d+/g);

export const getManga = id => axios
  .get(`https://api.kenmei.co/api/v1/series/${id}`)
  .then((response) => {
    if (response.data.error) { return {}; }

    return sanitizeManga(response.data);
  });

export const getMangaBulk = ids => axios
  .post('https://api.kenmei.co/api/v1/series/bulk', { ids })
  .then((response) => {
    if (response.data.error) { return []; }

    return Object
      .values(response.data.successful)
      .map(manga => sanitizeManga(manga));
  });
