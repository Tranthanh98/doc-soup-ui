import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { mergeStyles } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { CustomDetailsList } from 'features/shared/components';
import { PAGE_PATHS } from 'core/constants/Const';
import EmptyContent from './EmptyContent';
import ContentcolumnsSchema from './ContentcolumnsSchema';

const dragEnterClass = mergeStyles({
  '> span:first-child': {
    position: 'relative',
    borderBottom: '2px solid #f79f1a',
    marginBottom: 2,
    '::before, ::after': {
      content: '""',
      position: 'absolute',
      zIndex: 10,
      bottom: -4,
      width: 7,
      height: 7,
      backgroundColor: '#f79f1a',
      borderRadius: '50%',
    },
    '::before': { left: 0 },
    '::after': { right: 0 },
  },
});

class ContentList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._draggedItem = undefined;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.folders !== state.folders && props.files !== state.files) {
      const items = !props.folders && !props.files ? undefined : [...(props.folders || []), ...(props.files || [])];
      items?.sort((a, b) => a.orderNo - b.orderNo);
      return {
        folders: props.folders,
        files: props.files,
        items,
      };
    }
    return null;
  }

  componentWillUnmount() {
    const { files } = this.state;
    if (files && files.length) {
      const URL = window.URL || window.webkitURL;
      files.forEach((file) => URL.revokeObjectURL(file));
    }
  }

  _onPreviewFile = (fileId) => {
    const { history } = this.props;
    history.push(`/${PAGE_PATHS.fileDetail}/${fileId}/preview`);
  };

  _getDataRoomContentMenuProps = (row) => {
    const { onDeleteDataRoomContent } = this.props;
    const menu = { items: [] };
    if (row.extension) {
      menu.items.push({
        key: 'preview',
        text: 'Preview',
        onClick: () => this._onPreviewFile(row.id),
      });
    }
    menu.items.push({
      key: 'delete',
      text: 'Delete',
      onClick: () => onDeleteDataRoomContent(row),
    });

    return menu;
  };

  _updateDataRoomContentStatus = (item, checked) => {
    const { getToken } = this.context;
    const { dataRoom } = this.props;
    new RestService()
      .setPath(`/data-room/${dataRoom?.id}/content/${item?.contentId}/status`)
      .setToken(getToken())
      .put({ isActive: checked })
      .then()
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _changeOrderItem = (item, dropItem) => {
    if (!item || item?.id === dropItem?.id) {
      return;
    }

    const { items } = this.state;

    let beforeItem = null;
    let afterItem = null;

    // drag item from bottom to top
    if (item.orderNo > dropItem.orderNo) {
      afterItem = dropItem;
      beforeItem = items.find((i) => i.orderNo === (dropItem?.orderNo || null) - 1);
    }
    // drag item from top to bottom
    else {
      beforeItem = dropItem;
      afterItem = items.find((i) => i.orderNo === (beforeItem?.orderNo || null) + 1);
    }

    const { getToken } = this.context;
    const { dataRoom, getContentDataRoom } = this.props;
    new RestService()
      .setPath(`/data-room/${dataRoom?.id}/content/${item?.contentId}/order-no`)
      .setToken(getToken())
      .put({ before: beforeItem?.contentId, after: afterItem?.contentId })
      .then(() => {
        if (getContentDataRoom) {
          getContentDataRoom();
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _getKey = (item) => {
    return item && item.id + (item.extension || '');
  };

  _getDragDropEvents = () => {
    return {
      canDrop: () => true,
      canDrag: () => true,
      onDragEnter: () => dragEnterClass,
      onDragLeave: () => undefined,
      onDrop: (dropItem) => this._changeOrderItem(this._draggedItem, dropItem),
      onDragStart: (item, itemIndex) => {
        this._draggedItem = item;
        this._draggedItem.prevIndex = itemIndex;
      },
      onDragEnd: () => {
        this._draggedItem = undefined;
      },
    };
  };

  render() {
    const { items } = this.state;
    const { isMobile } = this.context;
    const { folders, files, thumbnailSrcs, onAddContent } = this.props;
    const isEmptyContent = folders && folders.length < 1 && files && files.length < 1;
    const isDataRoomContent = (folders && !!folders[0]?.contentId) || (files && !!files[0]?.contentId);
    const isShowContentMenu = isDataRoomContent && window.innerWidth >= 1024;

    if (isEmptyContent) {
      return (
        <EmptyContent
          title="This Data Room is empty"
          subTitle="Data Rooms allow you to share multiple documents with a single link.
            Data Rooms make great virtual deal rooms, customer onboarding portals,
            lightweight microsites, and more."
          imageProps={{
            src: '/img/no-content.svg',
            srcSet: undefined,
            alt: 'Empty data room content',
            width: 376,
            height: 280,
          }}
          primaryButtonProps={{ onClick: onAddContent }}
        />
      );
    }
    return (
      <CustomDetailsList
        isShareable={false}
        isStickyHeader={false}
        columns={ContentcolumnsSchema({
          imageSrcs: thumbnailSrcs,
          onChangeContentStatus: this._updateDataRoomContentStatus,
          isMobile,
          ...this.props,
        })}
        items={items}
        actionIconName="more-svg"
        onGetMenuActions={isShowContentMenu ? this._getDataRoomContentMenuProps : undefined}
        detailListProps={{
          getKey: this._getKey,
          isHeaderVisible: false,
          dragDropEvents: this._getDragDropEvents(),
        }}
        {...this.props}
      />
    );
  }
}
ContentList.propTypes = {
  folders: PropTypes.oneOfType([PropTypes.array]),
  files: PropTypes.oneOfType([PropTypes.array]),
  onSelectFolder: PropTypes.func.isRequired,
  onAddContent: PropTypes.func.isRequired,
  onDeleteDataRoomContent: PropTypes.func,
  dataRoom: PropTypes.oneOfType([PropTypes.object]),
  thumbnailSrcs: PropTypes.oneOfType([PropTypes.object]),
  getContentDataRoom: PropTypes.func.isRequired,
};
ContentList.defaultProps = {
  folders: undefined,
  files: undefined,
  onDeleteDataRoomContent: undefined,
  dataRoom: {},
  thumbnailSrcs: {},
};
ContentList.contextType = GlobalContext;
export default withRouter(ContentList);
