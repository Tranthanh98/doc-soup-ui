/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
/* eslint-disable react/prop-types */
/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, FontWeights, PrimaryButton, Separator, Toggle, Dropdown } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import eventBus from 'features/shared/lib/eventBus';
import domainEvents from 'features/shared/domainEvents';
import FolderBiz from 'core/biz/FolderBiz';
import { ShareFileModal, FolderTree, ExportVisitsModal } from 'core/components';
import {
  MODAL_NAME,
  PAGE_PATHS,
  LINK_VIEW_LAYOUT,
  LINK_TYPE,
  TIME_OUT,
  ACTION_LIMITATION,
  FEATURE_KEYS,
} from 'core/constants/Const';
import {
  ModalForm,
  CustomIconButton,
  CustomBreadcrumb,
  CreatedLinkModal,
  LoadingPage,
  ToastMessage,
} from 'features/shared/components';
import { UploadFileModal } from 'features/content/components';
import { AddContentModal, DuplicateRoomPrinciple } from 'features/dataRooms/components';
import fileHelper from 'features/shared/lib/fileHelper';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { success } from 'features/shared/components/ToastMessage';
import withLimitationFeature from 'features/shared/HOCs/withLimitationFeature';
import { ContentList, CollaboratorList, DataRoomNameField, ModifyPermissionModal } from './components';

const stackControlStyles = {
  root: {
    paddingBottom: 10,
  },
};
const leftContainerStyles = {
  root: {
    marginRight: 28,
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        display: 'none',
      },
      [BREAKPOINTS_RESPONSIVE.lgUp]: {
        width: 172,
      },
      [BREAKPOINTS_RESPONSIVE.xlUp]: {
        width: 231,
      },
    },
  },
};

const separatorLineStyle = {
  root: {
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        display: 'none',
      },
    },
  },
};

const contentStyles = {
  root: {
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '100%',
      marginLeft: '0px !important',
    },
    [BREAKPOINTS_RESPONSIVE.lgUp]: {
      width: 'calc(100% - 173px)',
      paddingLeft: '28px !important',
    },
    [BREAKPOINTS_RESPONSIVE.xlUp]: {
      width: 'calc(100% - 232px)',
    },
  },
};

const breadcrumbStackStyles = {
  root: {
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        flexDirection: 'column-reverse',
        '> *': { marginBottom: 18 },
      },
    },
  },
};
const dropdownPresentStyles = {
  title: {
    fontSize: 13,
    height: 30,
    minWidth: 136,
    lineHeight: 26,
  },
};
const formSchema = {
  formTitle: 'Add Folder',
  submitBtnName: 'OK',
  cancleBtnName: 'Cancel',
  formSchema: [
    {
      inputProps: {
        label: 'Folder name',
        id: 'name',
        name: 'name',
        placeholder: 'Please enter a folder name',
        type: 'text',
        required: true,
        maxLength: 256,
        description: '',
      },
    },
  ],
};
const renderPrinciple = () => <DuplicateRoomPrinciple />;
const formSchemaDuplicateRoom = (dataRoom) => ({
  formTitle: 'Duplicate',
  submitBtnName: 'OK',
  cancleBtnName: 'Cancel',
  formSchema: [
    {
      onRenderTop: renderPrinciple,
      inputProps: {
        label: 'Data Room Name',
        id: 'name',
        name: 'name',
        placeholder: 'Please enter a room name',
        type: 'text',
        required: true,
        minLength: 3,
        maxLength: 256,
        autoFocus: true,
        onFocus: (event) => event.target.select(),
      },
      initialValue: dataRoom?.name,
    },
  ],
});

const AddContentButton = withLimitationFeature(ACTION_LIMITATION.DISABLED, [FEATURE_KEYS.TotalAssetsInSpace])(
  CustomIconButton
);

const ChangeStatusAllLinkToggle = withLimitationFeature(ACTION_LIMITATION.DISABLED, [FEATURE_KEYS.TotalAssetsInSpace])(
  Toggle
);

const ShareLinkButton = withLimitationFeature(ACTION_LIMITATION.DISABLED, [FEATURE_KEYS.TotalAssetsInSpace])(
  PrimaryButton
);

class DataRoomDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalName: '',
      dataRoom: { directories: [], files: [], name: '' },
      rootFolders: undefined,
      rootFiles: undefined,
      aggregateContent: undefined,
      folders: undefined,
      files: undefined,
      selectedFolder: {},
      folderPath: [],
      createdLink: undefined,
      isSubmitting: false,
      thumbnailSrcs: {},
    };
    this.menuProps = {
      items: [
        {
          className: 'hiddenLgUp',
          key: 'addContent',
          text: 'Add Content',
          onClick: () => this._toggleDialog(MODAL_NAME.ADD_DATA_ROOM_CONTENT),
          disabled: !props.isAllow,
        },
        {
          key: 'Permissions',
          text: 'Permissions',
          onClick: () => this._toggleDialog(MODAL_NAME.MODIFY_PERMISSION),
          disabled: !props.isAllow,
        },
        {
          key: 'ExportVisits',
          text: 'Export Visits',
          onClick: () => this._onExportDataRoomVisits(),
          disabled: !props.isAllow,
        },
        {
          key: 'Duplicate',
          text: 'Duplicate',
          onClick: () => this._enterDuplicatedRoomName(),
          disabled: !props.isAllow,
        },
        {
          key: 'DeleteDataRoom',
          text: 'Delete Data Room',
          onClick: () => this._initDeleteRoom(),
        },
      ],
      directionalHintFixed: true,
    };
    this._homeFolder = { id: 0, key: 0, name: 'Home', text: 'Home' };
    this._exportVisitsTimer = null;
  }

  componentDidMount() {
    this._listDataRooms();
    this._openCreatedLinksModal();
    eventBus.subscribe(this, domainEvents.DATA_ROOM_ONCHANGE_DOMAINEVENT, (event) => {
      this._handleEvent(event);
    });
  }

  componentWillUnmount() {
    eventBus.unsubscribe(this);
  }

  _openCreatedLinksModal = () => {
    const { history } = this.props;
    const { location } = history;
    if (location && location.state) {
      const { createdLink } = location.state;
      if (createdLink) {
        this.setState({ createdLink });
      }
    }
  };

  _listDataRooms = () => {
    const { match } = this.props;
    const { id } = match.params;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/data-room/${id}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const folders = res.data.directories
            ? res.data.directories.map((x) => ({
                ...x.directory,
                contentId: x.contentId,
                orderNo: x.orderNo,
                isActive: x.isActive,
              }))
            : [];
          const files = res.data.files
            ? res.data.files.map((x) => ({
                ...x.file,
                contentId: x.contentId,
                orderNo: x.orderNo,
                isActive: x.isActive,
              }))
            : [];
          this.setState(
            {
              dataRoom: res.data,
              rootFolders: folders,
              folders,
              files,
              rootFiles: [...files],
              aggregateContent: folders,
              selectedFolder: this._homeFolder,
              folderPath: [{ ...this._homeFolder, onClick: () => this._selectFolder(this._homeFolder) }],
            },
            this._listAllFolder
          );
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _listAllFolder = () => {
    const { rootFolders } = this.state;
    const { getToken } = this.context;

    const requests = [];

    rootFolders.forEach((i) => {
      const request = new RestService().setPath(`/directory/${i.id}/all-children`).setToken(getToken()).get();

      requests.push(request);
    });

    Promise.allSettled(requests).then((responses) => {
      let allFolder = [];
      for (const res of responses) {
        if (res.status === 'fulfilled') {
          const subfoldersOnly = res.value.data;
          allFolder = allFolder.concat(subfoldersOnly);
        }
      }
      this.setState((state) => ({ rootFolders: [...state.rootFolders, ...allFolder] }), this._listAllSubfile);
    });
  };

  _listAllSubfile = () => {
    const { rootFolders, rootFiles, files } = this.state;
    const { getToken } = this.context;

    const requests = [];

    rootFolders.forEach((i) => {
      const request = new RestService().setPath(`file/directory/${i.id}`).setToken(getToken()).get();

      requests.push(request);
    });

    Promise.allSettled(requests).then((responses) => {
      const rootFileIds = rootFiles.map((e) => e.id);
      let allFile = [];
      for (const res of responses) {
        if (res.status === 'fulfilled') {
          let subfilesOnly = res.value.data?.filter((file) => !rootFileIds.includes(file.id));
          subfilesOnly = subfilesOnly?.map((file) => ({ ...file, parentId: file.directoryId }));
          allFile = allFile.concat(subfilesOnly);
        }
      }
      this.setState(
        (state) => ({ aggregateContent: [...state.rootFolders, ...allFile] }),
        this._getFileThumbnail([...rootFiles, ...allFile])
      );
    });
  };

  _listSubfolders = (directoryId) => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/directory/${directoryId}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const subfoldersOnly = res.data.filter((e) => e.id !== directoryId); // get child only of folder
          this.setState((state) => {
            state.rootFolders.forEach((folder) => {
              if (folder.id === directoryId) {
                const expandedFolder = folder;
                expandedFolder.isExpanded = true;
              }
            });
            return {
              folders: subfoldersOnly,
            };
          });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _listSubfiles = (directoryId) => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/file/directory/${directoryId}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          this.setState({ files: res.data });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _getFileThumbnail = (files = []) => {
    const { getToken } = this.context;
    const thumbnailSrcs = {};
    const getThumbnailPromises = files.map((file) =>
      new RestService()
        .setPath(`/file/${file?.id}/thumb/1?version=${file.version}`)
        .setToken(getToken())
        .setResponseType('arraybuffer')
        .get()
        .then((res) => {
          const URL = window.URL || window.webkitURL;
          const imageUrl = URL.createObjectURL(new Blob([res.data], { type: 'image/jpeg', encoding: 'UTF-8' }));
          thumbnailSrcs[file.id] = imageUrl;
        })
        .catch((err) => {
          console.log(err);
        })
    );
    Promise.all(getThumbnailPromises).then(() => {
      this.setState({ thumbnailSrcs });
    });
  };

  _confirmDeleteRoom = () => {
    const { dataRoom } = this.state;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/data-room/${dataRoom.id}`)
      .setToken(getToken())
      .delete()
      .then(() => {
        const { history } = this.props;
        history.push(`/${PAGE_PATHS.dataRooms}`);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _initDeleteRoom = () => {
    const { dataRoom } = this.state;
    window.confirm({
      title: `Are you sure you want to delete ${dataRoom.name}?`,
      subText: (
        <>
          Your teammates will lose access to this room, and any active links they have <b>will be deleted</b>.
        </>
      ),
      yesAction: () => this._confirmDeleteRoom(),
    });
  };

  _toggleDialog = (name) => {
    const { modalName } = this.state;
    if (!name && modalName === MODAL_NAME.CREATE_LINK) {
      this._raiseEventCreatedLink();
    }
    this.setState({ modalName: name });
  };

  _toggleHideModal = () => {
    this.setState({
      createdLink: undefined,
    });
  };

  _addFolder = (values, formProps) => {
    console.log(values);
    formProps.setSubmitting(false);
  };

  _onDeleteDataRoomContent = (dataRoomContentfile) => {
    const { dataRoom } = this.state;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/data-room/${dataRoom.id}/content/${dataRoomContentfile.contentId}`)
      .setToken(getToken())
      .delete()
      .then(() => {
        this._listDataRooms();
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _getFolderPath = (folder) => {
    const { rootFolders } = this.state;
    const folderPath = FolderBiz.getFolderPath(folder, [...rootFolders], this._selectFolder);
    const homeFolderPath = { ...this._homeFolder, onClick: () => this._selectFolder(this._homeFolder) };
    return [homeFolderPath, ...folderPath];
  };

  _getChildrenOfFolder = (folder) => {
    const folderPath = this._getFolderPath(folder);
    this.setState({
      folders: undefined,
      files: undefined,
      selectedFolder: { ...folder, key: folder.id },
      folderPath,
    });
    this._listSubfolders(folder.id);
    this._listSubfiles(folder.id);
  };

  _selectFolder = (folder) => {
    const { selectedFolder } = this.state;
    if (!folder || folder.id === selectedFolder.id) {
      return;
    }
    if (folder.id === 0) {
      this._listDataRooms();
      return;
    }
    this._getChildrenOfFolder(folder);
  };

  _updateDataRoom = ({ name, viewType }) => {
    const { dataRoom } = this.state;
    const { getToken } = this.context;
    if (viewType) {
      this.setState({ isSubmitting: true });
    }
    new RestService()
      .setPath(`/data-room/${dataRoom.id}`)
      .setToken(getToken())
      .put({
        name: name || dataRoom.name,
        viewType: viewType ? viewType.key : dataRoom.viewType,
      })
      .then(() => ToastMessage.success('Data room successfully updated'))
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => this.setState({ isSubmitting: false }));
  };

  _changeAllLinkStatus = (event, checked) => {
    const { dataRoom } = this.state;
    const { getToken } = this.context;
    this.setState({ isSubmitting: true });
    new RestService()
      .setPath(`/data-room/${dataRoom.id}/link-status`)
      .setToken(getToken())
      .put({ disabled: !checked })
      .then(() => {
        ToastMessage.success(`All links had been ${checked ? 'enabled' : 'disabled'}`);
        this._listDataRooms();
      })
      .catch((err) => {
        RestServiceHelper.handleError(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false });
      });
  };

  _onCancelExportVisitsEmail = () => {
    this._toggleDialog();
    clearTimeout(this._exportVisitsTimer);
    this._exportVisits(false);
  };

  _onExportDataRoomVisits = () => {
    this._exportVisitsTimer = window.setTimeout(() => {
      this._exportVisits(false);
      this._toggleDialog();
    }, TIME_OUT.EXPORT_VISITS);

    this._toggleDialog(MODAL_NAME.EXPORT_VISITS_MODAL);
  };

  _duplicateRoom = (values, formProps) => {
    const { dataRoom } = this.state;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/data-room/${dataRoom.id}/duplicate`)
      .setToken(getToken())
      .post(values)
      .then((res) => {
        const duplicatedId = res.data;
        if (duplicatedId) {
          window.location.href = `/${PAGE_PATHS.dataRooms}/${duplicatedId}`;
        }
      })
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => formProps.setSubmitting(false));
  };

  _enterDuplicatedRoomName = () => {
    this.setState({ modalName: MODAL_NAME.DUPLICATE_DATA_ROOM });
  };

  _onSendExportVisitEmail = () => {
    clearTimeout(this._exportVisitsTimer);
    this._toggleDialog();
    this._exportVisits(true);
  };

  _exportVisits = (isEmail) => {
    if (!isEmail) {
      success('Your export is now ready to download');
    }

    const { dataRoom } = this.state;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/data-room/${dataRoom.id}/export-viewer?email=${isEmail}`)
      .setToken(getToken())
      .get()
      .then((response) => {
        if (response.data) {
          fileHelper.download(response.data, response.headers['content-type'], `export-vistit-${dataRoom.name}.csv`);
        }
      })
      .catch((err) => {
        RestServiceHelper.handleError(err);
      });
  };

  /* Events */
  _raiseEventCreatedLink = () => {
    eventBus.publish(domainEvents.LINK_ONCHANGE_DOMAINEVENT, {
      action: domainEvents.ACTION.ADD,
      receivers: [domainEvents.DES.MODIFY_PERMISSION_MODAL],
    });
  };

  _handleEvent = (event) => {
    const { action, receivers } = event.message;
    if (receivers === undefined || receivers.includes(domainEvents.DES.DATA_ROOM_DETAIL_PAGE)) {
      switch (action) {
        case domainEvents.ACTION.UPDATE:
          this._listDataRooms();
          break;
        default:
          break;
      }
    }
  };
  /* End Events */

  render() {
    const {
      modalName,
      dataRoom,
      rootFolders,
      rootFiles,
      aggregateContent,
      folders,
      files,
      selectedFolder,
      folderPath,
      createdLink,
      isSubmitting,
      thumbnailSrcs,
    } = this.state;
    const { match } = this.props;
    return (
      <>
        <CreatedLinkModal
          isOpen={!!createdLink}
          createdLink={createdLink}
          isDataRoom
          onToggle={this._toggleHideModal}
        />
        <Stack horizontal styles={{ root: { height: '100%' } }}>
          <Stack.Item styles={leftContainerStyles}>
            <DataRoomNameField dataRoom={dataRoom} onSubmit={(name) => this._updateDataRoom({ name })} />
            <FolderTree
              allowSelectRootFolder
              folders={rootFolders}
              customProps={{
                rootName: 'Home',
                rootIcon: 'home-folder-svg',
                collapsedIcon: 'folder-svg',
                expandedIcon: 'folder-open-svg',
              }}
              selectedFolder={selectedFolder}
              onSelectFolder={this._selectFolder}
            />
          </Stack.Item>
          <Separator vertical styles={separatorLineStyle} />
          <Stack.Item grow styles={contentStyles}>
            {folderPath.length > 0 ? (
              <>
                <Stack
                  disableShrink
                  horizontal
                  horizontalAlign="end"
                  verticalAlign="center"
                  tokens={{ childrenGap: 16 }}
                  styles={stackControlStyles}
                >
                  <Stack.Item grow className="hiddenLgUp">
                    <DataRoomNameField dataRoom={dataRoom} onSubmit={(name) => this._updateDataRoom({ name })} />
                  </Stack.Item>
                  <ChangeStatusAllLinkToggle
                    onText="ON"
                    offText="OFF"
                    title="Enable/Disable all links"
                    styles={{ root: { marginBottom: 0 } }}
                    checked={!dataRoom?.disabledAllLink}
                    disabled={isSubmitting}
                    onChange={this._changeAllLinkStatus}
                  />
                  <AddContentButton
                    className="hiddenMdDown"
                    menuIconProps={{ iconName: 'download-svg' }}
                    title="Add content"
                    styles={{ menuIcon: { transform: 'rotate(180deg)' } }}
                    onClick={() => this._toggleDialog(MODAL_NAME.ADD_DATA_ROOM_CONTENT)}
                  />
                  <CustomIconButton
                    menuIconProps={{ iconName: 'more-svg' }}
                    title="More"
                    ariaLabel="More"
                    menuProps={this.menuProps}
                  />
                  <ShareLinkButton
                    text="Share"
                    title="Share"
                    iconProps={{ iconName: 'share-svg', className: 'hiddenMdDown' }}
                    styles={{ root: { minWidth: 66 } }}
                    onClick={() => this._toggleDialog(MODAL_NAME.CREATE_LINK)}
                  />
                </Stack>
                <Stack horizontal verticalAlign="end" horizontalAlign="space-between" styles={breadcrumbStackStyles}>
                  <Stack.Item grow styles={{ root: { marginLeft: -16, width: '100%' } }}>
                    <CustomBreadcrumb items={folderPath} maxDisplayedItems={5} ariaLabel="breadcrumb folder" />
                  </Stack.Item>
                  <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 32 }}>
                    <CollaboratorList dataRoom={dataRoom} />
                    <Dropdown
                      styles={dropdownPresentStyles}
                      placeholder="Select an option"
                      name="present"
                      disabled={isSubmitting}
                      options={LINK_VIEW_LAYOUT}
                      defaultSelectedKey={dataRoom?.viewType}
                      onChange={(event, viewType) => this._updateDataRoom({ viewType })}
                    />
                  </Stack>
                </Stack>
                <Text
                  className="hiddenMdDown"
                  block
                  variant="xLarge"
                  styles={{ root: { fontWeight: FontWeights.semibold, marginBottom: 24 } }}
                >
                  {selectedFolder?.name}
                </Text>
                <ContentList
                  folders={folders}
                  files={files}
                  dataRoom={dataRoom}
                  thumbnailSrcs={thumbnailSrcs}
                  onDeleteDataRoomContent={this._onDeleteDataRoomContent}
                  onSelectFolder={this._selectFolder}
                  onAddContent={() => this._toggleDialog(MODAL_NAME.ADD_DATA_ROOM_CONTENT)}
                  getContentDataRoom={this._listDataRooms}
                />
              </>
            ) : (
              <LoadingPage />
            )}
          </Stack.Item>
        </Stack>
        <AddContentModal
          isOpen={modalName === MODAL_NAME.ADD_DATA_ROOM_CONTENT}
          dataRoom={dataRoom}
          onToggle={this._toggleDialog}
          onOpenUploadFileModal={() => this._toggleDialog(MODAL_NAME.UPLOAD_FILE)}
        />
        <UploadFileModal isOpen={modalName === MODAL_NAME.UPLOAD_FILE} onToggle={this._toggleDialog} />
        <ShareFileModal
          linkType={LINK_TYPE.DATA_ROOM}
          shareDocument={dataRoom}
          isOpen={modalName === MODAL_NAME.CREATE_LINK}
          onToggle={this._toggleDialog}
        />
        <ModifyPermissionModal
          aggregateContent={aggregateContent}
          files={rootFiles}
          thumbnailSrcs={thumbnailSrcs}
          dataRoomId={match.params?.id}
          isOpen={modalName === MODAL_NAME.MODIFY_PERMISSION}
          onToggle={this._toggleDialog}
        />
        <ModalForm
          isOpen={modalName === MODAL_NAME.ADD_FOLDER}
          isCancel
          formData={formSchema}
          onToggle={this._toggleDialog}
          onSubmit={this._addFolder}
        />
        <ModalForm
          isOpen={modalName === MODAL_NAME.DUPLICATE_DATA_ROOM}
          isCancel
          formData={formSchemaDuplicateRoom(dataRoom)}
          onToggle={this._toggleDialog}
          onSubmit={this._duplicateRoom}
          noSame={false}
        />
        <ExportVisitsModal
          isOpen={modalName === MODAL_NAME.EXPORT_VISITS_MODAL}
          isCancel
          onToggle={this._onCancelExportVisitsEmail}
          onExportVisitEmail={this._onSendExportVisitEmail}
        />
      </>
    );
  }
}
DataRoomDetail.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
DataRoomDetail.contextType = GlobalContext;
export default withLimitationFeature(ACTION_LIMITATION.PASS_PROP, [FEATURE_KEYS.TotalAssetsInSpace])(DataRoomDetail);
