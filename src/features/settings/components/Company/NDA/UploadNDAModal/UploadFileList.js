import React from 'react';
import PropTypes from 'prop-types';
import { ThemeContext, Stack, Icon, Text, Separator, FontWeights } from '@fluentui/react';
import { FILE_UPLOAD_STATUS } from 'core/constants/Const';

const iconFileStyles = (props) => ({
  root: {
    width: 24,
    color: props.theme.palette.themePrimary,
    marginRight: props.theme.spacing.s1,
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
    marginRight: props.theme.spacing.m,
    color: props.theme.palette.neutralSecondaryAlt,
    cursor: 'pointer',
    ':hover': {
      color: 'inherit',
    },
  },
});
const listHeaderStyles = (theme) => ({
  root: {
    color: theme.palette.neutralSecondaryAlt,
    fontWeight: FontWeights.semibold,
  },
});

export default function UploadFileList(props) {
  const { files, isUploading, onRemoveFile } = props;
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <>
          <Stack horizontal horizontalAlign="space-between">
            <Stack.Item grow={8}>
              <Text variant="smallPlus" styles={listHeaderStyles(theme)}>
                File Name
              </Text>
            </Stack.Item>
            <Stack.Item grow={2}>
              <Text variant="smallPlus" styles={listHeaderStyles(theme)}>
                Size
              </Text>
            </Stack.Item>
          </Stack>
          {files.map((file, index) => (
            <React.Fragment key={index}>
              <Separator horizontal styles={{ root: { padding: 0 } }} />
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center" tokens={{ childrenGap: 16 }}>
                <Stack grow={8} horizontal verticalAlign="center">
                  <Icon iconName="pdf-svg" styles={iconFileStyles} />
                  <Text>{file.name}</Text>
                </Stack>
                <Stack
                  grow={2}
                  horizontal
                  horizontalAlign="space-between"
                  verticalAlign="center"
                  tokens={{ childrenGap: 8 }}
                >
                  <Text>{file.formattedSize}</Text>
                  <Icon
                    iconName="Cancel"
                    styles={removeIconStyles}
                    onClick={() => !isUploading && onRemoveFile(file.name)}
                  />
                </Stack>
              </Stack>
              <Stack horizontal horizontalAlign="end">
                <Text styles={messageStyles(theme, file.status)}>{file.message}</Text>
              </Stack>
            </React.Fragment>
          ))}
        </>
      )}
    </ThemeContext.Consumer>
  );
}
UploadFileList.propTypes = {
  files: PropTypes.oneOfType([PropTypes.array]),
  onRemoveFile: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
};
UploadFileList.defaultProps = {
  files: [],
};
