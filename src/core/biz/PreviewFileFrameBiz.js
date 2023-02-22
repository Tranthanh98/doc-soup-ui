class PreviewFileFrameBiz {
  startRecordingCurrentPageDuration = (newPageIndex, currentPageInfo) => {
    const result = { ...currentPageInfo };
    if (newPageIndex !== undefined) {
      result.pageIndex = newPageIndex;
    }

    result.viewingStartDate = new Date();

    return result;
  };

  calculateCurrentPageDuration = (currentPageInfo, pageDurationInfo = []) => {
    const result = pageDurationInfo;
    if (currentPageInfo.pageIndex === null) {
      return null;
    }

    if (!currentPageInfo.viewingStartDate) {
      return result;
    }

    const duration = Number(new Date()) - Number(currentPageInfo.viewingStartDate);

    result[currentPageInfo.pageIndex] += duration;

    return result;
  };

  createInitialPageDurationInfo = (totalPages) => {
    if (!totalPages) {
      return null;
    }

    const arrayNumber = Array.from(Array(totalPages).keys());

    const initialData = arrayNumber.map(() => 0);

    return initialData;
  };
}

export default new PreviewFileFrameBiz();
