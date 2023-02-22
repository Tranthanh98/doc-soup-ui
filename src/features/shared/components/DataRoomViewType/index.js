import { List, mergeStyleSets } from '@fluentui/react';
import { FILE_TYPE, VIEW_TYPE } from 'core/constants/Const';
import React from 'react';
import PropTypes from 'prop-types';
import CellOfGridView from './CellOfGridView';
import CellOfListView from './CellOfListView';

const classNames = mergeStyleSets({
  listGridWrapper: {
    overflow: 'hidden',
    fontSize: 0,
    position: 'relative',
  },
});

class DataRoomViewType extends React.Component {
  _onRenderCell = (item, index) => {
    const { viewType, loadingFileId, onClickItem, linkId, viewerId } = this.props;

    if (viewType === VIEW_TYPE.GRID) {
      return (
        <CellOfGridView
          item={item}
          loadingFileId={loadingFileId}
          icon={item.type === FILE_TYPE.FOLDER ? 'folder-svg' : 'pdf-svg'}
          index={index}
          onClick={() => onClickItem(item)}
          linkId={linkId}
          viewerId={viewerId}
        />
      );
    }
    return (
      <CellOfListView
        item={item}
        loadingFileId={loadingFileId}
        icon={item.type === FILE_TYPE.FOLDER ? 'folder-svg' : 'pdf-svg'}
        index={index}
        onClick={() => onClickItem(item)}
      />
    );
  };

  render() {
    const { items, viewType } = this.props;
    return (
      <List
        className={viewType === VIEW_TYPE.GRID ? classNames.listGridWrapper : undefined}
        items={items}
        onRenderCell={this._onRenderCell}
      />
    );
  }
}

DataRoomViewType.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]).isRequired,
  viewType: PropTypes.number.isRequired,
  loadingFileId: PropTypes.number,
  onClickItem: PropTypes.func.isRequired,
  linkId: PropTypes.string.isRequired,
  viewerId: PropTypes.number.isRequired,
};

DataRoomViewType.defaultProps = {
  loadingFileId: undefined,
};

export default DataRoomViewType;
