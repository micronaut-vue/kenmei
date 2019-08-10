import Importer from '@/services/importer';

describe('Importer', () => {
  it('filters list to return MangaDex IDs', () => {
    const list = {
      series: {
        reading: {
          manga: [{
            full_title_url: 'https://mangadex.org/manga/24121',
            site_data: {
              site: 'mangadex.org',
            },
          }, {
            full_title_url: 'https://mangarock.example.test',
            site_data: {
              site: 'mangarock.org',
            },
          }],
        },
      },
    };

    expect(Importer(list)).toEqual(['24121']);
  });
});
