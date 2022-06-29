import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Icon, Stack } from '@fluentui/react';
import { CustomDetailsList } from 'features/shared/components';
import toLocalTime from 'features/shared/lib/utils';
import FileBiz from 'core/biz/FileBiz';
import { PAGE_PATHS } from 'core/constants/Const';

const renderName = (item) => (
  <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
    <Stack.Item disableShrink>
      <Icon iconName="pdf-svg" styles={{ root: { width: 24, height: 24 } }} />
    </Stack.Item>
    <Link to={`/${PAGE_PATHS.fileDetail}/${item.id}`} className="hover-underline">
      {item.displayName}
    </Link>
  </Stack>
);

const columnsSchema = [
  {
    key: 'displayName',
    name: 'File Name',
    fieldName: 'displayName',
    minWidth: 50,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    isPadded: true,
    onRender: renderName,
  },
  {
    key: 'recentVisits',
    name: 'Recent Visits',
    fieldName: 'recentVisits',
    minWidth: 100,
    maxWidth: 90,
    isRowHeader: true,
    isSortable: true,
    isCollapsible: true,
    data: 'number',
  },
  {
    key: 'size',
    name: 'Size',
    fieldName: 'size',
    minWidth: 80,
    maxWidth: 90,
    isRowHeader: true,
    isSortable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item) => FileBiz.formatSize(item.size),
  },
  {
    key: 'modifiedDate',
    name: 'Date',
    fieldName: 'modifiedDate',
    minWidth: 75,
    maxWidth: 85,
    isRowHeader: true,
    isSortable: true,
    data: 'string',
    isPadded: true,
    onRender: (item) => toLocalTime(item.modifiedDate || item.createdDate),
  },
];

class FileList extends Component {
  _onPreviewFile = (fileId) => {
    const { history } = this.props;
    history.push(`/${PAGE_PATHS.fileDetail}/${fileId}/preview`);
  };

  _getDataRoomContentMenuProps = (row) => {
    const { onDeleteDataRoomContent } = this.props;
    const result = {
      items: [
        {
          key: 'preview',
          text: 'Preview',
          onClick: () => this._onPreviewFile(row.id),
        },
        {
          key: 'delete',
          text: 'Delete',
          onClick: () => onDeleteDataRoomContent(row),
        },
      ],
    };

    return result;
  };

  render() {
    const { items, onSelectItems, onShareFile, isDataRoomContent } = this.props;
    return (
      <CustomDetailsList
        striped
        isShareable
        maxHeight="47vh"
        columns={columnsSchema}
        items={items}
        onShareItem={onShareFile}
        onSelectItems={onSelectItems}
        onGetMenuActions={isDataRoomContent ? this._getDataRoomContentMenuProps : null}
        {...this.props}
      />
    );
  }
}
FileList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  onSelectItems: PropTypes.func,
  onShareFile: PropTypes.func,
  onDeleteDataRoomContent: PropTypes.func,
  isDataRoomContent: PropTypes.bool,
};
FileList.defaultProps = {
  items: undefined,
  onSelectItems: undefined,
  onShareFile: undefined,
  isDataRoomContent: false,
  onDeleteDataRoomContent: undefined,
};
export default withRouter(FileList);
