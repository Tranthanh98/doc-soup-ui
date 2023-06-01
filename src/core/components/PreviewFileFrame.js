import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RestService from 'features/shared/services/restService';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import trackService from 'features/shared/services/trackService';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import PreviewFileFrameBiz from 'core/biz/PreviewFileFrameBiz';
import { Document, Page } from 'react-pdf';
import GlobalContext from 'security/GlobalContext';
import { LoadingPage } from 'features/shared/components';
import PdfViewerComponent from './PdfViewerComponent';

const twoMinutes = 120000;

export default function PreviewFileFrame(props) {
  const { fileInfo, isFilePreview } = props;

  const [contentData, setContentData] = useState(null);

  const context = useContext(GlobalContext);

  const { fileId, docId } = fileInfo;
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

  const _openDocument = () => {
    const { getToken } = context;

    new RestService()
      .setPath(`file/${fileId}/download`)
      .setToken(getToken())
      .setResponseType('arraybuffer')
      .get()
      .then((response) => {
        const URL = window.URL || window.webkitURL;
        const type = response.headers['content-type'];
        const url = URL.createObjectURL(new Blob([response.data], { type, encoding: 'UTF-8' }));
        console.log('data:', url);
        setContentData(url);
      })
      .catch((err) => {
        window.alert('Download file failed: ', err.message);
      });
  };

  useEffect(() => {
    _openDocument();
  }, []);

  return (
    <iframe
      title="view document"
      id="viewer"
      src={`${process.env.REACT_APP_EPAPYRUS_SERVICE_URL}/view/sd`}
      style={{ width: '100%', height: '100vh', border: 0 }}
    />
    // <div>
    //   <Document file="somefile.pdf" onLoadSuccess={({ numPages }) => setPageNumber(numPages)}>
    //     <Page pageNumber={pageNumber} />
    //   </Document>
    // </div>
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
