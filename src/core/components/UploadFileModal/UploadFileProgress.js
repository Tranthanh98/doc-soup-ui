import React from 'react';
import PropTypes from 'prop-types';
import { ThemeContext, Stack, ProgressIndicator, Icon, Text, Separator } from '@fluentui/react';
import { FILE_UPLOAD_STATUS } from 'core/constants/Const';
import FileBiz from 'core/biz/FileBiz';

const iconFileStyles = (props) => ({
  root: {
    width: 48,
    color: props.theme.palette.themePrimary,
    marginRight: props.theme.spacing.m,
  },
});
const fileNameStyles = (theme) => ({
  root: {
    marginRight: theme.spacing.s1,
    maxWidth: 210,
    overflow: 'hidden',
  },
});
const subTextStyles = (theme) => ({
  root: {
    color: theme.palette.neutralSecondaryAlt,
  },
});
const messageStyles = (theme, status) => {
  if (status === FILE_UPLOAD_STATUS.FAILED) {
    return {
      root: {
        color: theme.palette.red,
      },
    };
  }
  if (status === FILE_UPLOAD_STATUS.COMPLETED) {
    return {
      root: {
        color: theme.palette.green,
      },
    };
  }
  return {
    root: {
      color: theme.palette.neutralSecondaryAlt,
    },
  };
};
const removeIconStyles = (props) => ({
  root: {
    fontSize: 12,
    color: props.theme.palette.neutralQuaternary,
    cursor: 'pointer',
    ':hover': {
      color: 'inherit',
    },
  },
});

const getBackgroundColorBar = (theme, status) => {
  switch (status) {
    case FILE_UPLOAD_STATUS.FAILED:
      return theme.palette.red;
    case FILE_UPLOAD_STATUS.COMPLETED:
      return theme.palette.greenLight;
    default:
      return theme.palette.themePrimary;
  }
};

const progressStyles = (theme, status) => ({
  progressTrack: {
    borderRadius: 10,
  },
  progressBar: {
    borderRadius: 10,
    backgroundColor: getBackgroundColorBar(theme, status),
  },
  itemName: {
    width: '100%',
  },
});

const separatorStyles = (props) => ({
  root: {
    marginTop: 5,
    marginBottom: 10,
    selectors: {
      '&::before': {
        backgroundColor: props.theme.palette.neutralQuaternaryAlt,
        opacity: 0.5,
      },
    },
  },
});

const _getUploadSpeed = (file) => {
  const value = Math.floor(Math.random() * (5 - 1)) + 1;
  const speed = file.size / value + Math.random() * 1000000;
  return `${FileBiz.formatSize(speed)}/sec`;
};

export default function UploadFileProgress(props) {
  const { file, isUploading, onRemoveFile, fileIndex, barHeight, percentComplete } = props;

  const _renderRightCorner = () => {
    if (file.status === FILE_UPLOAD_STATUS.LOADING) {
      return _getUploadSpeed(file);
    }
    return file.message;
  };

  // eslint-disable-next-line react/no-multi-comp
  const _getPercent = (theme) => {
    if (typeof file.status === 'undefined') {
      return null;
    }
    if (file.status === FILE_UPLOAD_STATUS.FAILED) {
      return <Text styles={subTextStyles(theme)}>0%</Text>;
    }

    return <Text styles={subTextStyles(theme)}>{Math.floor(percentComplete * 100)}%</Text>;
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <>
          <Stack horizontal verticalAlign="center">
            <Stack>
              <Icon iconName="pdf-svg" styles={iconFileStyles} />
            </Stack>
            <Stack.Item grow>
              <ProgressIndicator
                label={
                  <Stack horizontal horizontalAlign="space-between" verticalAlign="end" tokens={{ childrenGap: 8 }}>
                    <Stack horizontal>
                      <Text block styles={fileNameStyles(theme)}>
                        {file.name}
                      </Text>
                      <Text styles={subTextStyles(theme)}>{file.formattedSize}</Text>
                    </Stack>
                    {onRemoveFile ? (
                      <Icon
                        iconName="Cancel"
                        styles={removeIconStyles}
                        onClick={() => {
                          if (!isUploading) {
                            onRemoveFile(fileIndex);
                          }
                        }}
                      />
                    ) : null}
                  </Stack>
                }
                description={
                  <Stack horizontal horizontalAlign="space-between">
                    {_getPercent(theme)}
                    <Text styles={messageStyles(theme, file.status)}>{_renderRightCorner()}</Text>
                  </Stack>
                }
                barHeight={barHeight}
                percentComplete={percentComplete}
                styles={progressStyles(theme, file.status)}
              />
            </Stack.Item>
          </Stack>
          {onRemoveFile ? <Separator horizontal styles={separatorStyles} /> : null}
        </>
      )}
    </ThemeContext.Consumer>
  );
}
UploadFileProgress.propTypes = {
  file: PropTypes.instanceOf(Object).isRequired,
  onRemoveFile: PropTypes.func,
  isUploading: PropTypes.bool.isRequired,
  fileIndex: PropTypes.number.isRequired,
  percentComplete: PropTypes.number,
  barHeight: PropTypes.number,
};

UploadFileProgress.defaultProps = {
  barHeight: 0,
  percentComplete: undefined,
  onRemoveFile: undefined,
};
