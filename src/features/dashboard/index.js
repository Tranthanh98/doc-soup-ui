import { FontWeights, getTheme, Icon, Stack, Text } from '@fluentui/react';
import React, { Component } from 'react';
import FileBiz from 'core/biz/FileBiz';
import { EmptyContent } from 'features/shared/components';
import RestService from 'features/shared/services/restService';
import { success } from 'features/shared/components/ToastMessage';
import GlobalContext from 'security/GlobalContext';
import { SORT_DIRECTION, MODAL_NAME, PAGE_PATHS, FILE_UPLOAD_STATUS } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import ShareFileModal from 'core/components/ShareFileModal';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import UploadFileAreaResponsive from './components/UploadFileAreaResponsive';
import RecentDocumentActivity from './components/RecentDocumentActivity';

const theme = getTheme();

const stackControlStyles = {
  root: { paddingBottom: theme.spacing.l2 },
};

const pageTitleStyles = {
  root: {
    fontSize: 20,
    fontWeight: FontWeights.bold,
    selectors: {
      '@media only screen and (max-width: 767.9px)': {
        fontSize: 16,
        fontWeight: FontWeights.semibold,
      },
    },
  },
};

const viewAllBtnStyles = {
  root: {
    cursor: 'pointer',
    '&:hover > span': {
      textDecoration: 'underline',
    },
  },
};

