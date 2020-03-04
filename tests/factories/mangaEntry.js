import { Factory } from 'rosie';

export default new Factory()
  .sequence('id')
  .attr('manga_source_id', 1)
  .attr('manga_list_id', 1)
  .attr('attributes', {
    title: 'Manga Title',
    last_chapter_read: '1',
    last_chapter_available: '2',
    last_released_at: '2019-01-01T00:00:00.000Z',
    available_sources: [
      {
        id: 1,
        manga_series_id: 1,
        name: 'MangaDex',
      },
    ],
  })
  .attr('links', {
    series_url: 'example.url/manga/1',
    last_chapter_read_url: 'example.url/chapter/1',
    last_chapter_available_url: 'example.url/chapter/2',
  });
