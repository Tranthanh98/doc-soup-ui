import { Stack } from '@fluentui/react';
import { UploadArea } from 'core/components';
import { FILE_UPLOAD_VALIDATION } from 'core/constants/Const';
import React from 'react';
import PropTypes from 'prop-types';
import UploadFilePercentProgress from './UploadFilePercentProgress';

export default function UploadFileAreaResponsive({ files, onFileChange, onDeleteFile, updateFileStatus }) {
  return (
    <>
      <Stack horizontal horizontalAlign="space-between" style={{ marginTop: 20 }} className="ms-Grid-row">
        {files.length > 0 ? (
          <>
            <Stack grow horizontal verticalAlign="center" className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
              <UploadArea
                files={files}
                fileValidation={{ ...FILE_UPLOAD_VALIDATION, MULTIPE: true }}
                onFileChange={onFileChange}
                rootStyles={{ minHeight: 180 }}
                isDisplayIcon={false}
              />
            </Stack>
            <Stack style={{ margrinTop: 20 }} className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">
              {files.map((file, index) => (
                <UploadFilePercentProgress
                  file={file}
                  key={index}
                  fileIndex={index}
                  handleRemoveFile={onDeleteFile}
                  updateFileStatus={updateFileStatus}
                />
              ))}
            </Stack>
          </>
        ) : (
          <Stack.Item className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
            <UploadArea
              files={files}
              fileValidation={{ ...FILE_UPLOAD_VALIDATION, MULTIPE: true }}
              onFileChange={onFileChange}
              rootStyles={{ minHeight: 180 }}
              isDisplayIcon={false}
            />
          </Stack.Item>
        )}
      </Stack>
    </>
  );
}

UploadFileAreaResponsive.propTypes = {
  files: PropTypes.oneOfType([PropTypes.array]).isRequired,
  onFileChange: PropTypes.func.isRequired,
  onDeleteFile: PropTypes.func.isRequired,
  updateFileStatus: PropTypes.func.isRequired,
};
