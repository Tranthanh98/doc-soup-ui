/* eslint max-lines: ["warn", {"max": 400, "skipBlankLines": true, "skipComments": true}] */
import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import eventBus from 'features/shared/lib/eventBus';
import domainEvents from 'features/shared/domainEvents';
import { Stack } from '@fluentui/react';
import FolderBiz from 'core/biz/FolderBiz';
import { ModalForm } from 'features/shared/components';
import { MODAL_NAME, DRAG_DROP_TYPE, PAGE_PATHS } from 'core/constants/Const';
import { UploadFileModal, ShareFileModal } from 'features/content/components';
import { success, error } from 'features/shared/components/ToastMessage';
import { TextMessage } from 'core/constants/Resource';
import ContentDocumentView from './components/ContentDocumentView';

const stackContentStyles = { root: { marginBottom: 24 } };

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalName: '',
      folderData: {},
      folderPath: [],
      selectedFolder: { isTeam: true },
      subfolders: [],
      isDisplayNoContentPage: false,
    };
  }

  componentDidMount() {
    this._listFolders();
    eventBus.subscribe(this, domainEvents.FILE_ONCHANGE_DOMAINEVENT, (event) => {
      this._handleEvent(event);
    });
  }

  componentWillUnmount() {
    eventBus.unsubscribe(this);
  }

  _getSelectedFolder = (teamFolders, myFolders, updatedFolderId) => {
    const { selectedFolder } = this.state;
    const newSelectedFolder = { ...selectedFolder }; // get selected folder from state
    const folders = newSelectedFolder.isTeam ? teamFolders : myFolders;
    const result = { listContainSelectedFolder: folders };
    if (!newSelectedFolder.id) {
      // get selected folder from context or get default folder
      const { selectedFolderId } = this.context;

      if (typeof selectedFolderId === 'number') {
        result.selectedFolder = [...teamFolders, ...myFolders].find((e) => e.id === selectedFolderId);
      }

      if (!result.selectedFolder) {
        result.selectedFolder = teamFolders[0] || myFolders[0] || { id: 0, key: 0, name: 'Team folders', isTeam: true };
      }

      return result;
    }
    // get selected folder from fetched list
    if (updatedFolderId === newSelectedFolder.id) {
      result.selectedFolder = folders.find((e) => e.id === newSelectedFolder.id);

      return result;
    }

    return result;
  };

  _expandParentOfFolder = (updatedFolder, teamFolders, myFolders) => {
    // handle expand parent of updated folder
    if (updatedFolder?.parentId) {
      const parentOfUpdatedFolder = updatedFolder?.isTeam
        ? teamFolders.find((e) => e.id === updatedFolder?.parentId)
        : myFolders.find((e) => e.id === updatedFolder?.parentId);
      parentOfUpdatedFolder.isExpanded = true;
    }
    return { teamFolders, myFolders };
  };

  _listFolders = (updatedFolder) => {
    const { getToken } = this.context;
    new RestService()
      .setPath('/directory')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const { privacy, team } = res.data;
          let teamFolders = team;
          let myFolders = privacy;
          const { selectedFolder, listContainSelectedFolder } = this._getSelectedFolder(
            teamFolders,
            myFolders,
            updatedFolder?.id
          );
          if (updatedFolder) {
            this._raiseEventUpdateFolders(teamFolders, myFolders);
            const result = this._expandParentOfFolder(updatedFolder, teamFolders, myFolders);
            teamFolders = result.teamFolders;
            myFolders = result.myFolders;
          }
          this.setState({ myFolders, teamFolders, isDisplayNoContentPage: true });
          this._selectFolder(selectedFolder, listContainSelectedFolder);
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _listSubfolders = (directoryId) => {
    const { getToken } = this.context;

    new RestService()
      .setPath(`/directory/${directoryId}/aggregate-content`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const subfoldersOnly = res.data.filter((e) => e.id !== directoryId); // get child only of folder
          this.setState({ subfolders: subfoldersOnly });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _listSubfoldersOfRoot = (folder) => {
    this.setState((state) => {
      let subfolders = folder.isTeam ? state.teamFolders : state.myFolders;
      subfolders = subfolders.filter((e) => e.parentId === 0);
      return { subfolders };
    });
  };

  _toggleDialog = (name) => {
    this.setState({ modalName: name, shareDocument: undefined });
  };

  _initAddUpdateFolder = (parentFolder) => {
    // Add foder into its parent or current selected folder.
    this.setState((state) => ({ folderData: parentFolder || state.selectedFolder }));
    this._toggleDialog(MODAL_NAME.ADD_FOLDER);
  };

  _deleteFolder = (folder) => {
    window.confirm({
      title: (
        <>
          Are you sure you want to
          <br />
          {`delete ${folder.name}?`}
        </>
      ),
      yesText: 'Yes, Delete folder',
      noText: 'Cancel',
      pRight: 60,
      subText: folder.isTeam ? TextMessage.WARNING_DELETE_TEAM_FOLDER : TextMessage.WARNING_DELETE_PERSONAL_FOLDER,
      yesAction: () => this._confirmDeleteFolder(folder),
    });
  };

  _confirmDeleteFolder = (folder) => {
    const { selectedFolder, teamFolders, myFolders } = this.state;
    const { getToken } = this.context;
    if (folder && folder.id) {
      new RestService()
        .setPath(`/directory/${folder.id}`)
        .setToken(getToken())
        .delete()
        .then(() => {
          success('Folder deleted succesfully');
          this._listFolders();
          this._listSubfolders(selectedFolder.id);
          this._toggleDialog();
          if (folder.id === selectedFolder.id) {
            let parentFolder;
            if (folder.isTeam) {
              parentFolder = teamFolders.find((i) => i.id === folder.parentId);
            } else {
              parentFolder = myFolders.find((i) => i.id === folder.parentId);
            }

            if (parentFolder) {
              this._selectFolder(parentFolder);
            } else {
              this._selectFolder(myFolders[0]);
            }
          }
        })
        .catch(({ response }) => {
          const { data } = response;
          error(data?.message);
        });
    }
  };

  _addUpdateFolder = (values, formProps) => {
    const { getToken } = this.context;
    const { folderData } = this.state;
    if (folderData.oldName) {
      // Rename folder
      new RestService()
        .setPath(`/directory/${folderData.id}/rename`)
        .setToken(getToken())
        .put({ ...values, id: folderData.id })
        .then(() => {
          this._listFolders(folderData);
          this._toggleDialog();
        })
        .catch((err) => RestServiceHelper.handleError(err, formProps))
        .finally(() => formProps.setSubmitting(false));
    } else {
      // Add new folder
      const postValues = values;
      postValues.parentId = folderData.id;
      postValues.isTeam = !!folderData.isTeam;
      new RestService()
        .setPath('/directory')
        .setToken(getToken())
        .post(postValues)
        .then((res) => {
          if (res.data) {
            this._listFolders({ id: res.data, ...postValues });
            this._listSubfolders(folderData.id);
            this._toggleDialog();
          }
        })
        .catch((err) => RestServiceHelper.handleError(err, formProps))
        .finally(() => formProps.setSubmitting(false));
    }
  };

  _handleSelectItem = (item) => {
    const { history } = this.props;
    if (item.isFile) {
      history.push(`/${PAGE_PATHS.fileDetail}/${item.id}`);
    } else {
      this._selectFolder(item);
    }
  };

  _selectFolder = (folder, newFolders) => {
    const { selectedFolder, teamFolders, myFolders, subfolders } = this.state;
    if (!subfolders) {
      return;
    }
    if (!folder || (folder.id === selectedFolder.id && folder.isTeam === selectedFolder.isTeam && !newFolders)) {
      return;
    }
    const listContainSelectedFolder = folder.isTeam ? teamFolders : myFolders;
    const folderPath = FolderBiz.getFolderPath(folder, newFolders || listContainSelectedFolder, this._selectFolder);
    this.setState({
      subfolders: undefined,
      selectedFolder: { ...folder, key: folder.id },
      folderPath,
    });
    const { setSelectedFolderId } = this.context;

    setSelectedFolderId(folder.id); // save selected folder into context
    if (folder?.id === 0) {
      this._listSubfoldersOfRoot(folder);
    } else {
      this._listSubfolders(folder.id);
    }
  };

  _handleMoveFolder = (srcItem, desItem) => {
    if (srcItem && desItem && srcItem.id !== desItem.id) {
      const putData = {
        id: srcItem.id,
        sourceLevel: srcItem.level,
        newParentId: desItem.id,
        destinationLevel: desItem.level,
        isTeam: desItem.isTeam,
      };
      const { getToken } = this.context;
      new RestService()
        .setPath(`/directory/${srcItem.id}/move`)
        .setToken(getToken())
        .put(putData)
        .then(() => {
          const movedItem = { ...putData, parentId: desItem.id };
          this._listFolders(movedItem);
        })
        .catch((err) => RestServiceHelper.handleError(err));
    }
  };

  _handleMoveFile = (srcItem, desItem) => {
    if (srcItem && desItem && srcItem.directoryId !== desItem.id) {
      const putData = { id: srcItem.id, newDirectoryId: desItem.id };
      const { getToken } = this.context;
      new RestService()
        .setPath(`/file/${srcItem.id}/move`)
        .setToken(getToken())
        .put(putData)
        .then(() => {
          const { selectedFolder } = this.state;
          this._listSubfolders(selectedFolder.id);
        })
        .catch((err) => RestServiceHelper.handleError(err));
    }
  };

  _handleDropDocument = (srcItem, desItem) => {
    if (srcItem.type === DRAG_DROP_TYPE.FOLDER) {
      this._handleMoveFolder(srcItem, desItem);
    } else {
      this._handleMoveFile(srcItem, desItem);
    }
  };

  _initShareDocument = (item) => {
    this.setState({ modalName: MODAL_NAME.SHARE_FILE, shareDocument: item });
  };

  /* Events */
  _raiseEventUpdateFolders = (teamFolders, myFolders) => {
    eventBus.publish(domainEvents.FOLDER_ONCHANGE_DOMAINEVENT, {
      action: domainEvents.ACTION.UPDATE,
      value: { teamFolders, myFolders },
      receivers: [domainEvents.DES.UPLOAD_FILE_MODAL],
    });
  };

  _handleEvent = (event) => {
    const { action, value, receivers } = event.message;
    if (receivers === undefined || receivers.includes(domainEvents.DES.CONTENT_PAGE)) {
      switch (action) {
        case domainEvents.ACTION.UPLOADED:
          if (value && value.directionId) {
            this._listSubfolders(value.directionId);
          }
          break;
        default:
          break;
      }
    }
  };
  /* End Events */

  _handleDeleteFile = (file) => {
    const { getToken } = this.context;

    new RestService()
      .setPath(`/file/${file.id}?nda=${file.nda || false}`)
      .setToken(getToken())
      .delete()
      .then(() => {
        success('Delete file successfully');
        const { selectedFolder } = this.state;
        this._listSubfolders(selectedFolder.id);
      })
      .catch((err) => {
        window.alert(`Delete failed: ${err.message}`);
      });
  };

  render() {
    const {
      modalName,
      selectedFolder,
      folderData,
      folderPath,
      myFolders,
      teamFolders,
      subfolders,
      shareDocument,
      isDisplayNoContentPage,
    } = this.state;
    return (
      <>
        <Stack grow horizontal styles={stackContentStyles}>
          <ContentDocumentView
            isDisplayNoContentPage={isDisplayNoContentPage}
            myFolders={myFolders}
            teamFolders={teamFolders}
            selectedFolder={selectedFolder}
            folderPath={folderPath}
            subfolders={subfolders}
            onToggle={this._toggleDialog}
            initAddUpdateFolder={this._initAddUpdateFolder}
            onSelectFolder={this._handleSelectItem}
            onDropDocument={this._handleDropDocument}
            initShareDocument={this._initShareDocument}
            onDeleteFolder={this._deleteFolder}
            onDeleteFile={this._handleDeleteFile}
          />
        </Stack>
        <UploadFileModal
          isOpen={modalName === MODAL_NAME.UPLOAD_FILE}
          folderPath={folderPath}
          selectedFolder={selectedFolder}
          onToggle={this._toggleDialog}
        />
        <ShareFileModal
          isOpen={modalName === MODAL_NAME.SHARE_FILE}
          shareDocument={shareDocument}
          onToggle={this._toggleDialog}
          onOpenUploadFileModal={() => this._toggleDialog(MODAL_NAME.UPLOAD_FILE)}
        />
        <ModalForm
          isOpen={modalName === MODAL_NAME.ADD_FOLDER}
          isCancel
          formData={FolderBiz.getFolderFormSchema(folderData.oldName)}
          onToggle={this._toggleDialog}
          onSubmit={this._addUpdateFolder}
        />
      </>
    );
  }
}
Content.contextType = GlobalContext;
export default Content;
