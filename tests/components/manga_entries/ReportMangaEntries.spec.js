import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import ReportMangaEntries from '@/components/manga_entries/ReportMangaEntries.vue';
import * as mangaEntriesErrors from '@/services/endpoints/MangaEntriesErrors';

import mangaEntryFactory from '../../factories/mangaEntry';

describe('ReportMangaEntries.vue', () => {
  let reportMangaEntries;
  let postMangaEntriesErrorsMock;

  beforeEach(() => {
    reportMangaEntries = shallowMount(ReportMangaEntries, {
      data() {
        return {
          currentIssue: 0,
        };
      },
      propsData: {
        selectedEntries: [mangaEntryFactory.build({ id: 1 })],
      },
    });
  });

  it('shows correct helper text depending on issue type', async () => {
    expect(reportMangaEntries.text()).toContain('outdated or incorrect');

    reportMangaEntries.setData({ currentIssue: 1 });

    await nextTick();

    expect(reportMangaEntries.text()).toContain('manga titles are duplicated');
  });

  it('disables submit button if only one entry selected for duplicated report', async () => {
    const button = reportMangaEntries.find({ ref: 'reportEntriesButton' });
    reportMangaEntries.setData({ currentIssue: 1 });

    await nextTick();

    expect(button.attributes('disabled')).toBeTruthy();

    reportMangaEntries.setProps({
      selectedEntries: mangaEntryFactory.buildList(2),
    });

    await nextTick();

    expect(button.attributes('disabled')).toBeFalsy();
  });

  describe('when reporting issues', () => {
    beforeEach(() => {
      postMangaEntriesErrorsMock = jest.spyOn(
        mangaEntriesErrors, 'postMangaEntriesErrors'
      );
    });

    afterEach(() => {
      expect(postMangaEntriesErrorsMock).toHaveBeenCalledWith([1], 0);
    });

    describe('and report was successful', () => {
      it('shows successful message', async () => {
        const infoMessageMock = jest.spyOn(Message, 'success');

        postMangaEntriesErrorsMock.mockResolvedValue(true);

        reportMangaEntries.vm.report();

        await flushPromises();

        expect(reportMangaEntries.emitted('closeDialog')).toBeTruthy();
        expect(infoMessageMock).toHaveBeenCalledWith(
          'Issue reported successfully'
        );
      });
    });

    describe('and report was unsuccessful', () => {
      it('shows failure message', async () => {
        const errorMessageMock = jest.spyOn(Message, 'error');

        postMangaEntriesErrorsMock.mockResolvedValue(false);

        reportMangaEntries.vm.report();

        await flushPromises();

        expect(errorMessageMock).toHaveBeenCalledWith(
          'Failed to report. Try reloading the page before trying again'
        );
      });
    });
  });
});
