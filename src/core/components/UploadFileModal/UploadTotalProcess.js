import React from 'react';
import PropTypes from 'prop-types';
import { Stack, ProgressIndicator } from '@fluentui/react';
import { CustomText } from 'features/shared/components';

export default function UploadTotalProcess(props) {
  const { isMobile, isHasFile, totalFileSize, percent } = props;

  const totalSize = parseFloat(totalFileSize.replaceAll('MB', ''));
  return (
    <ProgressIndicator
      label={
        isHasFile ? (
          <Stack horizontal horizontalAlign="space-between">
            <CustomText color="textSecondary">
              {parseFloat((totalSize * percent).toFixed(1))} MB of {totalFileSize}
            </CustomText>

            <CustomText color="textSecondary">{parseFloat((percent * 100).toFixed(0))}%</CustomText>
          </Stack>
        ) : (
          <CustomText color="textSecondary">No files</CustomText>
        )
      }
      barHeight={4}
      percentComplete={percent}
      styles={({ theme }) => ({
        root: {
          position: 'relative',
          width: isMobile ? 'calc(100vw - 45px)' : 340,
          marginBottom: isMobile ? 12 : 0,
        },
        itemName: { padding: 'none' },
        itemProgress: { padding: '20px 0 4px 0' },
        progressTrack: {
          backgroundColor: theme.palette.neutralQuaternaryAlt,
          borderRadius: 10,
        },
      })}
    />
  );
}
UploadTotalProcess.propTypes = {
  isHasFile: PropTypes.bool.isRequired,
  totalFileSize: PropTypes.string.isRequired,
  percent: PropTypes.number,
  isMobile: PropTypes.bool.isRequired,
};

UploadTotalProcess.defaultProps = {
  percent: 0,
};
