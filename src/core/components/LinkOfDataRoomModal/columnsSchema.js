import { Stack, Toggle } from '@fluentui/react';
import { PersonaLinkTag } from 'core/components';
import { CustomIconButton } from 'features/shared/components';
import { millisecondsToStr } from 'features/shared/lib/utils';
import React from 'react';

const { mergeStyleSets } = require('@fluentui/merge-styles');

const classNames = mergeStyleSets({
  cellName: {
    padding: '0 !important',
    display: 'flex !important',
    alignItems: 'center',
    paddingLeft: 16,
  },
});

const columnsSchema = (onChangeStatusOfLink) => [
  {
    key: 'name',
    name: 'Name',
    fieldName: 'name',
    ariaLabel: 'Name',
    minWidth: 280,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellName,
  },
  {
    key: 'createdDate',
    name: 'Date',
    fieldName: 'createdDate',
    ariaLabel: 'Date',
    isRowHeader: true,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellName,
    onRender: (item) => {
      return millisecondsToStr(new Date() - new Date(item.createdDate));
    },
  },
  {
    key: 'originalLink',
    name: 'Original Link',
    fieldName: 'originalLink',
    ariaLabel: 'Original Link',
    minWidth: 284,
    isRowHeader: true,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellName,
    onRender: ({ id, createdByName }) => {
      return <PersonaLinkTag width={300} linkId={id} isCopyToClipboard createdBy={createdByName} />;
    },
  },
  {
    key: 'linkSetup',
    name: 'Link Setup',
    fieldName: 'linkSetup',
    ariaLabel: 'Link Setup',
    isRowHeader: true,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellName,
    onRender: ({ id, disabled }) => {
      const href = `${window.location.origin}/view/${id}`;
      return (
        <Stack horizontal verticalAlign="center">
          <Stack.Item styles={{ root: { marginRight: 12 } }}>
            <Toggle
              styles={{ root: { marginBottom: 0 } }}
              checked={!disabled}
              onChange={(_, value) => onChangeStatusOfLink(id, value)}
            />
          </Stack.Item>
          <Stack.Item>
            <CustomIconButton
              iconProps={{ iconName: 'eye-open-svg' }}
              title="Watch"
              ariaLabel="Watch"
              target="_blank"
              href={href}
            />
          </Stack.Item>
        </Stack>
      );
    },
  },
];

export default columnsSchema;
