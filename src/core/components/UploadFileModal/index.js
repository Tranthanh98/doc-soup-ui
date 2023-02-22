/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ThemeContext, mergeStyleSets, Stack, Text, FontWeights, Icon } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import eventBus from 'features/shared/lib/eventBus';
import domainEvents from 'features/shared/domainEvents';
import { CustomModal, CustomText } from 'features/shared/components';
import FileBiz from 'core/biz/FileBiz';
import FolderBiz from 'core/biz/FolderBiz';
import { FILE_UPLOAD_STATUS, FILE_UPLOAD_VALIDATION, PAGE_PATHS } from 'core/constants/Const';
import { success } from 'features/shared/components/ToastMessage';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import UploadArea from './UploadArea';
import UploadFileProgress from './UploadFileProgress';
import UploadTotalProcess from './UploadTotalProcess';
import DestinateSelection from './DestinateSelection';
import ConfirmUploadFileModal from './ConfirmUploadFileModal';
import UploadFileWithPercentProgress from './UploadFileWithPercentProgress';

const classNames = mergeStyleSets({
  uploadProgressWrapper: {
    maxHeight: 325,
    paddingRight: 8,
    overflow: 'auto',
    [BREAKPOINTS_RESPONSIVE.lgDown]: {
      maxHeight: 'initial',
    },
  },
});
const stackUploadStyles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingBottom: theme.spacing.m,
    maxWidth: '100%',
    width: 732,
    [BREAKPOINTS_RESPONSIVE.lgDown]: {
      width: 660,
      paddingBottom: 0,
    },
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: 707,
    },
    [BREAKPOINTS_RESPONSIVE.sm]: {
      width: 331,
    },
  },
});
const subTextStyles = (theme) => ({
  root: {
    color: theme.palette.neutralSecondaryAlt,
    overflow: 'hidden',
  },
});
const footerStyles = {
  root: {
    position: 'absolute',
    zIndex: 0,
    backgroundColor: '#f4f4f4',
    bottom: 0,
    left: 0,
    right: 0,
  },
};
const modalStyles = {
  main: {
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        minWidth: '100%',
        minHeight: '100%',
        borderRadius: 0,
      },
    },
  },
  scrollableContent: {
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      selectors: {
        '> div:first-child': {
          flexGrow: 0,
        },
        '> div:last-child': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'unset',
          paddingTop: 0,
          '@media screen and (min-width: 767px)': {
            padding: 30,
            paddingTop: 0,
          },
        },
      },
    },
  },
};

class UploadFileModal extends Component {
  constructor(props) {
    super(props);
    this._uploadedFilesStatus = {};
    this.state = {
      selectedFolder: undefined,
      folderPath: [],
      files: [],
      totalFileSize: '',
      isOpenChangeDes: false,
      isSubmitting: false,
      destination: undefined,
      isOpenConfirmUploadModal: false,
      percentUploadFile: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.selectedFolder?.id &&
      nextProps.selectedFolder !== prevState.selectedFolder &&
      !prevState.destination
    ) {
      return {
        selectedFolder: nextProps.selectedFolder,
        folderPath: nextProps.folderPath,
      };
    }
    return null;
  }

