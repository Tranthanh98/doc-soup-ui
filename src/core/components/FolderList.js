import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stack, Icon, Text } from '@fluentui/react';
import { CustomDetailsList } from 'features/shared/components';
import toLocalTime from 'features/shared/lib/utils';

const folderNameStyle = {
  root: {
    color: 'inherit',
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
};

class FolderList extends Component {
  render() {
    const { items, onSelectItems, onShareFolder, onSelectFolder, isDataRoomContent, onDeleteDataRoomContent } =
      this.props;

    const renderName = (item) => (
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
        <Stack.Item disableShrink>
          <Icon iconName="folder-svg" styles={{ root: { width: 24, height: 24 } }} />
        </Stack.Item>
        <Text styles={folderNameStyle} onClick={() => onSelectFolder && onSelectFolder(item)}>
          {item.name}
        </Text>
      </Stack>
    );

    const columnsSchema = [
      {
        key: 'name',
        name: 'Folder Name',
        fieldName: 'name',
        ariaLabel: 'Folder Name',
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
        key: 'modifiedDate',
        name: 'Date',
        fieldName: 'modifiedDate',
        ariaLabel: 'Date',
        minWidth: 80,
        isRowHeader: true,
        isSortable: true,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'string',
        onRender: (item) => toLocalTime(item.modifiedDate || item.createdDate),
      },
    ];

    const _getDataRoomContentMenuProps = (row) => ({
      items: [
        {
          key: 'delete',
          text: 'Delete',
          onClick: () => onDeleteDataRoomContent(row),
        },
      ],
    });

    return (
      <CustomDetailsList
        striped
        isShareable
        maxHeight="21vh"
        columns={columnsSchema}
        items={items}
        onShareItem={onShareFolder}
        onSelectItems={onSelectItems}
        onGetMenuActions={isDataRoomContent ? _getDataRoomContentMenuProps : null}
        {...this.props}
      />
    );
  }
}
FolderList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  onSelectItems: PropTypes.func,
  onShareFolder: PropTypes.func,
  onSelectFolder: PropTypes.func,
  onDeleteDataRoomContent: PropTypes.func,
  isDataRoomContent: PropTypes.bool,
};
FolderList.defaultProps = {
  items: undefined,
  onSelectItems: undefined,
  onShareFolder: undefined,
  onSelectFolder: undefined,
  isDataRoomContent: false,
  onDeleteDataRoomContent: undefined,
};
export default FolderList;
