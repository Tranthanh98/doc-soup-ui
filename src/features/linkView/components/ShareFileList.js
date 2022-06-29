import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Stack, Spinner, SpinnerSize } from '@fluentui/react';
import { CustomDetailsList } from 'features/shared/components';
import toLocalTime from 'features/shared/lib/utils';
import FileBiz from 'core/biz/FileBiz';

const folderNameStyle = {
  root: {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
};
export default function ShareFileList(props) {
  const { items, loadingFileId, onSelectItems } = props;

  const renderName = (item) => (
    <Stack
      horizontal
      verticalAlign="center"
      tokens={{ childrenGap: 10 }}
      styles={folderNameStyle}
      onClick={() => onSelectItems(item)}
    >
      <Stack.Item disableShrink>
        {loadingFileId === item.id ? (
          <Spinner size={SpinnerSize.medium} />
        ) : (
          <Icon iconName="pdf-svg" styles={{ root: { width: 24, height: 24 } }} />
        )}
      </Stack.Item>
      <Stack.Item>{item.displayName || item.name}</Stack.Item>
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

  return <CustomDetailsList striped isStickyHeader={false} columns={columnsSchema} items={items} {...props} />;
}
ShareFileList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  onSelectItems: PropTypes.func,
  loadingFileId: PropTypes.number,
};
ShareFileList.defaultProps = {
  items: undefined,
  onSelectItems: undefined,
  loadingFileId: undefined,
};
