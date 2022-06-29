import { DRAG_DROP_TYPE, STRING } from 'core/constants/Const';

class FolderBiz {
  /**
   *
   * @param {object} folder
   * @param {array} folders
   * @returns {array}
   */
  getFolderPath(folder, folders, onSelectFolder) {
    if (!folder) {
      return [];
    }
    let path = [{ text: folder.name, key: folder.id, onClick: () => onSelectFolder(folder) }];

    if (folder.id === 0) {
      return path;
    }

    const _findParentName = (parentId) => {
      if (parentId) {
        for (let i = 0; i < folders.length; i++) {
          const parent = folders[i];
          if (parent.id === parentId) {
            path = [{ text: parent.name, key: parent.id, onClick: () => onSelectFolder(parent) }, ...path];
            _findParentName(parent.parentId);
            break;
          }
        }
      }
      if (parentId === 0) {
        const teamOrMyFolder = {
          ...folder,
          name: folder?.isTeam ? STRING.TEAM_FOLDERS : STRING.MY_FOLDERS,
          id: 0,
          key: 0,
        };
        const rootFolder = folders.find((item) => item.id === 0 && typeof item.isTeam !== 'boolean') || teamOrMyFolder;
        path = [{ text: rootFolder.name, key: rootFolder.id, onClick: () => onSelectFolder(rootFolder) }, ...path];
      }
    };

    _findParentName(folder.parentId);
    return path;
  }

  /**
   *
   * @param {string} name
   * @returns {object}
   */
  getFolderFormSchema(name) {
    return {
      formTitle: name ? 'Rename Folder' : 'Add Folder',
      submitBtnName: 'OK',
      cancleBtnName: 'Cancel',
      formSchema: [
        {
          inputProps: {
            label: 'Folder name',
            id: 'name',
            name: name ? 'newName' : 'name',
            placeholder: 'Please enter a folder name',
            type: 'text',
            required: true,
            minLength: 3,
            maxLength: 200,
            description: '',
            autoFocus: true,
          },
          initialValue: name,
        },
      ],
    };
  }

  _mergeFolder(folder, folderList, expandedFolder) {
    const parentFolder = folder;
    parentFolder.key = folder.id;
    parentFolder.isExpanded = expandedFolder[folder.id];
    parentFolder.links = [];
    const { length } = folderList;
    for (let i = 0; i < length; i++) {
      if (parentFolder.id === folderList[i].parentId) {
        const subfolder = this._mergeFolder(folderList[i], folderList, expandedFolder);
        const exsitIndex = parentFolder.links.findIndex((e) => e.id === subfolder.id);
        if (exsitIndex < 0) {
          parentFolder.isExpanded = subfolder.isExpanded || parentFolder.isExpanded;
          parentFolder.links.push({ ...subfolder });
          subfolder.isMerged = true;
        }
      }
    }
    return parentFolder;
  }

  /**
   *
   * @param {array} folders
   * @param {object} expandedFolder
   * @returns {array}
   * [{
   *    id: 1,
   *    parentId: 0,
   *    folder: name1,
   *    isExpanded: true,
   *      links:[
   *        { folder: name 1.1, parentId: 1 },
   *        { folder: name 1.2, parentId: 1 }
   *      ]
   * }]
   */
  convertFoldersToTreeData(folders = [], expandedFolder = {}) {
    let folderTree = folders.map((e) => ({ ...e }));
    if (folderTree.length) {
      for (let i = 0; i < folderTree.length; i++) {
        folderTree[i].key = folderTree[i].id;
        this._mergeFolder(folderTree[i], folderTree, expandedFolder);
      }
    }

    folderTree = folderTree.filter((e) => e && e.links && !e.isMerged);
    return folderTree;
  }

  /**
   *
   * @param {object} srcItem
   * @param {object} desItem
   * @param {array} folderList
   * @returns {boolean}
   */
  allowMoveDocument(srcItem, desItem, folderList) {
    if (srcItem.isTeam !== desItem.isTeam) {
      return true;
    }
    if (srcItem.type === DRAG_DROP_TYPE.FILE) {
      if (srcItem.directoryId === desItem.id) {
        return false;
      }
      return true;
    }
    if (srcItem.id === desItem.id || srcItem.parentId === desItem.id) {
      return false;
    }
    if (this.desItemId !== desItem.id) {
      // get all parent of desItem
      this.folderPath = this.getFolderPath(desItem, folderList);
      this.desItemId = desItem.id;
    }

    const { length } = this.folderPath;
    for (let i = 0; i < length; i++) {
      if (this.folderPath[i].key === srcItem.id) {
        return false;
      }
    }
    return true;
  }

  /**
   *
   * @param {array} team
   * @param {array} privacy
   * @returns {object}
   */
  getFirstFolder = (team, privacy) => {
    const folders = team.length ? team : privacy;
    const selectedFolder = folders.find((e) => e.level === 0) || {};
    selectedFolder.key = selectedFolder.id;
    return { selectedFolder, listContainSelectedFolder: folders };
  };
}

export default new FolderBiz();
