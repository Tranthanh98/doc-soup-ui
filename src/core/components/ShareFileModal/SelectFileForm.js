/* eslint max-lines: ["warn", {"max": 400, "skipBlankLines": true, "skipComments": true}] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import FolderBiz from 'core/biz/FolderBiz';
import { ThemeContext, Stack, Separator, Text, CheckboxVisibility, SelectionMode, Checkbox } from '@fluentui/react';
import { CustomBreadcrumb, CustomText } from 'features/shared/components';
import { FILE_TYPE } from 'core/constants/Const';
import FolderTree from '../FolderTree';
import ContentList from './ContentList';
import SelectedItem from './SelectedItem';

const selectedWrapperStyles = (theme) => ({
  root: {
    minHeight: 144,
    marginTop: theme.spacing.m,
    padding: theme.spacing.l1,
    backgroundColor: theme.palette.neutralLighter,
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23DADADAFF' stroke-width='4' stroke-dasharray='8%2c 9' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
  },
});
const textEmptyStyles = (theme) => ({
  root: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
});

class SelectedFileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderPath: [],
      selectedFolder: {},
      subfolders: [],
      subfiles: [],
      subDocuments: [],
      selectedSubFolders: [],
      selectedSubFiles: [],
    };
  }

  componentDidMount() {
    this._listFolders();
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
          this.setState({ myFolders: privacy, teamFolders: team });
          this._selectFolder(selectedFolder, listContainSelectedFolder);
          this._isChangeFolder = false;
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _listSubfolders = (directoryId) => {
    const { getToken } = this.context;
    return new RestService()
      .setPath(`/directory/${directoryId}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          return res.data.filter((e) => e.id !== directoryId); // get child only of folder
        }
        return [];
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _listSubfiles = (directoryId) => {
    const { getToken } = this.context;
    return new RestService()
      .setPath(`/file/directory/${directoryId}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          return res.data;
        }
        return [];
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  /**
   * get children of Team folder or My folder.
   */
  _getChildrenOfRootFolder = (folder, folderPath) => {
    const { teamFolders, myFolders } = this.state;
    const subfolders = folder.isTeam
      ? teamFolders.filter((e) => e.parentId === 0)
      : myFolders.filter((e) => e.parentId === 0);
    this.setState(
      { subfolders, subfiles: [], subDocuments: subfolders, folderPath, selectedFolder: { ...folder, key: folder.id } },
      () => this._setDocumentSelection(0)
    );
  };

  _getChildrenOfFolder = (folder, folderPath) => {
    this.setState({
      subfolders: undefined,
      subfiles: undefined,
      subDocuments: undefined,
      folderPath,
      selectedFolder: { ...folder, key: folder.id },
    });
    Promise.allSettled([this._listSubfolders(folder.id), this._listSubfiles(folder.id)]).then((responses) => {
      this.setState(
        {
          subfolders: responses[0].value,
          subfiles: responses[1].value,
          subDocuments: [...responses[0].value, ...responses[1].value],
        },
        () => this._setDocumentSelection(folder.id)
      );
    });
  };

  _selectFolder = (folder, newFolders) => {
    const { selectedFolder, teamFolders, myFolders, subfolders, subfiles } = this.state;
    if (!subfolders && !subfiles) {
      return;
    }
    if (!folder || (folder.id === selectedFolder.id && folder.isTeam === selectedFolder.isTeam && !newFolders)) {
      return;
    }
    const listContainSelectedFolder = folder.isTeam ? teamFolders : myFolders;
    const folderPath = FolderBiz.getFolderPath(folder, newFolders || listContainSelectedFolder, this._selectFolder);

    this._isChangeFolder = true;
    if (folder.id === 0) {
      this._getChildrenOfRootFolder(folder, folderPath);
      return;
    }
    this._getChildrenOfFolder(folder, folderPath);
  };

  _setDocumentSelection = (directoryId) => {
    const { selectedSubFolders, selectedSubFiles } = this.state;
    if (!this._documentSelection) {
      return;
    }
    this._isChangeFolder = false;
    if (selectedSubFolders?.length) {
      selectedSubFolders.forEach((folder) => {
        if (folder?.parentId === directoryId) {
          this._documentSelection.setKeySelected(folder?.id, true);
        }
      });
    }
    if (selectedSubFiles?.length) {
      selectedSubFiles.forEach((file) => {
        if (file?.directoryId === directoryId) {
          this._documentSelection.setKeySelected(file?.id, true);
        }
      });
    }
  };

  _changeSelectItems = () => {
    const { selectedSubFolders, selectedSubFiles } = this.state;
    const { onSelectItems } = this.props;
    onSelectItems(selectedSubFolders, selectedSubFiles);
  };

  _checkIfParentSelected = (subfolder, selectedFolders) => {
    const { teamFolders, myFolders } = this.state;
    const allParents = FolderBiz.getFolderPath(subfolder, subfolder.isTeam ? teamFolders : myFolders);
    let isItsParentSelected = false;
    allParents.forEach((parent) => {
      if (parent.key !== subfolder.id && selectedFolders[parent.key]) {
        isItsParentSelected = true;
      }
    });
    return isItsParentSelected;
  };

  _selecteSubFolders = (selection) => {
    if (!selection || this._isChangeFolder) {
      return;
    }

    // Example: selectedItems = { 10010: {...item1}, 10011: {...item2} }
    this.setState(
      (state) => {
        const prevItems = {};
        const selectedItems = {};
        let newSelectedFolders = [...state.selectedSubFolders];
        selection.forEach((item) => {
          if (item) {
            newSelectedFolders.push(item);
            selectedItems[item.id] = item;
          }
        });
        newSelectedFolders = newSelectedFolders.filter((selectedFolder) => {
          const isRemovedItem =
            !selectedItems[selectedFolder?.id] &&
            selectedFolder.parentId === state.selectedFolder?.id &&
            Boolean(selectedFolder.isTeam) === Boolean(state.selectedFolder?.isTeam); // remove when it is not in selected items

          const isItsParentSelected = this._checkIfParentSelected(selectedFolder, selectedItems); // remove when its parent was selected
          if (prevItems[selectedFolder?.id] || isItsParentSelected || isRemovedItem) {
            return false;
          }

          prevItems[selectedFolder?.id] = true;
          return true;
        });
        // filter to deselect all children files
        const newSelectedFiles = state.selectedSubFiles.filter((selectedFile) => {
          const folderOfFile = [...state.teamFolders, ...state.myFolders].find(
            (e) => e.id === selectedFile.directoryId
          );
          const isItsParentSelected =
            this._checkIfParentSelected(folderOfFile, selectedItems) || selectedItems[selectedFile.directoryId];
          return !isItsParentSelected;
        });
        return {
          selectedSubFolders: newSelectedFolders,
          selectedSubFiles: newSelectedFiles,
        };
      },
      () => this._changeSelectItems()
    );
  };

  _selecteSubFiles = (selection) => {
    if (!selection || this._isChangeFolder) {
      return;
    }

    this.setState(
      (state) => {
        const prevItems = {};
        const selectedItems = {};
        let newSelectedFiles = [...state.selectedSubFiles];
        selection.forEach((item) => {
          newSelectedFiles.push(item);
          if (item) {
            selectedItems[item.id] = item;
          }
        });
        newSelectedFiles = newSelectedFiles.filter((item) => {
          const isRemovedItem = item.directoryId === state.selectedFolder.id && !selectedItems[item?.id];
          if (prevItems[item?.id] || isRemovedItem) {
            return false;
          }
          prevItems[item?.id] = true;
          return true;
        });
        return { selectedSubFiles: newSelectedFiles };
      },
      () => this._changeSelectItems()
    );
  };

  _selectDocuments = (selection) => {
    if (!selection || this._isChangeFolder) {
      this._isChangeFolder = false;
      return;
    }
    this._documentSelection = selection;
    const selectedDocuments = selection.getSelection();
    const selectedFolders = selectedDocuments.filter((e) => !e.extension);
    const selectedFiles = selectedDocuments.filter((e) => e.extension);

    this._selecteSubFolders(selectedFolders);
    this._selecteSubFiles(selectedFiles);
  };

  _removeItem = (type, item) => {
    let selectedItems = 'selectedSubFiles';
    if (type === FILE_TYPE.FOLDER) {
      selectedItems = 'selectedSubFolders';
    }
    this._documentSelection.setKeySelected(item?.id, false);
    this.setState((state) => {
      const newList = state[selectedItems].filter((e) => e?.id !== item?.id);
      return { [selectedItems]: newList };
    }, this._changeSelectItems);
  };

  /**
   * folderPath is list all parents of the selected item.
   * check if is any its parent selected => then not allow select its children.
   * @returns boolean
   */
  _handleAllowSelectItem = () => {
    const { folderPath, selectedSubFolders } = this.state;
    let isAllowSelect = true;
    folderPath.forEach((folder) => {
      if (selectedSubFolders.findIndex((e) => e.id === folder.key) >= 0) {
        isAllowSelect = false;
      }
    });
    return isAllowSelect;
  };

  render() {
    const { selectedFolder, folderPath, myFolders, teamFolders, subDocuments, selectedSubFolders, selectedSubFiles } =
      this.state;
    const { isDesktop, isMobile } = this.context;
    const foldersLength = selectedSubFolders.length;
    const filesLength = selectedSubFiles.length;
    const isCanSelectItems = this._handleAllowSelectItem();
    const disabledDetailListProps = !isCanSelectItems
      ? {
          selectionMode: SelectionMode.multiple,
          onRenderCheckbox: () => (
            <div style={{ pointerEvents: 'none' }}>
              <Checkbox checked disabled />
            </div>
          ),
        }
      : undefined;

    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Stack.Item>
          <Stack horizontal>
            {isDesktop && (
              <>
                <Stack.Item disableShrink styles={{ root: { width: 214, maxHeight: '39vh', overflow: 'auto' } }}>
                  <FolderTree
                    allowSelectRootFolder
                    isTeam
                    folders={teamFolders}
                    customProps={{
                      rootName: 'Team folders',
                      rootIcon: 'team-folder-svg',
                      collapsedIcon: 'folder-svg',
                      expandedIcon: 'folder-open-svg',
                    }}
                    selectedFolder={selectedFolder}
                    onSelectFolder={this._selectFolder}
                  />
                  <FolderTree
                    allowSelectRootFolder
                    folders={myFolders}
                    selectedFolder={selectedFolder}
                    onSelectFolder={this._selectFolder}
                  />
                </Stack.Item>
                <Separator vertical styles={{ root: { marginRight: 20 } }} />
              </>
            )}
            <Stack.Item grow styles={{ root: { width: 517, marginBottom: -30 } }}>
              <CustomBreadcrumb items={folderPath} ariaLabel="breadcrumb with links" />
              <ContentList
                isMobile={isMobile}
                items={subDocuments}
                isModalSelection={isCanSelectItems}
                checkboxVisibility={CheckboxVisibility.always}
                isShareable={false}
                maxHeight="32vh"
                isCanSelectItems={isCanSelectItems}
                onSelectItems={this._selectDocuments}
                canSelectItem={this._handleAllowSelectItem}
                onSelectFolder={this._selectFolder}
                detailListProps={disabledDetailListProps}
              />
            </Stack.Item>
          </Stack>
          <ThemeContext.Consumer>
            {(theme) => (
              <Stack tokens={{ childrenGap: 9 }} styles={selectedWrapperStyles(theme)}>
                {!(foldersLength > 0 || filesLength > 0) && (
                  <Stack grow horizontalAlign="center" verticalAlign="center">
                    <CustomText block variant="mediumPlus" color="textSecondary" styles={textEmptyStyles(theme)}>
                      Please select a folder or file to add
                    </CustomText>
                  </Stack>
                )}
                {foldersLength > 0 && (
                  <>
                    <Text variant="small">Folders : {foldersLength}</Text>
                    <Stack horizontal wrap tokens={{ childrenGap: 24 }}>
                      {selectedSubFolders.map((item, index) => (
                        <SelectedItem key={index} type={FILE_TYPE.FOLDER} item={item} onRemoveItem={this._removeItem} />
                      ))}
                    </Stack>
                  </>
                )}
                {filesLength > 0 && (
                  <>
                    <Text variant="small">Files : {filesLength}</Text>
                    <Stack horizontal wrap tokens={{ childrenGap: 24 }}>
                      {selectedSubFiles.map((item, index) => (
                        <SelectedItem key={index} type={FILE_TYPE.PDF} item={item} onRemoveItem={this._removeItem} />
                      ))}
                    </Stack>
                  </>
                )}
              </Stack>
            )}
          </ThemeContext.Consumer>
        </Stack.Item>
      </Stack>
    );
  }
}
SelectedFileForm.propTypes = {
  onSelectItems: PropTypes.func.isRequired,
};
SelectedFileForm.defaultProps = {};
SelectedFileForm.contextType = GlobalContext;
export default SelectedFileForm;
