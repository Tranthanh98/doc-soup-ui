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

const columnConfig = [
  {
    key: 'name',
    name: 'Name / Email',
    fieldName: 'name',
    ariaLabel: 'Name / Email',
    minWidth: 450,
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
        overflow: 'hidden',
        [BREAKPOINTS_RESPONSIVE.lg]: {
          width: '70% !important',
        },
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          width: '90% !important',
        },
      },
    },
  },

  {
    key: 'device',
    name: 'Device & Location',
    fieldName: 'device',
    ariaLabel: 'Device & Location',
    minWidth: 180,
    isSortable: true,
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
    key: 'date',
    name: 'Date',
    fieldName: 'date',
    ariaLabel: 'Date',
    minWidth: 100,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    styles: {
      root: {
        textAlign: 'right',
        overflow: 'hidden',
        [BREAKPOINTS_RESPONSIVE.lg]: {
          width: '20% !important',
          minWidth: 100,
        },
      },
      cellTitle: { display: 'flex', justifyContent: 'flex-end' },
    },
  },
  {
    key: 'duration',
    name: 'Duration',
    fieldName: 'duration',
    ariaLabel: 'Duration',
    minWidth: 100,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    styles: {
      cellTitle: { display: 'flex', justifyContent: 'flex-end' },
      root: {
        [BREAKPOINTS_RESPONSIVE.xlUp]: {
          display: 'inline-block',
          justifyContent: 'flex-end',
        },
      },
      rootGroup: {
        display: 'none',
        [BREAKPOINTS_RESPONSIVE.xlUp]: {
          display: 'flex',
          justifyContent: 'flex-end',
        },
      },
    },
  },
  {
    key: 'viewedRate',
    name: 'Viewed',
    fieldName: 'viewedRate',
    ariaLabel: 'Viewed',
    minWidth: 120,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    onRender: (item) => {
      return `${item.lastPage}/${item.totalPages} page`;
    },
    styles: {
      cellTitle: { paddingLeft: 50 },
      root: {
        paddingLeft: 50,
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
