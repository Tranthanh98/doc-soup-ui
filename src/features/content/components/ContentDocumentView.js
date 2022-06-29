import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Resizable } from 're-resizable';
import { Stack, Separator, Text, FontWeights, Icon, ContextualMenu } from '@fluentui/react';
import { FolderTree } from 'features/content/components';
import { CustomBreadcrumb } from 'features/shared/components';
import { MODAL_NAME, DRAG_DROP_TYPE, STRING } from 'core/constants/Const';
import GlobalContext from 'security/GlobalContext';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import EmptyContentPage from './EmptyContentPage';
import DocumentDragLayer from './DocumentDragLayer';
import ContentManagerButtons from './ContentManagerButtons';
import ContentList from './ContentList';

const folderTreeWidth = 250;
const folderTreeWidthTablet = 200;

const contentWrapperStyles = {
  root: {
    minWidth: folderTreeWidth,
  },
};
const pageTitleStyles = { root: { fontWeight: FontWeights.bold, marginBottom: 48 } };
const stackControlStyles = {
  root: { paddingBottom: 5 },
};

const folderNameStyles = {
  root: {
    fontWeight: 500,
    maxWidth: 258,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
};

export default function ContentDocumentView(props) {
  const {
    myFolders,
    teamFolders,
    selectedFolder,
    folderPath,
    subfolders,
    onToggle,
    initAddUpdateFolder,
    onSelectFolder,
    onDropDocument,
    initShareDocument,
    isDisplayNoContentPage,
    onDeleteFolder,
    onDeleteFile,
  } = props;

  const context = useContext(GlobalContext);

  const [displayMobileRootFolder, setDisplayRootFolder] = useState(false);

  const refBackBtn = React.useRef();

  const isEmptyContent =
    (teamFolders && teamFolders.length < 1 && myFolders && myFolders.length < 1) ||
    (subfolders && subfolders.length < 1);

  const resizableWidth = context.isTablet ? folderTreeWidthTablet : folderTreeWidth;

  const _switchRootFolder = (isTeam) => {
    onSelectFolder({ id: 0, key: 0, name: isTeam ? STRING.TEAM_FOLDERS : STRING.MY_FOLDERS, isTeam });
  };

  const _handlerBackFolder = () => {
    if (folderPath.length > 1) {
      setDisplayRootFolder(false);
      const folderKey = folderPath[folderPath.length - 2].key;
      const rootFolder = selectedFolder.isTeam ? teamFolders : myFolders;
      const selected = rootFolder.find((i) => i.id === folderKey);
      if (selected) {
        onSelectFolder(selected);
        return;
      }
      _switchRootFolder(selectedFolder.isTeam);
      return;
    }
    setDisplayRootFolder(true);
  };

  return (
    <>
      <Stack styles={{ root: { [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' } } }}>
        <Resizable
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          handleClasses={{ right: 'resizable-right-line' }}
          defaultSize={{ width: resizableWidth }}
          minWidth={resizableWidth}
          maxWidth={resizableWidth * 2}
        >
          <Text block variant="xLarge" styles={pageTitleStyles}>
            Content
          </Text>
          <FolderTree
            allowSelectRootFolder={false}
            showManageMenu
            dragable
            dropable
            dragType={DRAG_DROP_TYPE.FOLDER}
            dropAccept={[DRAG_DROP_TYPE.FOLDER, DRAG_DROP_TYPE.FILE]}
            isTeam
            folders={teamFolders}
            customProps={{
              rootName: 'Team folders',
              rootIcon: 'team-folder-svg',
              collapsedIcon: 'folder-svg',
              expandedIcon: 'folder-open-svg',
            }}
            selectedFolder={selectedFolder}
            onAddUpdateFolder={initAddUpdateFolder}
            onSelectFolder={onSelectFolder}
            onDrop={onDropDocument}
            onDeleteFolder={onDeleteFolder}
          />
          <FolderTree
            allowSelectRootFolder={false}
            showManageMenu
            dragable
            dropable
            dragType={DRAG_DROP_TYPE.FOLDER}
            dropAccept={[DRAG_DROP_TYPE.FOLDER, DRAG_DROP_TYPE.FILE]}
            folders={myFolders}
            selectedFolder={selectedFolder}
            onAddUpdateFolder={initAddUpdateFolder}
            onSelectFolder={onSelectFolder}
            onDrop={onDropDocument}
            onDeleteFolder={onDeleteFolder}
          />
        </Resizable>
      </Stack>
      <Stack styles={{ root: { height: '100%', [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' } } }}>
        <Separator vertical />
      </Stack>

      <Stack.Item grow style={{ paddingLeft: context.isMobile ? 0 : 20 }} styles={contentWrapperStyles}>
        <Stack
          horizontal
          verticalAlign="center"
          tokens={{ childrenGap: 8 }}
          horizontalAlign="space-between"
          styles={stackControlStyles}
        >
          <Stack.Item grow styles={{ root: { [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' } } }}>
            <CustomBreadcrumb
              styles={{ root: { margin: 0 }, overflow: { height: 37 } }}
              items={folderPath}
              maxDisplayedItems={5}
              ariaLabel="breadcrumb folder"
            />
          </Stack.Item>
          <Stack.Item grow style={{ marginLeft: 0 }}>
            <Text
              variant="xLarge"
              styles={{ root: { ...pageTitleStyles.root, [BREAKPOINTS_RESPONSIVE.lgUp]: { display: 'none' } } }}
            >
              Content
            </Text>
          </Stack.Item>
          <ContentManagerButtons
            isMobile={context.isMobile}
            onAddBtnClick={() => initAddUpdateFolder()}
            onToggleDialog={onToggle}
          />
        </Stack>
        <Stack
          horizontal
          verticalAlign="center"
          styles={{ root: { marginTop: 23, [BREAKPOINTS_RESPONSIVE.lgUp]: { display: 'none' } } }}
        >
          <div ref={refBackBtn}>
            <Icon
              iconName="ChevronLeft"
              styles={{ root: { fontSize: 18, fontWeight: FontWeights.bold, marginRight: 16, cursor: 'pointer' } }}
              onClick={_handlerBackFolder}
            />
          </div>
          <ContextualMenu
            target={refBackBtn}
            hidden={!displayMobileRootFolder}
            onDismiss={() => setDisplayRootFolder(false)}
            styles={{ root: { minWidth: 'auto' } }}
            items={[
              { key: STRING.TEAM_FOLDERS, text: STRING.TEAM_FOLDERS, onClick: () => _switchRootFolder(true) },
              { key: STRING.MY_FOLDERS, text: STRING.MY_FOLDERS, onClick: () => _switchRootFolder(false) },
            ]}
          />
          <Stack.Item disableShrink>
            <Icon iconName="folder-open-svg" styles={{ root: { marginRight: 6, width: 24, fontSize: 24 } }} />
          </Stack.Item>
          <Text styles={folderNameStyles}>{selectedFolder.name}</Text>
        </Stack>
        {isEmptyContent && isDisplayNoContentPage ? (
          <EmptyContentPage onPrimaryBtnClick={() => onToggle(MODAL_NAME.UPLOAD_FILE)} />
        ) : (
          <ContentList
            isStickyHeader={false}
            maxHeight="auto"
            items={subfolders}
            onSelectFolder={onSelectFolder}
            detailListProps={{ onItemInvoked: (item) => onSelectFolder(item) }}
            onDropDocument={onDropDocument}
            onShareDocument={initShareDocument}
            onDeleteFolder={onDeleteFolder}
            onDeleteFile={onDeleteFile}
            onRenameFolder={initAddUpdateFolder}
          />
        )}
      </Stack.Item>
      <DocumentDragLayer />
    </>
  );
}
ContentDocumentView.propTypes = {
  myFolders: PropTypes.oneOfType([PropTypes.array]),
  teamFolders: PropTypes.oneOfType([PropTypes.array]),
  selectedFolder: PropTypes.oneOfType([PropTypes.object]),
  folderPath: PropTypes.oneOfType([PropTypes.array]),
  subfolders: PropTypes.oneOfType([PropTypes.array]),
  onToggle: PropTypes.func.isRequired,
  initAddUpdateFolder: PropTypes.func.isRequired,
  onSelectFolder: PropTypes.func.isRequired,
  onDropDocument: PropTypes.func.isRequired,
  initShareDocument: PropTypes.func.isRequired,
  isDisplayNoContentPage: PropTypes.bool,
  onDeleteFolder: PropTypes.func.isRequired,
  onDeleteFile: PropTypes.func.isRequired,
};
ContentDocumentView.defaultProps = {
  myFolders: undefined,
  teamFolders: undefined,
  selectedFolder: {},
  folderPath: [],
  subfolders: undefined,
  isDisplayNoContentPage: false,
};
