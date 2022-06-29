import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext, mergeStyleSets, Stack, Icon, Text } from '@fluentui/react';
import { FILE_UPLOAD_VALIDATION } from 'core/constants/Const';
import { CustomButton } from 'features/shared/components';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const classNames = mergeStyleSets({
  fileInput: {
    position: 'absolute',
    zIndex: 5,
    top: 0,
    bottom: 0,
    opacity: 0,
    width: '100%',
    margin: 0,
    cursor: 'pointer',
  },
});
const uploadStackStyles = (theme, rootStyles, isDragEnter) => ({
  root: {
    minHeight: 368,
    position: 'relative',
    padding: 40,
    borderRadius: 8,
    backgroundColor: isDragEnter ? theme.palette.themeLighterAlt : theme.palette.neutralLighter,
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23${
      isDragEnter ? 'f79f1a' : 'dadada'
    }' stroke-width='4' stroke-dasharray='8%2c 9' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
    [BREAKPOINTS_RESPONSIVE.lgDown]: {
      minHeight: 'initial',
    },
    ...rootStyles,
  },
});
const uploadIconStyles = (theme) => ({
  root: {
    color: theme.palette.neutralQuaternary,
    fontSize: 64,
    marginBottom: 34,
    height: 80,
  },
});
const uploadTextStyles = (theme) => ({
  root: {
    color: theme.palette.neutralSecondaryAlt,
  },
});

const browseFileStyles = {
  root: {
    height: '40px !important',
    borderRadius: 2,
    border: 0,
    padding: '13px 13px 14px 8px',
    marginBottom: 4,
  },
  label: { fontSize: 14 },
  icon: {
    svg: { width: 26, height: 26 },
  },
};

export default function UploadArea(props) {
  const { onFileChange, fileValidation, rootStyles, isDisplayIcon } = props;
  const [isDragEnter, setIsDragEnter] = useState(false);
  const _fileRef = useRef();

  const _chooseFile = () => {
    _fileRef.current.click();
  };

  const _onChangeFile = (event) => {
    const { files } = event.target;
    onFileChange(files);
  };
  const _onDropFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const { files } = event.dataTransfer;
    onFileChange(files);
    setIsDragEnter(false);
  };

  const _onEnterDropZone = (event) => {
    event.preventDefault();
    setIsDragEnter(true);
  };

  const _onLeaveDropZone = (event) => {
    event.preventDefault();
    setIsDragEnter(false);
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Stack
          grow={4}
          horizontalAlign="center"
          verticalAlign="center"
          styles={uploadStackStyles(theme, rootStyles, isDragEnter)}
        >
          <input
            label="upload file"
            name="upload-file-input"
            id="upload-file-input"
            multiple={fileValidation.MULTIPE}
            accept={fileValidation.ACCEPT}
            type="file"
            ref={_fileRef}
            className={classNames.fileInput}
            onChange={_onChangeFile}
            onClick={(event) => {
              // eslint-disable-next-line no-param-reassign
              event.target.value = null;
            }}
            onDrop={_onDropFile}
            onDragEnter={_onEnterDropZone}
            onDragOver={_onEnterDropZone}
            onDragLeave={_onLeaveDropZone}
            onDragEnd={_onLeaveDropZone}
          />
          {isDisplayIcon ? <Icon iconName="upload-file-svg" styles={uploadIconStyles(theme)} /> : null}
          <CustomButton
            primary
            size="medium"
            styles={browseFileStyles}
            iconProps={{ iconName: 'white-plus-svg' }}
            text="Browse Files"
            htmlFor="upload-file-input"
            onClick={_chooseFile}
          />
          <Text variant="smallPlus" styles={uploadTextStyles(theme)}>
            or
          </Text>
          <Text variant="mediumPlus" styles={uploadTextStyles(theme)}>
            Drag files to upload
          </Text>
        </Stack>
      )}
    </ThemeContext.Consumer>
  );
}
UploadArea.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  rootStyles: PropTypes.oneOfType([PropTypes.object]),
  fileValidation: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])),
  isDisplayIcon: PropTypes.bool,
};
UploadArea.defaultProps = {
  rootStyles: undefined,
  fileValidation: FILE_UPLOAD_VALIDATION,
  isDisplayIcon: true,
};
