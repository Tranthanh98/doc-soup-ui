/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Nav, FontSizes, Stack, Shimmer, ShimmerElementType } from '@fluentui/react';
import FolderBiz from 'core/biz/FolderBiz';
import { CustomText, DragConsumer, DropConsumer } from 'features/shared/components';
import { DRAG_DROP_TYPE } from 'core/constants/Const';
import FolderItem from './FolderItem';

const navStyles = (props) => {
  const { isSelected, isExpanded, theme, leftPadding, isHighlightBackgroundSelection } = props;
  let selectedStyles = { color: 'inherit' };
  if (isSelected) {
    selectedStyles = isHighlightBackgroundSelection
      ? { backgroundColor: theme.palette.themePrimary, color: theme.palette.white }
      : { color: theme.palette.orangeLight };
  }
  return {
    root: {
      height: '100%',
      overflow: 'hidden',
    },
    compositeLink: {
      ...(isHighlightBackgroundSelection && selectedStyles),
      selectors: {
        '.folder-name': {
          fontWeight: 'inherit',
          color: 'inherit',
        },
        '.more-btn': {
          display: 'none',
          color: theme.palette.orangeLight,
          fontSize: FontSizes.size16,
        },
        '&:hover': {
          '.folder-item': {
            position: 'relative',
            color: isSelected ? theme.palette.orangeLight : theme.palette.black,
          },
          color: 'inherit',
          '.more-btn': {
            position: 'absolute',
            right: 0,
            display: 'block',
          },
          '.more-btn i': {
            fill: isSelected ? theme.palette.orangeLight : theme.palette.black,
          },
        },
      },
    },
    link: {
      paddingRight: 0,
      paddingLeft: 0,
      color: 'inherit',
      backgroundColor: 'transparent !important',
      overflow: 'initial',
      height: 42,
      lineHeight: 'auto',
      ...selectedStyles,
      selectors: {
        '::after': { border: 0 },
        '.folder-item': {
          paddingLeft: leftPadding,
        },
      },
    },
    chevronButton: {
      background: 'transparent',
      color: 'inherit',
      height: 42,
      selectors: {
        '::after': { border: 0 },
      },
    },
    chevronIcon: {
      transform: isExpanded ? 'rotate(0)' : 'rotate(-90deg)',
    },
    groupContent: {
      marginBottom: theme.spacing.l1,
    },
  };
};
function getShimmerElements() {
  return [
    { type: ShimmerElementType.circle, height: 24 },
    { type: ShimmerElementType.gap, width: 8 },
    { type: ShimmerElementType.line, height: 8 },
  ];
}

class FolderTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedFolder: {},
      folders: undefined,
      navLinkGroups: [
        {
          name: 'My folder',
          links: [],
        },
      ],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.folders && props.folders !== state.folders && props.selectedFolder?.key !== undefined) {
      const newExpandedState = { ...state.expandedFolder };
      props.folders.forEach((folder) => {
        if (folder.isExpanded || folder.id === props.selectedFolder.key) {
          newExpandedState[folder.id] = true;
        }
      });
      return {
        folders: props.folders,
        expandedFolder: { ...newExpandedState },
        navLinkGroups: [
          {
            id: 0,
            key: 0,
            isTeam: props.isTeam,
            name: props?.customProps?.rootName || 'My folder',
            links: FolderBiz.convertFoldersToTreeData(props.folders, newExpandedState),
          },
        ],
      };
    }
    return null;
  }

  _selectFolder = (item) => {
    const { onSelectFolder } = this.props;
    onSelectFolder(item);
  };

  _setExpandedFolder = (_event, item) => {
    this.setState((state) => {
      const newExpandedState = state.expandedFolder;
      if (item.isExpanded) {
        newExpandedState[item.id] = true;
      } else {
        delete newExpandedState[item.id];
      }
      return {
        expandedFolder: newExpandedState,
      };
    });
  };

  _renderGroupHeader = (group) => {
    const { allowSelectRootFolder, dropable, onDrop, customProps, selectedFolder, onAddUpdateFolder } = this.props;
    const { folders } = this.state;
    const rootItem = { ...group, links: undefined };
    const iconName = customProps.rootIcon;
    const isSelected = selectedFolder.key === rootItem.key && selectedFolder.isTeam === rootItem.isTeam;
    let itemComponent = (
      <FolderItem
        {...this.props}
        isSelected={isSelected}
        item={group}
        iconName={iconName}
        manageMenu={[
          {
            key: 'addFolder',
            text: 'Add folder',
            onClick: () => onAddUpdateFolder(group),
          },
        ]}
        onSelectItem={allowSelectRootFolder ? this._selectFolder : undefined}
      />
    );
    if (dropable) {
      itemComponent = (
        <DropConsumer
          item={rootItem}
          dropable={dropable}
          cloneChildren
          accept={[DRAG_DROP_TYPE.FOLDER]}
          onDrop={onDrop}
          canDrop={(srcItem) => FolderBiz.allowMoveDocument(srcItem, rootItem, folders)}
        >
          {itemComponent}
        </DropConsumer>
      );
    }
    return itemComponent;
  };

  _renderFolderItem = (item) => {
    const { dragable, dropable, dragType, dropAccept, customProps, onDrop, onAddUpdateFolder, onDeleteFolder } =
      this.props;
    const { folders } = this.state;
    const iconName = item.isExpanded ? customProps.expandedIcon : customProps.collapsedIcon;
    let itemComponent = (
      <FolderItem
        {...this.props}
        item={item}
        iconName={iconName}
        manageMenu={[
          {
            key: 'addFolder',
            text: 'Add folder',
            onClick: () => onAddUpdateFolder(item),
          },
          {
            key: 'rename',
            text: 'Rename',
            onClick: () => onAddUpdateFolder({ ...item, oldName: item.name }),
          },
          {
            key: 'delete',
            text: (
              <CustomText variant="smallPlus" color="textDanger">
                Delete
              </CustomText>
            ),
            onClick: () => onDeleteFolder(item),
          },
        ]}
        onSelectItem={this._selectFolder}
      />
    );
    if (dropable) {
      itemComponent = (
        <DropConsumer
          item={item}
          dropable={dropable}
          cloneChildren
          accept={dropAccept}
          onDrop={onDrop}
          canDrop={(srcItem) => FolderBiz.allowMoveDocument(srcItem, item, folders)}
        >
          {itemComponent}
        </DropConsumer>
      );
    }
    if (dragable) {
      itemComponent = (
        <DragConsumer item={item} dragable={dragable} type={dragType}>
          {itemComponent}
        </DragConsumer>
      );
    }
    return <div style={{ width: '100%' }}>{itemComponent}</div>;
  };

  render() {
    const { navLinkGroups } = this.state;
    const { folders, selectedFolder, isHighlightBackgroundSelection } = this.props;
    if (!folders) {
      return (
        <Stack tokens={{ childrenGap: 16 }}>
          <Shimmer shimmerElements={getShimmerElements()} />
          <Shimmer shimmerElements={getShimmerElements()} />
          <Shimmer shimmerElements={getShimmerElements()} />
          <Shimmer shimmerElements={getShimmerElements()} />
          <Shimmer shimmerElements={getShimmerElements()} />
          <br />
        </Stack>
      );
    }
    return (
      <Nav
        selectedKey={selectedFolder.key}
        groups={navLinkGroups}
        onRenderGroupHeader={this._renderGroupHeader}
        onRenderLink={this._renderFolderItem}
        onLinkExpandClick={this._setExpandedFolder}
        styles={(props) => navStyles({ ...props, isHighlightBackgroundSelection })}
      />
    );
  }
}
FolderTree.propTypes = {
  folders: PropTypes.oneOfType([PropTypes.array]),
  selectedFolder: PropTypes.oneOfType([PropTypes.object]),
  customProps: PropTypes.oneOfType([PropTypes.object]),
  showManageMenu: PropTypes.bool,
  onSelectFolder: PropTypes.func,
  onDrop: PropTypes.func,
  dragable: PropTypes.bool,
  dropable: PropTypes.bool,
  dragType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  dropAccept: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  allowSelectRootFolder: PropTypes.bool,
  onAddUpdateFolder: PropTypes.func,
  isTeam: PropTypes.bool,
  isHighlightBackgroundSelection: PropTypes.bool,
  onDeleteFolder: PropTypes.func,
};
FolderTree.defaultProps = {
  folders: undefined,
  selectedFolder: {},
  customProps: {
    rootName: 'My folders',
    rootIcon: 'folder-svg',
    expandedIcon: 'folder-open-svg',
    collapsedIcon: 'folder-svg',
  },
  showManageMenu: false,
  onSelectFolder: () => {},
  onDrop: () => {},
  onAddUpdateFolder: () => {},
  dragable: false,
  dropable: false,
  dragType: '',
  dropAccept: '',
  allowSelectRootFolder: false,
  isTeam: undefined,
  isHighlightBackgroundSelection: false,
  onDeleteFolder: () => {},
};

export default FolderTree;
