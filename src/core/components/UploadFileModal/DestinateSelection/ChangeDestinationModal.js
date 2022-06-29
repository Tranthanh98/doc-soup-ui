import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CustomModal, CustomBreadcrumb } from 'features/shared/components';
import {
  mergeStyleSets,
  Separator,
  ScrollablePane,
  ScrollbarVisibility,
  Sticky,
  StickyPositionType,
  ResponsiveMode,
} from '@fluentui/react';
import FolderBiz from 'core/biz/FolderBiz';
import { FolderTree } from 'features/content/components';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const classNames = mergeStyleSets({
  wrapper: {
    height: '64vh',
    position: 'relative',
    minWidth: 492,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      minWidth: 'auto',
    },
  },
});

export default function ChangeDestinationModal(props) {
  const {
    teamFolders,
    myFolders,
    folderPath: folderPathProps,
    selectedFolder: selectedFolderProps,
    isOpen,
    disabledMyFolderTooltip,
    onDismiss,
    onChangeDestination,
  } = props;
  const [selectedFolder, setSelectedFolder] = useState();
  const [folderPath, setFolderPath] = useState([]);

  useEffect(() => {
    setSelectedFolder(selectedFolderProps);
    setFolderPath(folderPathProps);
  }, [selectedFolderProps, folderPathProps]);

  const _confirmChangeDes = () => {
    onChangeDestination(selectedFolder, folderPath);
  };

  const _selectFolder = (folder) => {
    if (!folder || folder.id === selectedFolder.id) {
      return;
    }
    setSelectedFolder({ ...folder, key: folder.id });
  };

  useEffect(() => {
    if (selectedFolder) {
      const listContainSelectedFolder = selectedFolder.isTeam ? teamFolders : myFolders;
      setFolderPath(FolderBiz.getFolderPath(selectedFolder, listContainSelectedFolder, _selectFolder));
    }
  }, [selectedFolder]);

  return (
    <CustomModal
      title="Change Destination"
      isOpen={isOpen}
      onDismiss={onDismiss}
      primaryButtonProps={{
        text: 'OK',
        onClick: _confirmChangeDes,
      }}
    >
      <div className={classNames.wrapper}>
        <ScrollablePane
          scrollContainerFocus
          scrollbarVisibility={ScrollbarVisibility.auto}
          scrollContainerAriaLabel="Sticky destination"
        >
          <Sticky stickyPosition={StickyPositionType.Header}>
            <CustomBreadcrumb
              items={folderPath}
              ariaLabel="breadcrumb folder path"
              responsiveMode={ResponsiveMode.unknown}
            />
            <Separator horizontal />
          </Sticky>
          <FolderTree
            isTeam
            isHighlightBackgroundSelection
            folders={teamFolders}
            customProps={{
              rootName: 'Team folders',
              rootIcon: 'team-folder-svg',
              collapsedIcon: 'folder-svg',
              expandedIcon: 'folder-open-svg',
            }}
            selectedFolder={selectedFolder}
            onSelectFolder={_selectFolder}
          />
          <FolderTree
            isHighlightBackgroundSelection
            disabled={!!disabledMyFolderTooltip}
            disabledTooltip={disabledMyFolderTooltip}
            folders={myFolders}
            selectedFolder={selectedFolder}
            onSelectFolder={_selectFolder}
          />
        </ScrollablePane>
      </div>
    </CustomModal>
  );
}
ChangeDestinationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onChangeDestination: PropTypes.func.isRequired,
  selectedFolder: PropTypes.oneOfType([PropTypes.object]),
  folderPath: PropTypes.oneOfType([PropTypes.array]),
  teamFolders: PropTypes.oneOfType([PropTypes.array]),
  myFolders: PropTypes.oneOfType([PropTypes.array]),
  disabledMyFolderTooltip: PropTypes.string,
};
ChangeDestinationModal.defaultProps = {
  selectedFolder: {},
  folderPath: [],
  teamFolders: [],
  myFolders: [],
  disabledMyFolderTooltip: undefined,
};
