/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import FolderBiz from 'core/biz/FolderBiz';
import { CustomBreadcrumb, CustomText, LoadingPage, CustomIconButton } from 'features/shared/components';
import {
  Stack,
  Text,
  Pivot,
  PivotItem,
  Persona,
  PersonaSize,
  Image,
  ImageFit,
  PrimaryButton,
  CommandBar,
  Icon,
  DirectionalHint,
} from '@fluentui/react';
import { FileAnalytic, ViewerOfFileList } from 'features/content/fileDetail/components';
import { UploadFileModal, ShareFileModal } from 'features/content/components';
import { PAGE_PATHS, MODAL_NAME, TIME_OUT } from 'core/constants/Const';
import fileHelper from 'features/shared/lib/fileHelper';
import { millisecondsToStr } from 'features/shared/lib/utils';
import { success } from 'features/shared/components/ToastMessage';
import { ExportVisitsModal } from 'core/components';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import OverviewPage from './components/OverviewPage';

const linkButtonStyles = {
  root: {
    width: 140,
    height: 40,
    padding: '10px 25px 10px 26px',
    borderRadius: 4,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: 100,
      height: 30,
      padding: '9px 16px 8px',
    },
  },
  label: { margin: 0 },
  icon: { margin: 0 },
};

class FileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      folderPath: [],
      loading: false,
      refreshAllLink: false,
    };
    this._exportVisitsTimer = null;
    this.timer = null;
  }

  componentDidMount() {
    this._getFile();
    this._addAllowViewerByToken();
  }

  componentWillUnmount() {
    const { fileThumbnail } = this.state;
    URL.revokeObjectURL(fileThumbnail);
    clearTimeout(this.timer);
  }

  _getFile = (isAfterUpdating = false) => {
    const { match } = this.props;
    const { id } = match.params;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/file/${id}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          this.setState({ file: { ...res.data, isFile: true } });
          this._listFolders(res.data);

          this.timer = setTimeout(
            () => {
              this._getFileThumbnail(id, res.data.version);
            },
            isAfterUpdating ? 5000 : 0
          );
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _addAllowViewerByToken = () => {
    const { getToken } = this.context;
    const params = new URL(document.location).searchParams;
    const linkedLinkId = params.get('linkedLinkId');
    const allowViewerToken = params.get('allowViewerToken');
    if (allowViewerToken && linkedLinkId) {
      new RestService()
        .setPath(`/link/${linkedLinkId}/add-allow-viewer`)
        .setToken(getToken())
        .put({ token: allowViewerToken })
        .then((res) => {
          if (res.data) {
            success(`${res.data} successfully added to allow list.`);
          }
        })
        .catch(() => {});
    }
  };

  _getFileThumbnail = (fileId, version, pageNumber = 1) => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/file/${fileId}/thumb/${pageNumber}?version=${version}`)
      .setToken(getToken())
      .setResponseType('arraybuffer')
      .get()
      .then((res) => {
        if (res.data) {
          const URL = window.URL || window.webkitURL;
          const imageUrl = URL.createObjectURL(new Blob([res.data], { type: 'image/jpeg', encoding: 'UTF-8' }));
          this.setState({ fileThumbnail: imageUrl });
        }
      })
      .catch((err) => console.log(err));
  };

  _toggleDialog = (name) => {
    this.setState({ modalName: name }, this._getFile);
  };

  _listFolders = (file) => {
    const { getToken } = this.context;
    new RestService()
      .setPath('/directory')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const { privacy, team } = res.data;
          const folders = [...privacy, ...team];
          this._getFolderPathContainFile(file, folders);
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _selectFolder = (folder) => {
    const { history } = this.props;
    history.push(`/${PAGE_PATHS.content}`, { selectedDirectoryId: folder.id });
  };

  _getFolderPathContainFile = (file, folders) => {
    const folder = folders.find((e) => e.id === file.directoryId);
    const folderPath = FolderBiz.getFolderPath(folder, folders, this._selectFolder);
    this.setState({ folderPath });
  };

  _handleDownLoadFile = () => {
    const { file } = this.state;

    const { getToken } = this.context;
    new RestService()
      .setPath(`file/${file.id}/download`)
      .setToken(getToken())
      .setResponseType('arraybuffer')
      .get()
      .then((response) => {
        fileHelper.download(response.data, response.headers['content-type'], `download-${file.name}.pdf`);
      })
      .catch((err) => {
        window.alert('Download file failed: ', err.message);
      });
  };

  _handleExportVistitsFile = (email) => {
    const { file } = this.state;

    const { getToken } = this.context;
    new RestService()
      .setPath(`file/${file.id}/export-viewer?email=${email}`)
      .setToken(getToken())
      .get()
      .then((response) => {
        if (response.data) {
          fileHelper.download(response.data, response.headers['content-type'], `export-vistit-${file.name}.csv`);
        }
      })
      .catch((err) => {
        window.alert('Export visits failed: ', err.message);
      });
  };

  _confirmDelete = () => {
    window.confirm({
      title: 'Delete file',
      content: `Are you sure ?`,
      yesAction: this._handleDeleteFile,
    });
  };

  _handleDeleteFile = () => {
    const { file } = this.state;
    const { getToken } = this.context;
    const { history } = this.props;

    this.setState({ loading: true });
    new RestService()
      .setPath(`/file/${file.id}?nda=${file.nda}`)
      .setToken(getToken())
      .delete()
      .then(() => {
        success('Delete file successfully');
        history.replace('/content');
      })
      .catch((err) => {
        window.alert(`Delete failed: ${err.message}`);
        this.setState({ loading: false });
      });
  };

  _onRefreshAllLink = () => {
    const { refreshAllLink } = this.state;
    this.setState({ refreshAllLink: !refreshAllLink });
  };

  _exportVisits = (isEmail) => {
    if (!isEmail) {
      success('Your export is now ready to download');
    }

    this._handleExportVistitsFile(isEmail);
  };

  _onCancelExportVisitsEmail = () => {
    this._toggleDialog();
    clearTimeout(this._exportVisitsTimer);
    this._exportVisits(false);
  };

  _onExportFileVisits = () => {
    this._exportVisitsTimer = window.setTimeout(() => {
      this._exportVisits(false);
      this._toggleDialog();
    }, TIME_OUT.EXPORT_VISITS);

    this._toggleDialog(MODAL_NAME.EXPORT_VISITS_MODAL);
  };

  _onSendExportVisitEmail = () => {
    clearTimeout(this._exportVisitsTimer);
    this._toggleDialog();
    this._exportVisits(true);
  };

  menuContentDetail = (file, isMobile) => {
    const listMenu = [
      {
        key: 'watch',
        text: 'Preview',
        title: 'Preview',
        ariaLabel: 'Preview',
        iconOnly: true,
        style: { fontSize: 13, height: '100%' },
        iconProps: {
          iconName: 'eye-open-svg',
          styles: { root: { width: 20, [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' } } },
        },
        target: '_blank',
        href: `/${PAGE_PATHS.filePreview.replace('id', file?.id)}`,
      },
      {
        key: 'upload-file',
        text: 'Upload file',
        title: 'Upload file',
        ariaLabel: 'Upload file',
        iconOnly: true,
        style: { fontSize: 13, height: '100%' },
        iconProps: {
          iconName: 'plus-svg',
          styles: {
            root: {
              width: 20,
              [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' },
            },
          },
        },
        onClick: () => this._toggleDialog(MODAL_NAME.UPLOAD_FILE),
      },
    ];

    const moreBtn = [
      {
        key: 'More',
        text: 'More',
        iconOnly: true,
        iconProps: {
          iconName: 'more-svg',
          styles: { root: { width: 20 } },
        },
        styles: { item: { [BREAKPOINTS_RESPONSIVE.mdDown]: { height: 30 } } },
        menuIconProps: { style: { display: 'none' } },
        subMenuProps: {
          items: isMobile
            ? listMenu.concat([
                {
                  key: 'download',
                  text: 'Download',
                  iconOnly: true,

                  style: { fontSize: 13, height: '100%' },
                  iconProps: {
                    iconName: 'plus-svg',
                    styles: {
                      root: {
                        width: 20,
                        [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' },
                      },
                    },
                  },
                  onClick: this._handleDownLoadFile,
                },
                {
                  key: 'exportVisits',
                  text: 'Export visits',

                  style: { fontSize: 13, height: '100%' },
                  iconOnly: true,
                  iconProps: {
                    iconName: 'plus-svg',
                    styles: {
                      root: {
                        width: 20,
                        [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' },
                      },
                    },
                  },
                  onClick: this._onExportFileVisits,
                },
                {
                  key: 'delete',
                  text: (
                    <CustomText
                      color="textDanger"
                      style={{
                        fontSize: 13,
                        height: '100%',
                      }}
                    >
                      Delete
                    </CustomText>
                  ),
                  iconOnly: true,
                  iconProps: {
                    iconName: 'plus-svg',
                    styles: {
                      root: {
                        width: 20,
                        [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' },
                      },
                    },
                  },
                  onClick: this._confirmDelete,
                },
              ])
            : [
                { key: 'download', text: 'Download', onClick: this._handleDownLoadFile },
                { key: 'exportVisits', text: 'Export visits', onClick: this._onExportFileVisits },
                {
                  key: 'delete',
                  text: <CustomText color="textDanger">Delete</CustomText>,
                  onClick: this._confirmDelete,
                },
              ],
          beakWidth: 0,
          directionalHint: DirectionalHint.bottomRightEdge,
          directionalHintFixed: true,
        },
      },
    ];

    return isMobile ? moreBtn : listMenu.concat(moreBtn);
  };

  render() {
    const { file, fileThumbnail, folderPath, modalName, loading, refreshAllLink } = this.state;
    const { isMobile } = this.context;

    const previousItem = folderPath[folderPath.length - 2];

    return (
      <>
        <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginBottom: 16 } }}>
          <Stack.Item grow>
            {isMobile ? (
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <CustomIconButton
                  menuIconProps={{ iconName: 'ChevronLeftSmall' }}
                  title="Back"
                  styles={{ menuIcon: { fontSize: 16 }, root: { [BREAKPOINTS_RESPONSIVE.lgUp]: { display: 'none' } } }}
                  {...previousItem}
                  text={undefined}
                />
                <Stack.Item disableShrink>
                  <Icon iconName="folder-open-svg" styles={{ root: { width: 24 } }} />
                </Stack.Item>
              </Stack>
            ) : (
              <CustomBreadcrumb items={folderPath} />
            )}
          </Stack.Item>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <CommandBar
              items={this.menuContentDetail(file, isMobile)}
              onReduceData={() => undefined}
              overflowButtonProps={{
                menuIconProps: {
                  iconName: 'more-svg',
                  styles: { root: { [BREAKPOINTS_RESPONSIVE.lgUp]: { display: 'none' } } },
                },
              }}
              styles={{
                root: {
                  maxHeight: 40,
                  width: 140,
                  [BREAKPOINTS_RESPONSIVE.mdDown]: { height: 30, width: 30 },
                },
                primarySet: {
                  display: 'flex',
                  justifyContent: 'space-between',
                },
              }}
            />
            <Stack.Item disableShrink>
              <PrimaryButton
                splitButtonAriaLabel="Create link"
                text="Create link"
                title="Create link"
                iconProps={isMobile ? undefined : { iconName: 'pin-svg', styles: { root: { marginRight: 4 } } }}
                onClick={() => this._toggleDialog(MODAL_NAME.CREATE_LINK)}
                styles={linkButtonStyles}
              />
            </Stack.Item>
          </Stack>
        </Stack>
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 14 }}>
              <Stack.Item>
                <Image
                  imageFit={ImageFit.contain}
                  src={fileThumbnail || '/img/default-pdf-thumbnail.png'}
                  srcSet={fileThumbnail || '/img/default-pdf-thumbnail-2x.png, /img/default-pdf-thumbnail-3x.png'}
                  alt="Logo"
                  width={isMobile ? 58 : 68}
                  height={isMobile ? 58 : 68}
                />
              </Stack.Item>
              <Stack tokens={{ childrenGap: 14 }} styles={{ root: { overflow: 'hidden' } }}>
                <Text
                  nowrap
                  variant="xLargePlus"
                  styles={{ root: { [BREAKPOINTS_RESPONSIVE.mdDown]: { fontSize: 16 } } }}
                >
                  {file.displayName}
                </Text>
                <Stack horizontal verticalAlign="center">
                  <Stack.Item disableShrink styles={{ root: { marginRight: 8 } }}>
                    <Persona hidePersonaDetails size={PersonaSize.size24} initialsColor={15} text={file.displayName} />
                  </Stack.Item>
                  <Stack.Item align="start">
                    <CustomText color="textSecondary">
                      Last updated{' '}
                      {millisecondsToStr(new Date().toUTCString() - new Date(file.modifiedDate || file.createdDate))}
                    </CustomText>
                  </Stack.Item>
                </Stack>
              </Stack>
            </Stack>
            <Pivot aria-label="File detail pivot" styles={{ root: { marginTop: 32 } }}>
              <PivotItem headerText="Visits">
                <ViewerOfFileList
                  version={file.version}
                  fileId={file.id}
                  name="All Visits"
                  onCreateLink={this._toggleDialog}
                />
              </PivotItem>
              <PivotItem headerText="Links">
                <OverviewPage
                  file={file}
                  version={file.version}
                  refreshAllLink={refreshAllLink}
                  onCreateLink={this._toggleDialog}
                />
              </PivotItem>
              <PivotItem headerText="Analytics">
                <FileAnalytic version={file.version} fileId={file.id} name="FileAnalytics" />
              </PivotItem>
            </Pivot>
            <ShareFileModal
              isOpen={modalName === MODAL_NAME.CREATE_LINK}
              shareDocument={file}
              onToggle={this._toggleDialog}
              onRefreshAllLink={this._onRefreshAllLink}
            />
            <UploadFileModal
              isOpen={modalName === MODAL_NAME.UPLOAD_FILE}
              folderPath={folderPath}
              selectedFolder={{ id: file.directoryId, key: file.directoryId }}
              onToggle={() => this.setState({ modalName: undefined }, () => this._getFile(true))}
              isUpdatedFile={Boolean(file?.id)}
              fileId={file?.id}
            />
            <ExportVisitsModal
              isOpen={modalName === MODAL_NAME.EXPORT_VISITS_MODAL}
              isCancel
              onToggle={this._onCancelExportVisitsEmail}
              onExportVisitEmail={this._onSendExportVisitEmail}
            />
          </>
        )}
      </>
    );
  }
}
FileDetail.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
FileDetail.contextType = GlobalContext;
export default FileDetail;
