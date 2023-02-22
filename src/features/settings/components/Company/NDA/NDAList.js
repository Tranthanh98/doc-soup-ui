import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Icon, ContextualMenuItemType, mergeStyleSets } from '@fluentui/react';
import { CustomDetailsList, CustomIconButton, CustomText } from 'features/shared/components';

const iconStyles = {
  root: {
    width: 30,
    height: 23,
    marginRight: 8,
  },
};
const classNames = mergeStyleSets({
  cellAction: {
    padding: '0 !important',
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const renderName = (item) => (
  <Stack horizontal verticalAlign="center">
    <Stack.Item disableShrink>
      <Icon iconName="photo-svg" styles={iconStyles} />
    </Stack.Item>
    {item.displayName}
  </Stack>
);

export default function NDAList(props) {
  const { items, onReplaceItem, onRenameItem, onDeleteItem, onPreviewItem } = props;
  const renderViewBtn = (item) => (
    <CustomIconButton iconProps={{ iconName: 'eye-open-svg' }} title="Watch" onClick={() => onPreviewItem(item)} />
  );
  const _columnsSchema = [
    {
      key: 'displayName',
      name: 'Name',
      fieldName: 'displayName',
      ariaLabel: 'NDA Name',
      minWidth: 100,
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
      key: 'view',
      name: '',
      ariaLabel: 'view',
      minWidth: 40,
      className: classNames.cellAction,
      onRender: renderViewBtn,
    },
  ];

  const _getMenuProps = (row) => {
    const result = {
      items: [
        {
          key: 'update',
          text: 'Replace with new upload',
          onClick: () => onReplaceItem(row),
        },
        {
          key: 'rename',
          text: 'Rename NDA',
          onClick: () => onRenameItem(row),
        },
        { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
        {
          key: 'remove',
          text: (
            <CustomText variant="smallPlus" color="textDanger">
              Remove NDA
            </CustomText>
          ),
          onClick: () => onDeleteItem(row),
        },
      ],
    };

    return result;
  };
  return (
    <CustomDetailsList
      striped
      // eslint-disable-next-line no-nested-ternary
      maxHeight={`${items ? (items.length >= 5 ? '360' : (items.length + 1) * 60) : 0}px`}
      columns={_columnsSchema}
      items={items}
      actionIconName="more-svg"
      onGetMenuActions={_getMenuProps}
      detailListProps={{ isHeaderVisible: true }}
    />
  );
}
NDAList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  onReplaceItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onRenameItem: PropTypes.func.isRequired,
  onPreviewItem: PropTypes.func.isRequired,
};
NDAList.defaultProps = {
  items: undefined,
};
