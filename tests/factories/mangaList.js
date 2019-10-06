import { Factory } from 'rosie';

export default new Factory()
  .attr('id', '1')
  .attr('type', 'manga_list')
  .attr('attributes', {
    id: 1,
    name: 'Reading',
  })
  .attr('relationships', {
    manga_entries: {
      data: {
        id: '1',
        type: 'manga_entry',
      },
    },
  });
