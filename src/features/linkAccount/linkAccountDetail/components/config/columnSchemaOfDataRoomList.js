import React from 'react';
import dataRoomHelper from 'features/shared/lib/dataRoomHelper';

const notMobileColumnsSchema = (onShareItem) => {
  return [
    {
      key: 'sharedWithAccount',
      name: 'Shared With Account',
      fieldName: 'sharedWithAccount',
      ariaLabel: 'Shared With Account',
      minWidth: 240,
      isSortable: true,
      data: 'string',
      onRender: (item) => dataRoomHelper.renderSharedWithAccount(item, onShareItem),
    },
    {
      key: 'createdDate',
      name: 'Last Updated',
      fieldName: 'createdDate',
      ariaLabel: 'Last Updated',
      minWidth: 150,
      isSortable: true,
      data: 'string',
      styles: { cellTitle: { justifyContent: 'flex-end', paddingRight: 60 } },
      onRender: (item) => <div style={{ width: '100%', paddingRight: 52 }}>{dataRoomHelper.renderDate(item)}</div>,
    },
  ];
};

const defaultColumnsSchema = (personaMenuRef) => {
  return [
    {
      key: 'name',
      name: 'Room Name',
      fieldName: 'name',
      ariaLabel: 'Room Name',
      minWidth: 100,
      isRowHeader: true,
      isSortable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'string',
      isPadded: true,
      onRender: dataRoomHelper.renderRoomName,
    },
    {
      key: 'owner',
      name: 'Owner',
      fieldName: 'owner',
      ariaLabel: 'Owner',
      minWidth: 45,
      isRowHeader: true,
      isSortedDescending: false,
      data: 'string',
      onRender: (item) => dataRoomHelper.renderOwnerName(item, personaMenuRef),
    },
  ];
};

export { notMobileColumnsSchema, defaultColumnsSchema };