  componentDidMount() {
    this._listFolders();
    eventBus.subscribe(this, domainEvents.FOLDER_ONCHANGE_DOMAINEVENT, (event) => {
      this._handleChangeFolderEvent(event);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
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
          this.setState({ myFolders: privacy, teamFolders: team, selectedFolder, folderPath });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _toggleHideModal = () => {
    const { onToggle } = this.props;
    this.setState({
      files: [],
      totalFileSize: '',
      destination: undefined,
      selectedFolder: undefined,
      isSubmitting: false,
      percentUploadFile: 0,
    });
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

  _removeFile = (fileIndex) => {
    this.setState((state) => {
      state.files.splice(fileIndex, 1);
      const newFiles = [...state.files];
      return {
        files: newFiles,
        totalFileSize: FileBiz.calcTotalFileSize(newFiles),
        percentUploadFile: 0,
      };
    });
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

  _updateFileStatus = (fileIndex, fileStatus) => {
    this.setState((state) => {
      const file = state.files[fileIndex];

      if (file) {
        file.status = fileStatus.status;
      }

      switch (fileStatus.status) {
        case FILE_UPLOAD_STATUS.COMPLETED:
          file.message = <CustomText color="neutralSecondaryAlt">Uploaded</CustomText>;

          break;

        case FILE_UPLOAD_STATUS.FAILED:
          file.message = (
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
              <CustomText color="red">Failed - {fileStatus.message || 'Error'}</CustomText>

              <Icon
                onClick={() => {
                  file.status = FILE_UPLOAD_STATUS.LOADING;
                  file.message = '';
                  this.setState({ isSubmitting: true });
                  fileStatus.onReload();
                }}
                iconName="Refresh"
                styles={{ root: { cursor: 'pointer', color: LIGHT_THEME.palette.red } }}
              />
            </Stack>
          );

          break;

        default:
          return null;
      }

      return [...state.files];
    });
  };

  _promiseUploadOneFile = (file) => {
    const { getToken } = this.context;
    const { destination, selectedFolder } = this.state;
    const directoryId = destination ? destination?.id : selectedFolder?.id;
    const formData = new FormData();
    if (directoryId) {
      formData.append('directoryId', directoryId);
    }
    formData.append('displayName', file.name);
    formData.append('multipartFile', file);

    return new RestService().setPath('/file').setToken(getToken()).post(formData);
  };

  _onReloadUploadFile = async (file, fileIndex) => {
    const { destination, selectedFolder } = this.state;

    let reloadDirectionId;
    if (!destination || destination.id === selectedFolder.id) {
      reloadDirectionId = selectedFolder.id;
    }

    this.setState({ isSubmitting: true, percentUploadFile: 0 });
    try {
      await this._promiseUploadOneFile(file);
      this.setState({ isSubmitting: false, percentUploadFile: 1 });
      this._updateFileStatus(fileIndex, { status: FILE_UPLOAD_STATUS.COMPLETED });
      eventBus.publish(domainEvents.FILE_ONCHANGE_DOMAINEVENT, {
        action: domainEvents.ACTION.UPLOADED,
        value: { directionId: reloadDirectionId },
        receivers: [domainEvents.DES.CONTENT_PAGE],
      });
    } catch (e) {
      this.setState({ isSubmitting: false, percentUploadFile: 0 });
      this._updateFileStatus(fileIndex, { status: FILE_UPLOAD_STATUS.FAILED });
    }
  };

  _uploadMultiFile = () => {
    const { files, destination, selectedFolder } = this.state;
    this.setState(
      { isSubmitting: true, isOpenConfirmUploadModal: false, percentUploadFile: 0 },
      this._updateTotalPercentUpload
    );
    const uploadPromises = [];
    let reloadDirectionId;
    if (!destination || destination.id === selectedFolder.id) {
      reloadDirectionId = selectedFolder.id;
    }

    files.forEach((file) => {
      if (file.validated) {
        uploadPromises.push(this._promiseUploadOneFile(file));
        this.setState((state) => {
          const f = state.files.find((i) => i === file);
          f.status = FILE_UPLOAD_STATUS.LOADING;
          return [...state.files];
        });
      }
    });

    Promise.allSettled(uploadPromises)
      .then((value) => {
        for (let i = 0; i < value.length; i++) {
          const item = value[i];

          if (item.status === 'rejected') {
            this._updateFileStatus(i, {
              status: FILE_UPLOAD_STATUS.FAILED,
              onReload: () => this._onReloadUploadFile(files[i], i),
              message: item.reason.response?.data?.message || item.reason.response?.message,
            });
          }
          if (item.status === 'fulfilled') {
            this._updateFileStatus(i, { status: FILE_UPLOAD_STATUS.COMPLETED });
          }
        }

        if (value.every((i) => i.status === 'fulfilled')) {
          this.setState({ percentUploadFile: 1 });
          setTimeout(() => {
            this._toggleHideModal();
          }, 800);
        } else {
          this.setState({ percentUploadFile: 0 });
        }
      })

      .finally(() => {
        this.setState({ isSubmitting: false });
        clearTimeout(this.timer);
        this._setUploadedFileStatus();

        eventBus.publish(domainEvents.FILE_ONCHANGE_DOMAINEVENT, {
          action: domainEvents.ACTION.UPLOADED,
          value: { directionId: reloadDirectionId },
          receivers: [domainEvents.DES.CONTENT_PAGE],
        });
      });
  };

  _uploadSingleFile = (file) => {
    const { files } = this.state;
    this.setState({ isSubmitting: true, percentUploadFile: 0 }, this._updateTotalPercentUpload);

    const fileIndex = files.findIndex((i) => i === file);
    if (fileIndex !== -1) {
      this._updateFileStatus(fileIndex, {
        status: FILE_UPLOAD_STATUS.LOADING,
        onReload: () => this._uploadSingleFile(file),
      });
    }

    this._promiseUploadOneFile(file)
      .then(({ data: fileId }) => {
        this.setState({ isSubmitting: false });
        const { history } = this.props;
        history.push(`/${PAGE_PATHS.fileDetail}/${fileId}`);
      })
      .catch((err) => {
        const index = files.findIndex((i) => i === file);
        if (index !== -1) {
          this._updateFileStatus(index, {
            status: FILE_UPLOAD_STATUS.FAILED,
            onReload: () => this._uploadSingleFile(file),
            message: err.response.data.message,
          });
        }
      })
      .finally(() => {
        this.setState({ isSubmitting: false, percentUploadFile: 1 });
      });
  };

  _updateTotalPercentUpload = () => {
    const _updatePercent = () => {
      this.timer = setTimeout(() => {
        this.setState(
          (state) => {
            if (state.percentUploadFile < 0.9) {
              const percent = state.percentUploadFile + 0.05;
              return { percentUploadFile: parseFloat(percent.toFixed(2)) };
            }
            return null;
          },
          () => {
            const { percentUploadFile } = this.state;
            if (percentUploadFile >= 1) {
              clearTimeout(this.timer);
            } else {
              _updatePercent();
            }
          }
        );
      }, 200);
    };

    _updatePercent();
  };

  _upgradeFileVersion = (file) => {
    const { getToken } = this.context;
    const { destination, selectedFolder } = this.state;
    const { fileId } = this.props;

    this.setState({ isSubmitting: true });

    const directoryId = destination ? destination.id : selectedFolder.id;
    const formData = new FormData();
    formData.append('directoryId', directoryId);
    formData.append('displayName', file.name);
    formData.append('multipartFile', file);

    new RestService()
      .setToken(getToken())
      .setPath(`/file/${fileId}/new-version`)
      .put(formData)
      .then(() => {
        success('Content successfully processed and now ready for sharing!');
        this._toggleHideModal();
      })
      .finally(() => {
        this.setState({ isSubmitting: false });
      });
  };

  _uploadFile = () => {
    const { files } = this.state;
    const { fileId } = this.props;
    if (files.length === 1) {
      if (fileId) {
        this._upgradeFileVersion(files[0]);
        return;
      }
      this._uploadSingleFile(files[0]);
    } else if (files.length > 1) {
      this.setState({ isOpenConfirmUploadModal: true });
    }
  };

  _onToggleConfirmUploadFileModal = () => {
    this.setState({ isOpenConfirmUploadModal: false });
  };

  /* Events */
  _handleChangeFolderEvent = (event) => {
    const { action, value, receivers } = event.message;
    if (receivers === undefined || receivers.includes(domainEvents.DES.UPLOAD_FILE_MODAL)) {
      switch (action) {
        case domainEvents.ACTION.UPDATE:
          this.setState({ myFolders: value?.myFolders, teamFolders: value?.teamFolders });
          break;
        default:
          break;
      }
    }
  };
  /* End Events */

  render() {
    const {
      teamFolders,
      myFolders,
      files,
      totalFileSize,
      isOpenChangeDes,
      destination,
      folderPath,
      selectedFolder,
      isSubmitting,
      isOpenConfirmUploadModal,
      percentUploadFile,
    } = this.state;
    const { isMobile, isDesktop } = this.context;
    const { isOpen, fileId } = this.props;
    const isHasFile = files.length > 0;
    return (
      <>
        <ThemeContext.Consumer>
          {(theme) => (
            <CustomModal
              title="File Upload"
              isOpen={isOpen}
              onDismiss={this._toggleHideModal}
              isSubmitting={isSubmitting}
              primaryButtonProps={{
                text: 'Upload Files',
                styles: { root: { fontSize: 16, paddingRight: 32, paddingLeft: 32, height: '44px !important' } },
                disabled: !files.length || isSubmitting,
                onClick: () => this._uploadFile(),
              }}
              cancelButtonProps={{
                styles: { root: { fontSize: 16, paddingRight: 24, paddingLeft: 24, height: '44px !important' } },
              }}
              footerLeft={
                <UploadTotalProcess
                  isMobile={isMobile}
                  isHasFile={isHasFile}
                  totalFileSize={totalFileSize}
                  percent={percentUploadFile}
                />
              }
              modalProps={{ styles: modalStyles }}
            >
              {!fileId ? (
                <DestinateSelection
                  isOpen={isOpenChangeDes}
                  teamFolders={teamFolders}
                  myFolders={myFolders}
                  folderPath={folderPath}
                  folderPathString={FileBiz.convertToDestinationString(folderPath)}
                  selectedFolder={destination || selectedFolder}
                  onToggle={this._toggleChangeDesModal}
                  onChangeDestination={this._changeDestination}
                />
              ) : null}
              <Stack
                horizontal={isDesktop}
                wrap={isDesktop}
                tokens={{ childrenGap: isDesktop ? theme.spacing.l1 : 0 }}
                styles={stackUploadStyles(theme)}
              >
                {Boolean(fileId) && files.length > 0 ? null : (
                  <Stack grow styles={{ root: { minWidth: 330, marginBottom: 18 } }}>
                    <UploadArea
                      isDisplayIcon={isDesktop || !isHasFile}
                      rootStyles={{ height: isMobile || isHasFile ? 'auto' : 368 }}
                      files={files}
                      fileValidation={{ ...FILE_UPLOAD_VALIDATION, MULTIPE: !fileId }}
                      onFileChange={this._handleFileChange}
                    />
                  </Stack>
                )}
                {isHasFile && (
                  <Stack.Item
                    grow
                    disableShrink
                    styles={{
                      root: {
                        [BREAKPOINTS_RESPONSIVE.mdDown]: { minWidth: 'calc(100% - 20px)' },
                      },
                    }}
                  >
                    <Stack grow horizontal horizontalAlign="space-between">
                      <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>Uploading</Text>
                      <Text styles={subTextStyles(theme)}>Total file size: {totalFileSize}</Text>
                    </Stack>
                    <br />
                    <div className={classNames.uploadProgressWrapper}>
                      {files.map((file, index) => {
                        if (!fileId) {
                          return (
                            <UploadFileWithPercentProgress
                              file={file}
                              key={index}
                              fileIndex={index}
                              isUploading={isSubmitting}
                              onRemoveFile={this._removeFile}
                            />
                          );
                        }
                        return (
                          <UploadFileProgress
                            file={file}
                            key={index}
                            fileIndex={index}
                            isUploading={isSubmitting}
                            onRemoveFile={this._removeFile}
                          />
                        );
                      })}
                    </div>
                  </Stack.Item>
                )}
              </Stack>
              <Stack styles={{ root: { height: isMobile ? 150 : 92, ...footerStyles.root } }} />
            </CustomModal>
          )}
        </ThemeContext.Consumer>

        <ConfirmUploadFileModal
          files={files}
          onImport={this._uploadMultiFile}
          isOpenModal={isOpenConfirmUploadModal}
          onToggle={this._onToggleConfirmUploadFileModal}
        />
      </>
    );
  }
}
UploadFileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  folderPath: PropTypes.oneOfType([PropTypes.array]),
  selectedFolder: PropTypes.oneOfType([PropTypes.object]),
  fileId: PropTypes.number,
};
UploadFileModal.defaultProps = {
  folderPath: [],
  selectedFolder: {},
  fileId: undefined,
};
UploadFileModal.contextType = GlobalContext;
export default withRouter(UploadFileModal);
