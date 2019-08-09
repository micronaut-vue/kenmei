import axios from 'axios';

// This can extract both the series and chapter, we want to make use of that
export const extractSeriesID = url => url.match(/(?<=\/)\d+/g);

export const getManga = id => axios
  .get(`https://api.kenmei.co/api/v1/series/${id}`)
  .then((response) => {
    if (response.data.error) { return {}; }

    const newManga = {};
    const { title, url, latestChapter } = response.data;

    newManga.series = { title, url };
    newManga.latestChapter = latestChapter;

    return newManga;
  });

export const getAllManga = () => {};
