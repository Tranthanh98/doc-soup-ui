import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext, mergeStyleSets, Stack } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import eventBus from 'features/shared/lib/eventBus';
import domainEvents from 'features/shared/domainEvents';
import { CustomModal } from 'features/shared/components';
import { DestinateSelection, UploadArea } from 'core/components';
import FileBiz from 'core/biz/FileBiz';
import FolderBiz from 'core/biz/FolderBiz';
import { FILE_UPLOAD_STATUS, NDA_UPLOAD_VALIDATION } from 'core/constants/Const';
import UploadFileList from './UploadFileList';

const classNames = mergeStyleSets({
  uploadProgressWrapper: {
    minHeight: 193,
    maxHeight: '50vh',
    paddingRight: 8,
    overflow: 'auto',
  },
});
const stackUploadStyles = (theme) => ({
  root: {
    minWidth: '35vw',
    marginBottom: theme.spacing.l1,
  },
});

class UploadNDAModal extends Component {
  constructor(props) {
    super(props);
    this._uploadedFilesStatus = {};
    this.state = {
      selectedFolder: undefined,
      folderPath: [],
      files: [],
      isOpenChangeDes: false,
      isSubmitting: false,
      destination: undefined,
    };
  }

  componentDidMount() {
    this._listFolders();
  }

  componentWillUnmount() {
    eventBus.unsubscribe(this);
  }

  _listFolders = () => {
    const { getToken } = this.context;
    new RestService()
      .setPath('/directory')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const { privacy, team } = res.data;
          const { selectedFolder, listContainSelectedFolder } = FolderBiz.getFirstFolder(team, privacy);
          const folderPath = FolderBiz.getFolderPath(selectedFolder, listContainSelectedFolder);
          const disabledMyFolders = privacy.map((item) => ({ ...item, disabled: true }));
          this.setState({ myFolders: disabledMyFolders, teamFolders: team, selectedFolder, folderPath });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _toggleHideModal = () => {
    const { onToggle } = this.props;
    this.setState({ files: [] });
    onToggle();
  };

  _toggleChangeDesModal = () => {
    this.setState((state) => ({ isOpenChangeDes: !state.isOpenChangeDes }));
  };

  _handleFileChange = (files) => {
    if (files.length > 0) {
      let newFiles = FileBiz.formatFile(files);
      newFiles = FileBiz.validateFiles(newFiles);
      this.setState((state) => {
        newFiles = [...state.files, ...newFiles];
        return {
          files: newFiles,
          totalFileSize: FileBiz.calcTotalFileSize(newFiles),
        };
      });
    }
  };

  _removeFile = (fileName) => {
    this.setState((state) => ({ files: state.files.filter((e) => e.name !== fileName) }));
  };

  _changeDestination = (folder, folderPath) => {
    this.setState({ folderPath, destination: folder });
    this._toggleChangeDesModal();
  };

  _setUploadedFileStatus = () => {
    this.setState((state) => {
      const newFiles = state.files.map((e) => {
        const file = e;
        const uploadedStatus = this._uploadedFilesStatus[file.name];
        if (uploadedStatus === FILE_UPLOAD_STATUS.COMPLETED) {
          file.message = 'Completed';
          file.status = uploadedStatus;
        }
        if (uploadedStatus === FILE_UPLOAD_STATUS.FAILED) {
          file.message = 'Failed';
          file.status = uploadedStatus;
        }
        return file;
      });
      this._uploadedFilesStatus = {};
      return { files: newFiles };
    });
  };

  _promiseUploadOneFile = (file) => {
    const { getToken } = this.context;
    const { destination, selectedFolder } = this.state;
    const directoryId = destination ? destination.id : selectedFolder.id;
    const formData = new FormData();
    formData.append('directoryId', directoryId);
    formData.append('displayName', file.name);
    formData.append('multipartFile', file);
    formData.append('nda', true);
    return new RestService()
      .setPath('/setting/nda')
      .setToken(getToken())
      .post(formData)
      .then(() => {
        this._uploadedFilesStatus[file.name] = FILE_UPLOAD_STATUS.COMPLETED;
      })
      .catch(() => {
        this._uploadedFilesStatus[file.name] = FILE_UPLOAD_STATUS.FAILED;
      });
  };

  _uploadFile = () => {
    const { files } = this.state;
    this.setState({ isSubmitting: true });
    const uploadPromises = [];

    files.forEach((file) => {
      if (file.validated) {
        uploadPromises.push(this._promiseUploadOneFile(file));
      }
    });
    Promise.all(uploadPromises)
      .then(() => {
        eventBus.publish(domainEvents.FILE_ONCHANGE_DOMAINEVENT, {
          action: domainEvents.ACTION.UPLOADED,
          value: {},
          receivers: [domainEvents.DES.SETTINGS_NDA_PAGE],
        });
      })
      .finally(() => {
        this.setState({ isSubmitting: false });
        this._setUploadedFileStatus();
      });
  };

  render() {
    const { teamFolders, myFolders, files, isOpenChangeDes, destination, folderPath, selectedFolder, isSubmitting } =
      this.state;
    const { isOpen } = this.props;
    const isHasFile = files.length > 0;
    return (
      <>
        <ThemeContext.Consumer>
          {(theme) => (
            <CustomModal
              title="NDA Upload"
              isOpen={isOpen}
              onDismiss={this._toggleHideModal}
              isSubmitting={isSubmitting}
              primaryButtonProps={{
                text: 'Upload Files',
                disabled: !files.length || isSubmitting,
                onClick: () => this._uploadFile(),
              }}
            >
              <DestinateSelection
                isOpen={isOpenChangeDes}
                teamFolders={teamFolders}
                myFolders={myFolders}
                folderPath={folderPath}
                folderPathString={FileBiz.convertToDestinationString(folderPath)}
                selectedFolder={destination || selectedFolder}
                disabledMyFolderTooltip="Selected folder must be a Team folder."
                onToggle={this._toggleChangeDesModal}
                onChangeDestination={this._changeDestination}
              />
              <Stack grow horizontal wrap tokens={{ childrenGap: theme.spacing.l1 }} styles={stackUploadStyles(theme)}>
                {isHasFile ? (
                  <Stack.Item grow={1}>
                    <div className={classNames.uploadProgressWrapper}>
                      <UploadFileList files={files} isUploading={isSubmitting} onRemoveFile={this._removeFile} />
                    </div>
                  </Stack.Item>
                ) : (
                  <UploadArea
                    files={files}
                    fileValidation={NDA_UPLOAD_VALIDATION}
                    onFileChange={this._handleFileChange}
                    rootStyles={{ minWidth: 300, minHeight: 193 }}
                  />
                )}
              </Stack>
            </CustomModal>
          )}
        </ThemeContext.Consumer>
      </>
    );
  }
}
UploadNDAModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
UploadNDAModal.defaultProps = {};
UploadNDAModal.contextType = GlobalContext;
export default UploadNDAModal;
