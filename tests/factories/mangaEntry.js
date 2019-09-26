import { Factory } from 'rosie';

export default new Factory()
  .attr('title', 'Manga Title')
  .attr('url', 'series.example.url')
  .attr('latestChapter', {
    url: 'chapter.example.url',
    info: {
      chapter: '10',
      title: 'Chapter Title',
      timestamp: 1522299049,
    },
  });
