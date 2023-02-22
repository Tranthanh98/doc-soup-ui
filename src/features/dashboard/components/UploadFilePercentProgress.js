import { Icon, Stack } from '@fluentui/react';
import UploadFileProgress from 'core/components/UploadFileModal/UploadFileProgress';
import { LIGHT_THEME } from 'core/constants/Theme';
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FILE_UPLOAD_STATUS } from 'core/constants/Const';
import AnalyticCircleProgress from 'features/shared/components/AnalyticCircleProgress';

const TIMER_COUNT_PERCENT = 100;
const VALUE_PLUS_PERCENT = 0.05;

const removeIconStyles = (props) => ({
  root: {
    color: props.theme.palette.neutralSecondaryAlt,
    cursor: 'pointer',
    ':hover': {
      color: 'inherit',
    },
    fontSize: 20,
  },
});

function UploadFilePercentProgress(props) {
  const { file, handleRemoveFile } = props;
  const [percent, setPercent] = useState(0);

  let timer;
  const _initProgress = () => {
    timer = setTimeout(() => {
      if (percent > 0.9) {
        clearTimeout(timer);
      } else {
        setPercent(parseFloat(percent.toFixed(2)) + VALUE_PLUS_PERCENT);
      }
    }, TIMER_COUNT_PERCENT);
  };

  useEffect(() => {
    if (!file.status || file.status === FILE_UPLOAD_STATUS.LOADING) {
      _initProgress();
    } else {
      setPercent(1);
    }
  }, [file.status, percent]);

  const valueCircleProgress = useMemo(() => {
    return parseInt(percent <= 1 ? (percent * 100).toFixed(0) : 0, 10);
  }, [percent]);

  useEffect(() => {
    return () => clearTimeout(timer);
  });

  return (
    <Stack
      horizontal
      verticalAlign="center"
      styles={{ root: { width: '100%', marginBottom: 16 } }}
      tokens={{ childrenGap: 10 }}
    >
      <Stack.Item style={{ width: '90%' }}>
        <UploadFileProgress {...props} file={file} barHeight={4} percentComplete={percent} isUploading={percent < 1} />
      </Stack.Item>
      <Stack
        horizontal
        horizontalAlign="center"
        verticalAlign="center"
        styles={{ root: { width: 32, height: 32, marginLeft: 16 } }}
      >
        {file.status === FILE_UPLOAD_STATUS.FAILED ? (
          <Icon iconName="Cancel" styles={removeIconStyles} onClick={() => handleRemoveFile(file)} />
        ) : (
          <AnalyticCircleProgress
            percent={valueCircleProgress}
            valueDisplay={valueCircleProgress}
            lineColor={percent >= 1 ? LIGHT_THEME.palette.greenLight : LIGHT_THEME.palette.themePrimary}
            width={32}
            height={32}
          />
        )}
      </Stack>
    </Stack>
  );
}

UploadFilePercentProgress.propTypes = {
  file: PropTypes.oneOfType([PropTypes.object]).isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  fileIndex: PropTypes.number.isRequired,
  updateFileStatus: PropTypes.func.isRequired,
};

export default React.memo(UploadFilePercentProgress);