const TOP_FILES = 10;
const DATE_RECENT = 30;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      recentFiles: [],
      imgSrcs: [],
      modalName: '',
      shareFile: undefined,
    };
  }

  componentDidMount() {
    this._getRecentActivityFiles();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _getRecentActivityFiles = () => {
    const { getToken } = this.context;
    new RestService()
      .setPath(
        `/report/document-activity?top=${TOP_FILES}&dateRecent=${DATE_RECENT}&sortDirection=${SORT_DIRECTION.DESC}`
      )
      .setToken(getToken())
      .get()
      .then((res) => {
        const imgSrcs = res.data.map((i) => ({ id: i.id, src: '' }));
        this.setState({ recentFiles: res.data, imgSrcs }, this._handleGetThumbnail);
      })
      .catch((err) => console.error(err));
  };

  _handleGetThumbnail = () => {
    const { imgSrcs } = this.state;

    const { getToken } = this.context;

    imgSrcs.forEach((i) => {
      new RestService()
        .setPath(`/file/${i.id}/thumb/1`)
        .setToken(getToken())
        .setResponseType('arraybuffer')
        .get()
        .then(({ data }) => {
          const URL = window.URL || window.webkitURL;

          const imageUrl = URL.createObjectURL(new Blob([data], { type: 'image/jpeg', encoding: 'UTF-8' }));

          this.setState((state) => {
            const img = state.imgSrcs.find((m) => m.id === i.id);
            if (img) {
              img.src = imageUrl;
            }
            return [...state.imgSrcs];
          });
        });
    });
  };

  _promiseUploadOneFile = (file) => {
    const { getToken } = this.context;
    const formData = new FormData();

    formData.append('displayName', file.name);
    formData.append('multipartFile', file);

    return new RestService().setPath('/file').setToken(getToken()).post(formData);
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
      }, this._requestUploadFile);
    }
  };

  _selectAndRedirectToUploadedFolder = () => {
    const { getToken, setSelectedFolderId } = this.context;
    const { history } = this.props;

    new RestService()
      .setPath('/directory')
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        const firstDirectoryId = data?.privacy[0]?.id;
        if (firstDirectoryId) {
          setSelectedFolderId(firstDirectoryId);
          history.push(PAGE_PATHS.content);
        }
      })
      .catch((err) => restServiceHelper.handleError(err));
  };

  _requestUploadFile = () => {
    const { files } = this.state;
    const { history } = this.props;

    const uploadPromises = [];

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

    Promise.allSettled(uploadPromises).then((value) => {
      const FIRST_FILE_INDEX = 0;
      if (value.length === 1 && value[FIRST_FILE_INDEX].status === 'fulfilled') {
        this._updateFileStatus(FIRST_FILE_INDEX, { status: FILE_UPLOAD_STATUS.COMPLETED });
        this.timer = setTimeout(() => {
          history.push(`${PAGE_PATHS.content}/file/${value[0].value.data}`);
        }, 800);
        return;
      }

      let isSuccessAll = true;

      for (let i = 0; i < value.length; i++) {
        const item = value[i];

        if (item.status === 'rejected') {
          this._updateFileStatus(i, {
            status: FILE_UPLOAD_STATUS.FAILED,
            message: item.reason.response?.data?.message || item.reason.response?.message,
          });
          isSuccessAll = false;
        }
        if (item.status === 'fulfilled') {
          this._updateFileStatus(i, { status: FILE_UPLOAD_STATUS.COMPLETED });
        }
      }

      if (!isSuccessAll) {
        this.timer = setTimeout(() => {
          this._handleDeleteFileUpload();
          clearTimeout(this.timer);
        }, 1000);
        this._getRecentActivityFiles();
      } else {
        this.timer = setTimeout(this._selectAndRedirectToUploadedFolder, 800);
      }
    });
  };

  _handleDeleteFileUpload = () => {
    const { files } = this.state;

    const unCompletedFile = files.filter((i) => i.status && i.status !== FILE_UPLOAD_STATUS.COMPLETED);

    this.setState({ files: unCompletedFile });
  };

  _updateFileStatus = (fileIndex, fileStatus) => {
    this.setState((state) => {
      const file = state.files[fileIndex];

      if (file) {
        file.status = fileStatus.status;
        file.message = fileStatus.message;
      }

      return [...state.files];
    });
  };

  _handleDeleteFile = (file) => {
    const { getToken } = this.context;

    new RestService()
      .setPath(`/file/${file.id}?nda=${file.nda || false}`)
      .setToken(getToken())
      .delete()
      .then(() => {
        success('Delete file successfully');
        this._getRecentActivityFiles();
      })
      .catch((err) => {
        window.alert(`Delete failed: ${err.message}`);
      });
  };

  _initShareFile = (item) => {
    this.setState({ modalName: MODAL_NAME.SHARE_FILE, shareFile: { ...item, isFile: true } });
  };

  _toggleDialog = (name) => {
    this.setState({ modalName: name, shareFile: undefined });
  };

  _viewAllDocument = () => {
    const { history } = this.props;

    history.push(`/${PAGE_PATHS.content}`);
  };

  render() {
    const { files, recentFiles, imgSrcs, modalName, shareFile } = this.state;

    return (
      <>
        <Stack tokens={{ childrenGap: 8 }} styles={stackControlStyles}>
          <Text
            variant="xLarge"
            styles={{ root: { ...pageTitleStyles.root, [BREAKPOINTS_RESPONSIVE.lgDown]: { display: 'none' } } }}
          >
            Upload Files
          </Text>
          <UploadFileAreaResponsive
            files={files}
            onFileChange={this._handleFileChange}
            onDeleteFile={this._handleDeleteFileUpload}
            updateFileStatus={this._updateFileStatus}
          />
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center" style={{ marginTop: 36 }}>
            <Text variant="xLarge" styles={pageTitleStyles}>
              Recent Document Activity
            </Text>
            <Stack verticalAlign="end" horizontal tokens={{ childrenGap: 10 }} styles={viewAllBtnStyles}>
              <Text onClick={this._viewAllDocument}>View All</Text>
              <Icon
                iconName="chevron-right-svg"
                styles={({ theme: iconTheme }) => ({
                  root: { width: 8, fill: iconTheme.palette.neutralSecondaryAlt },
                })}
              />
            </Stack>
          </Stack>
          {recentFiles && recentFiles.length > 0 ? (
            <Stack style={{ marginTop: 20 }}>
              <RecentDocumentActivity
                recentFiles={recentFiles}
                imgSrcs={imgSrcs}
                onDeleteFile={this._handleDeleteFile}
                initShareFile={this._initShareFile}
              />
            </Stack>
          ) : (
            <EmptyContent
              title="No Content"
              subTitle="Upload content to start sharing!"
              imageProps={{
                src: '/img/group-105.png',
                srcSet: '/img/group-105-2x.png 2x, /img/group-105-3x.png 3x',
              }}
            />
          )}
        </Stack>
        <ShareFileModal
          isOpen={modalName === MODAL_NAME.SHARE_FILE}
          shareDocument={shareFile}
          onToggle={this._toggleDialog}
        />
      </>
    );
  }
}

Dashboard.contextType = GlobalContext;
