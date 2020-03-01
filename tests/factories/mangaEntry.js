import { Factory } from 'rosie';

export default new Factory()
  .sequence('id')
  .attr('type', 'manga_entry')
  .attr('attributes', {
    title: 'Manga Title',
    last_chapter_read: '1',
    last_chapter_available: '2',
    last_released_at: '2019-01-01T00:00:00.000Z',
  })
  .attr('links', {
    series_url: 'example.url/manga/1',
    last_chapter_read_url: 'example.url/chapter/1',
    last_chapter_available_url: 'example.url/chapter/2',
  })
  .attr('relationships', {
    manga_list: {
      data: {
        id: '1',
        type: 'manga_list',
      },
    },
  });
