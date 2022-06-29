import { mergeStyleSets, Stack, Text, Persona, PersonaSize } from '@fluentui/react';
import React from 'react';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const classNames = mergeStyleSets({
  cellName: {
    padding: '0 !important',
    display: 'flex !important',
    alignItems: 'center',
    paddingLeft: 16,
  },
});

const renderName = (item) => (
  <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
    <Persona size={PersonaSize.size32} initialsColor={20} hidePersonaDetails />
    <Text>{item.email}</Text>
  </Stack>
);
const renderDeviceAndLocation = (item) => {
  return item.locationName ? `${item.locationName.trim().replace(/^,/, '')} - ${item.device}` : `${item.device}`;
};

const columnConfig = [
  {
    key: 'name',
    name: 'Name / Email',
    fieldName: 'name',
    ariaLabel: 'Name / Email',
    minWidth: 260,
    width: '100%',
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellName,
    onRender: renderName,
    styles: {
      root: {
        [BREAKPOINTS_RESPONSIVE.lgDown]: {
          width: '75% !important',
        },
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          width: '90% !important',
        },
      },
    },
  },
  {
    key: 'date',
    name: 'Date',
    fieldName: 'date',
    ariaLabel: 'Date',
    minWidth: 150,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    styles: {
      root: {
        textAlign: 'right',
        padding: '0px 8px 0px 12px',
        paddingRight: 32,
        [BREAKPOINTS_RESPONSIVE.lgDown]: {
          paddingRight: 20,
        },
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          display: 'none',
        },
      },
      cellTitle: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: 32,
        [BREAKPOINTS_RESPONSIVE.lgDown]: {
          paddingRight: 85,
        },
      },
    },
  },
  {
    key: 'device',
    name: 'Device & Location',
    fieldName: 'device',
    ariaLabel: 'Device & Location',
    minWidth: 210,
    data: 'string',
    onRender: renderDeviceAndLocation,
    styles: {
      root: {
        display: 'none',
        [BREAKPOINTS_RESPONSIVE.xxl]: {
          display: 'inline-block',
        },
      },
    },
  },
  {
    key: 'sender',
    name: 'Account',
    fieldName: 'sender',
    ariaLabel: 'Account',
    minWidth: 176,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',

    data: 'string',
    styles: {
      root: {
        display: 'none',
        [BREAKPOINTS_RESPONSIVE.xlUp]: {
          display: 'inline-block',
        },
      },
    },
  },
  {
    key: 'duration',
    name: 'Duration',
    fieldName: 'duration',
    ariaLabel: 'Duration',
    minWidth: 90,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',

    data: 'string',
    styles: {
      cellTitle: { justifyContent: 'flex-end' },
      root: {
        display: 'none',
        [BREAKPOINTS_RESPONSIVE.xlUp]: {
          display: 'inline-block',
        },
      },
      rootGroup: {
        display: 'none',
        [BREAKPOINTS_RESPONSIVE.xlUp]: {
          display: 'flex',
        },
      },
    },
  },
  {
    key: 'viewedRate',
    name: 'viewedRate',
    fieldName: 'viewedRate',
    ariaLabel: 'Viewed',
    minWidth: 100,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    onRender: (item) => {
      return `${item.lastPage}/${item.totalPages} page`;
    },
    styles: {
      cellTitle: { paddingLeft: 40 },
      root: {
        padding: '0px 8px 0px 12px',
        paddingLeft: 40,
        display: 'none',
        [BREAKPOINTS_RESPONSIVE.xlUp]: {
          display: 'inline-block',
        },
      },
    },
  },
  {
    key: 'action',
    fieldName: 'action',
    width: 10,
    minWidth: 10,
  },
];

export default columnConfig;
