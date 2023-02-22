import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RestService from 'features/shared/services/restService';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import trackService from 'features/shared/services/trackService';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import PreviewFileFrameBiz from 'core/biz/PreviewFileFrameBiz';
import { Document, Page } from 'react-pdf';

const twoMinutes = 120000;

export default function PreviewFileFrame(props) {
  const { fileInfo, isFilePreview } = props;

  const [pageNumber, setPageNumber] = useState(1);

  const { viewerId, docId } = fileInfo;
  const { linkId } = useParams();
  const readSessionId = uuidv4();
  let pageDurationInfo = [0];

  let currentPageInfo = { pageIndex: 0, viewingStartDate: null };

  const _createWatermark = (streamdocs) => {
    if (fileInfo.watermark) {
      const watermark = JSON.parse(fileInfo.watermark);
      return streamdocs.watermark.create({
        watermarks: [
          {
            type: watermark.type,
            opacity: watermark.opacity,
            align: watermark.align,
            rotate: watermark.rotate,
            x: 0,
            y: 0,
            text: watermark.text,
            size: watermark.size,
            color: watermark.color,
            fontName: 'NanumMyeongjo',
          },
        ],
        temp: true,
      });
    }
    return undefined;
  };

  const downloadedFile = async () => {
    const clientInfo = await trackService.getTrackPayload();
    new RestService()
      .setPath(`/view-link/${linkId}/statistic/downloaded`)
      .setHeaders({
        'x-viewerId': viewerId,
        'x-deviceId': clientInfo.app.deviceId,
        'x-read-sessionId': readSessionId,
      })
      .put({})
      .then(() => {})
      .catch(() => {});
  };

  const onCollectLinkStatistic = async (nextPageIndex) => {
    const newPageDurationInfo = PreviewFileFrameBiz.calculateCurrentPageDuration(currentPageInfo, pageDurationInfo);
    if (newPageDurationInfo) {
      pageDurationInfo = newPageDurationInfo;
      currentPageInfo.viewingStartDate = new Date();
    }
    if (pageDurationInfo.length && !!readSessionId) {
      const data = pageDurationInfo.map((x, index) => ({
        page: index + 1,
        duration: x,
      }));
      const clientInfo = await trackService.getTrackPayload();
      new RestService()
        .setPath(`/view-link/${linkId}/statistic`)
        .setHeaders({
          'x-viewerId': viewerId,
          'x-deviceId': clientInfo.app.deviceId,
          'x-read-sessionId': readSessionId,
        })
        .post({
          data,
        })
        .then(() => {
          const newPageInfo = PreviewFileFrameBiz.startRecordingCurrentPageDuration(nextPageIndex, currentPageInfo);
          currentPageInfo = { ...newPageInfo };
        })
        .catch((err) => {
          restServiceHelper.handleError(err);
        });
    }
  };

  const _saveStatisticData = debounce(async (nextPageIndex) => {
    await onCollectLinkStatistic(nextPageIndex);
  }, 500);

  const onChangeCurrentPageIndex = async (pageIndex) => {
    await _saveStatisticData(pageIndex);
  };

  const initialPageDurationInfo = async (totalPages = 0) => {
    const initialData = PreviewFileFrameBiz.createInitialPageDurationInfo(totalPages);
    if (!initialData) {
      return;
    }

    pageDurationInfo = initialData;

    if (!isFilePreview) {
      await _saveStatisticData();
    }
  };

  const _openDocument = (streamdocs) => {
    if (!currentPageInfo.viewingStartDate) {
      currentPageInfo.viewingStartDate = new Date();
    }

    const streamdocsId = docId || fileInfo?.docId;
    streamdocs.document
      .open({ streamdocsId })
      .then(() => {
        streamdocs.document.getPageCount().then(async (pageInfo) => {
          await initialPageDurationInfo(pageInfo.pageCount);
        });
        return streamdocs.document.getPageCount();
      })
      .then(() => {
        return streamdocs.viewer.getCurrentPageIndex();
      })
      .then(async (result) => {
        if (!isFilePreview) {
          await onChangeCurrentPageIndex(result.currentPageIndex);
          streamdocs.addEventListener('currentPageIndexChange', async (event) => {
            await onChangeCurrentPageIndex(event.data.currentPageIndex);
          });
        }
      })
      .then(function () {
        console.log('Document opened.');
        streamdocs.addEventListener('documentDownload', function () {
          downloadedFile();
        });
        return _createWatermark(streamdocs);
      })
      .then(function () {
        console.log('Temporary watermark created.');
      })
      .catch(function (error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
      });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `${process.env.REACT_APP_EPAPYRUS_SERVICE_URL}/adapter.js`;
    script.async = true;
    script.onload = () => {
      const viewerElement = document.getElementById('viewer');
      // eslint-disable-next-line no-undef
      const streamdocs = new StreamDocs({
        element: viewerElement,
      });
      _openDocument(streamdocs);

      let lastActiveElement = document.activeElement;
      window.addEventListener('focus', () => {
        if (lastActiveElement === viewerElement) {
          return;
        }

        const newPageInfo = PreviewFileFrameBiz.startRecordingCurrentPageDuration(undefined, currentPageInfo);
        currentPageInfo = { ...newPageInfo };
        lastActiveElement = document.activeElement;
      });

      window.addEventListener('blur', () => {
        if (document.activeElement === viewerElement) {
          return;
        }

        const newPageDurationInfo = PreviewFileFrameBiz.calculateCurrentPageDuration(currentPageInfo, pageDurationInfo);
        if (newPageDurationInfo) {
          pageDurationInfo = newPageDurationInfo;
        }
        lastActiveElement = document.activeElement;
      });
    };

    document.body.appendChild(script);
    if (!isFilePreview) {
      setInterval(async () => {
        await _saveStatisticData(undefined);
      }, twoMinutes);
    }
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    // <iframe
    //   title="view document"
    //   id="viewer"
    //   src={`${process.env.REACT_APP_EPAPYRUS_SERVICE_URL}/view/sd`}
    //   style={{ width: '100%', height: '100vh', border: 0 }}
    // />
    <div>
      <Document file="somefile.pdf" onLoadSuccess={({ numPages }) => setPageNumber(numPages)}>
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
}
PreviewFileFrame.propTypes = {
  docId: PropTypes.string,
  isFilePreview: PropTypes.bool,
  fileInfo: PropTypes.oneOfType([PropTypes.object]),
};
PreviewFileFrame.defaultProps = {
  docId: undefined,
  isFilePreview: false,
  fileInfo: {},
};
