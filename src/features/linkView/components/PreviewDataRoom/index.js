/* eslint-disable no-restricted-syntax */
/* eslint-disable max-lines */
/* eslint no-unsafe-optional-chaining: ["error", { "disallowArithmeticOperators": true }] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import TrackService from 'features/shared/services/trackService';
import { Stack, Separator, Text, FontWeights } from '@fluentui/react';
import { FolderTree } from 'core/components';
import FolderBiz from 'core/biz/FolderBiz';
import { FILE_TYPE } from 'core/constants/Const';
import { CustomBreadcrumb } from 'features/shared/components';
import DataRoomViewType from 'features/shared/components/DataRoomViewType';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import PreviewHeader from '../PreviewHeader';
import EmptyDataRoom from '../EmptyDataRoom';

const documentWrapperStyles = {
  root: {
    width: '15vw',
    minWidth: 240,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      display: 'none',
    },
  },
};
const subDocumentWrapperStyles = { root: { paddingLeft: 24, [BREAKPOINTS_RESPONSIVE.mdDown]: { paddingLeft: 0 } } };

class PreviewDataRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedFolder: undefined,
      folders: undefined,
      subfolders: [],
      subfiles: [],
      originalSubfolders: [],
      originalSubfiles: [],
      folderPath: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.folders && props.folders !== state.folders) {
      return {
        folders: props.folders,
        selectedFolder: { id: 0, key: 0, isTeam: false, name: 'Home' },
        subfolders: props.folders,
        subfiles: props.files,
        originalSubfiles: props.files,
        originalSubfolders: props.folders,
      };
    }
    return null;
  }

  componentDidMount() {
    this._listAllFolder();
  }

  _listAllFolder = async () => {
    const { subfolders } = this.state;
    const { match } = this.props;
    const { linkId } = match.params;
    const { viewerId } = this.props;
    const clientInfo = await TrackService.getTrackPayload();

    const requests = [];

    subfolders.forEach((i) => {
      const request = new RestService()
        .setPath(`/view-link/${linkId}/list-all-content-children`)
        .setHeaders({
          'x-viewerId': viewerId,
          'x-deviceId': clientInfo.app.deviceId,
          'x-directoryId': i.id,
        })
        .get();

      requests.push(request);
    });

    Promise.allSettled(requests).then((responses) => {
      let index = 0;
      for (const res of responses) {
        if (res.status === 'fulfilled') {
          // eslint-disable-next-line no-loop-func
          const subfoldersOnly = res.value.data.map((i) => ({ ...i, contentId: subfolders[index]?.contentId }));

          this.setState((state) => {
            return {
              folders: [...state.folders, ...subfoldersOnly],
            };
          });
        }
      }
      index++;
    });
  };

  _getSubDocuments = async (selectedFolder) => {
    this.setState({
      isLoading: true,
      subfolders: undefined,
      subfiles: undefined,
    });
    const { match } = this.props;
    const { linkId } = match.params;
    const { viewerId } = this.props;
    const clientInfo = await TrackService.getTrackPayload();

    new RestService()
      .setPath(`/view-link/${linkId}/content/${selectedFolder?.contentId}/directory/${selectedFolder?.id}`)
      .setHeaders({
        'x-viewerId': viewerId,
        'x-deviceId': clientInfo.app.deviceId,
      })
      .get()
      .then((res) => {
        if (res.data) {
          const { directories, files, contentId } = res.data;
          const subfolders = directories.map((e) => ({ ...e, contentId }));
          this.setState(
            (state) => {
              let isSelectedFolderHasChildren = false;
              state.folders.forEach((folder) => {
                if (folder.id === selectedFolder?.id) {
                  const expandedFolder = folder;
                  expandedFolder.isExpanded = true;
                }
                if (folder.parentId === selectedFolder?.id) {
                  isSelectedFolderHasChildren = true;
                }
              });
              return {
                folders: isSelectedFolderHasChildren ? state.folders : [...state.folders, ...subfolders],
                subfolders,
                subfiles: files,
                selectedFolder: { ...selectedFolder, contentId },
                originalSubfolders: subfolders,
                originalSubfiles: files,
              };
            },
            () => this._handleFolderPath(selectedFolder)
          );
        }
      })
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => this.setState({ isLoading: false }));
  };

  _getSubDocumentsOfRoot = (folder) => {
    const { folders, files } = this.props;
    this.setState(
      {
        subfolders: folders,
        subfiles: files,
        selectedFolder: folder,
        originalSubfolders: folders,
        originalSubfiles: files,
      },
      () => this._handleFolderPath(folder)
    );
  };

  _viewSubFile = async (subfile) => {
    const { match, viewerId } = this.props;
    const { linkId } = match.params;
    const { selectedFolder, isLoading } = this.state;
    if (isLoading) {
      return;
    }
    this.setState({ isLoading: true, loadingFileId: subfile.id });
    const clientInfo = await TrackService.getTrackPayload();
    new RestService()
      .setPath(
        // eslint-disable-next-line max-len
        `/view-link/${linkId}/content/${selectedFolder?.contentId}/directory/${subfile?.directoryId}/file/${subfile?.id}`
      )
      .setHeaders({
        'x-viewerId': viewerId,
        'x-deviceId': clientInfo.app.deviceId,
      })
      .get()
      .then((res) => {
        if (res.data) {
          window.open(`/view/${res.data}`);
        }
      })
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => this.setState({ isLoading: false, loadingFileId: undefined }));
  };

  _viewFile = async (file) => {
    const { match, viewerId } = this.props;
    const { linkId } = match.params;
    const { isLoading } = this.state;
    if (isLoading) {
      return;
    }
    this.setState({ isLoading: true, loadingFileId: file.id });
    const clientInfo = await TrackService.getTrackPayload();
    new RestService()
      .setPath(`/view-link/${linkId}/content/${file?.contentId}/file/${file?.id}`)
      .setHeaders({
        'x-viewerId': viewerId,
        'x-deviceId': clientInfo.app.deviceId,
      })
      .get()
      .then((res) => {
        if (res.data) {
          window.open(`/view/${res.data}`);
        }
      })
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => this.setState({ isLoading: false, loadingFileId: undefined }));
  };

  _selectFile = (selectedFile) => {
    const { isLoading } = this.state;
    if (isLoading || !selectedFile) {
      return;
    }
    if (selectedFile.contentId) {
      this._viewFile(selectedFile);
      return;
    }
    this._viewSubFile(selectedFile);
  };

  _selectFolder = (folder) => {
    const { isLoading, selectedFolder } = this.state;
    if (isLoading || folder?.id === selectedFolder?.id) {
      return;
    }
    if (folder.id === 0) {
      this._getSubDocumentsOfRoot(folder);
      return;
    }
    this._getSubDocuments({ ...folder, key: folder.id });
  };

  _searchSubDocument = (keyword) => {
    const { originalSubfolders, originalSubfiles } = this.state;
    if (!keyword) {
      this.setState({
        subfolders: [...originalSubfolders],
        subfiles: [...originalSubfiles],
      });
    } else {
      const lowCaseKeyword = keyword.toLowerCase();
      const subfolders = originalSubfolders.filter((e) => e.displayName?.toLowerCase()?.includes(lowCaseKeyword));
      const subfiles = originalSubfiles.filter((e) => e.name?.toLowerCase()?.includes(lowCaseKeyword));
      this.setState({ subfolders, subfiles });
    }
  };

  _handleFolderPath = (folder) => {
    const { folders } = this.state;
    const currentFolder = folders?.find((i) => i.id === folder.id);

    const folderPath = FolderBiz.getFolderPath(currentFolder, folders, this._selectFolder);

    if (folder.id !== 0) {
      folderPath.unshift({
        key: 0,
        text: 'Home',
        onClick: () => this._getSubDocumentsOfRoot({ id: 0, key: 0, isTeam: false, name: 'Home' }),
      });
    }
    this.setState({ folderPath });
  };

  render() {
    const { loadingFileId, selectedFolder, folders, subfolders, subfiles, folderPath } = this.state;
    const { viewType, linkCreator, match, viewerId, dataRoomName, allowDownloadFile } = this.props;
    const { linkId } = match.params;

    let items = [];
    if (subfolders) {
      items = [...subfolders?.map((i) => ({ ...i, type: FILE_TYPE.FOLDER }))];
    }

    if (subfiles) {
      items = [...items, ...subfiles];
    }

    return (
      <>
        <PreviewHeader
          linkCreator={linkCreator}
          allowDownloadFile={allowDownloadFile}
          dataRoomName={dataRoomName}
          viewerId={viewerId}
          onSearchSubDocument={this._searchSubDocument}
        />
        <Stack tokens={{ childrenGap: 24, padding: 30 }}>
          <Stack horizontal horizontalAlign="start" verticalAlign="end">
            <Text block variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold, marginTop: 16 } }}>
              {dataRoomName}
            </Text>
          </Stack>
          <Stack grow horizontal>
            <Stack.Item disableShrink styles={documentWrapperStyles}>
              {folders?.length > 0 && (
                <FolderTree
                  allowSelectRootFolder
                  isTeam={false}
                  customProps={{
                    rootName: 'Home',
                    collapsedIcon: 'folder-svg',
                  }}
                  folders={folders}
                  selectedFolder={selectedFolder}
                  onSelectFolder={this._selectFolder}
                />
              )}
            </Stack.Item>
            <Separator vertical styles={{ root: { [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' } } }} />
            <Stack.Item grow styles={subDocumentWrapperStyles}>
              {folderPath.length > 0 ? (
                <Stack styles={{ root: { marginLeft: -16 } }}>
                  <CustomBreadcrumb items={folderPath} />
                </Stack>
              ) : null}
              <Stack>
                <Text styles={{ root: { padding: '0px 0px 20px' } }} variant="xLarge">
                  {selectedFolder.name}
                </Text>
              </Stack>
              {subfolders?.length === 0 && subfiles?.length === 0 ? (
                <EmptyDataRoom />
              ) : (
                <DataRoomViewType
                  viewType={viewType}
                  items={items}
                  loadingFileId={loadingFileId}
                  onClickItem={(item) =>
                    item.type === FILE_TYPE.FOLDER ? this._selectFolder(item) : this._selectFile(item)
                  }
                  linkId={linkId}
                  viewerId={viewerId}
                />
              )}
            </Stack.Item>
          </Stack>
        </Stack>
      </>
    );
  }
}
PreviewDataRoom.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]).isRequired,
  viewerId: PropTypes.number.isRequired,
  folders: PropTypes.oneOfType([PropTypes.array]),
  files: PropTypes.oneOfType([PropTypes.array]),
  viewType: PropTypes.number,
  linkCreator: PropTypes.oneOfType([PropTypes.object]),
  dataRoomName: PropTypes.string,
  allowDownloadFile: PropTypes.bool,
};
PreviewDataRoom.defaultProps = {
  folders: [],
  files: [],
  viewType: 0,
  linkCreator: {},
  dataRoomName: '',
  allowDownloadFile: false,
};
export default PreviewDataRoom;
