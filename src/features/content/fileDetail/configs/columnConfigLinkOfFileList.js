import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const { mergeStyleSets } = require('@fluentui/merge-styles');

const classNames = mergeStyleSets({
  cellName: {
    padding: '0 !important',
    display: 'flex !important',
    alignItems: 'center',
    paddingLeft: 16,
  },
});

const columnsSchema = [
  {
    key: 'linkName',
    name: 'Account',
    fieldName: 'linkName',
    ariaLabel: 'Account',
    minWidth: 175,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellName,
    styles: {
      root: {
        overflow: 'hidden',
        [BREAKPOINTS_RESPONSIVE.lg]: {
          width: '32% !important',
        },
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          flexGrow: 1,
          width: '70% !important',
        },
      },
    },
  },
  {
    key: 'originalLink',
    name: 'Original Link',
    fieldName: 'originalLink',
    ariaLabel: 'Original Link',
    minWidth: 256,
    data: 'string',
    className: classNames.cellName,
    styles: {
      root: {},
    },
  },
  {
    key: 'active',
    name: 'Active',
    fieldName: 'active',
    ariaLabel: 'Active',
    minWidth: 40,
    isSortable: false,
    className: classNames.cellName,
    styles: {
      root: {
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          minWidth: 50,
          width: '8% !important',
        },
        [BREAKPOINTS_RESPONSIVE.lg]: {
          width: '12% !important',
        },
      },
    },
  },
  {
    key: 'date',
    name: 'Date',
    fieldName: 'date',
    ariaLabel: 'Date',
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    minWidth: 120,
    data: 'string',
    className: classNames.cellName,
    styles: {
      root: {
        overflow: 'hidden',
        textAlign: 'right',
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          display: 'none',
        },
        [BREAKPOINTS_RESPONSIVE.lg]: {
          minWidth: 65,
          paddingRight: 15,
          width: '12% !important',
        },
        paddingRight: 10,
      },
      cellTitle: { display: 'flex', justifyContent: 'flex-end' },
    },
  },
  {
    key: 'activity',
    name: 'Visits',
    fieldName: 'activity',
    ariaLabel: 'Visits',
    minWidth: 70,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellName,
    styles: {
      root: {
        [BREAKPOINTS_RESPONSIVE.lgDown]: {
          display: 'none',
        },
        textAlign: 'right',
        paddingRight: 5,
      },
      cellTitle: { display: 'flex', justifyContent: 'flex-end' },
    },
  },
  {
    key: 'more',
    fieldName: 'more',
    minWidth: 30,
    styles: {
      root: {
        [BREAKPOINTS_RESPONSIVE.lgDown]: {
          display: 'none',
        },
        display: 'flex',
        justifyContent: 'flex-end',
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

export default columnsSchema;
