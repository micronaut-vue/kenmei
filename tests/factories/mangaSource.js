import { Factory } from 'rosie';

export default new Factory()
  .sequence('id')
  .attr('manga_series_id', 1)
  .attr('name', 'MangaDex');
