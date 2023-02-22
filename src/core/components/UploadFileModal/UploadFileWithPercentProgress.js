import { Stack } from '@fluentui/react';
import UploadFileProgress from 'core/components/UploadFileModal/UploadFileProgress';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FILE_UPLOAD_STATUS } from 'core/constants/Const';

const TIMER_COUNT_PERCENT = 150;

const VALUE_PERCENT_PLUS = 0.07;

export default function UploadFileWithPercentProgress(props) {
  const { file } = props;

  const [percent, setPercent] = useState(0);

  let timer;

  const _initProgress = () => {
    timer = setTimeout(() => {
      if (percent > 0.9) {
        clearTimeout(timer);
      } else {
        setPercent(parseFloat(percent.toFixed(2)) + VALUE_PERCENT_PLUS);
      }
    }, TIMER_COUNT_PERCENT);
  };

  useEffect(() => {
    if (file.status === FILE_UPLOAD_STATUS.LOADING) {
      _initProgress();
    } else {
      setPercent(0);
    }
  }, [file.status, percent]);

  useEffect(() => {
    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack
      horizontal
      verticalAlign="center"
      styles={{ root: { width: '100%', marginBottom: 16 } }}
      tokens={{ childrenGap: 10 }}
    >
      <Stack.Item style={{ width: '100%' }}>
        <UploadFileProgress
          {...props}
          file={file}
          barHeight={4}
          percentComplete={
            file.status === FILE_UPLOAD_STATUS.COMPLETED || file.status === FILE_UPLOAD_STATUS.FAILED ? 1 : percent
          }
        />
      </Stack.Item>
    </Stack>
  );
}

UploadFileWithPercentProgress.propTypes = {
  file: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
