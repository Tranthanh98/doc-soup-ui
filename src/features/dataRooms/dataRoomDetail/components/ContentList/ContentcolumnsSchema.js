import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Stack, Image, ImageFit, Toggle } from '@fluentui/react';
import toLocalTime from 'features/shared/lib/utils';
import FileBiz from 'core/biz/FileBiz';
import { PAGE_PATHS } from 'core/constants/Const';

const folderNameStyle = {
  root: {
    overflow: 'hidden',
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
};

export default function ContentcolumnsSchema(props) {
  const { imageSrcs, onSelectFolder, onChangeContentStatus, isMobile } = props;

  const renderFolderName = (item) => {
    return (
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }} styles={{ root: { width: '100%' } }}>
        <Stack.Item disableShrink style={{ cursor: 'pointer' }} onClick={() => onSelectFolder && onSelectFolder(item)}>
          <Icon iconName="folder-svg" styles={{ root: { width: 24, height: 24 } }} />
        </Stack.Item>
        <Stack.Item grow styles={folderNameStyle} onClick={() => onSelectFolder && onSelectFolder(item)}>
          {item.name}
        </Stack.Item>
      </Stack>
    );
  };

  const renderFileName = (item) => {
    const imageSrc = imageSrcs && imageSrcs[item.id];
    return (
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }} styles={{ root: { width: '100%' } }}>
        <Stack.Item disableShrink style={{ cursor: 'pointer' }}>
          <Link to={`/${PAGE_PATHS.fileDetail}/${item.id}`} className="hover-underline">
            <Image
              src={imageSrc || '/img/default-pdf-thumbnail.png'}
              srcSet={imageSrc || '/img/default-pdf-thumbnail-2x.png 2x, /img/default-pdf-thumbnail-3x.png 3x'}
              imageFit={ImageFit.centerContain}
              width={36}
              height={36}
            />
          </Link>
        </Stack.Item>
        <Stack.Item styles={{ root: { overflow: 'hidden' } }}>
          <Link to={`/${PAGE_PATHS.fileDetail}/${item.id}`} className="hover-underline">
            {item.displayName}
          </Link>
        </Stack.Item>
      </Stack>
    );
  };

  const renderToggleStatus = (item) => {
    if (item?.contentId) {
      return (
        <Toggle
          onText="ON"
          offText="OFF"
          defaultChecked={!!item?.isActive}
          styles={{ root: { marginBottom: 0 } }}
          onChange={(event, checked) => onChangeContentStatus(item, checked)}
        />
      );
    }
    return undefined;
  };

  return [
    {
      key: 'displayName',
      name: 'Content Name',
      fieldName: 'displayName',
      minWidth: 110,
      isRowHeader: true,
      isSortable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'string',
      onRender: (item) => (item.extension ? renderFileName(item) : renderFolderName(item)),
    },
    {
      key: 'size',
      name: '',
      fieldName: 'size',
      minWidth: 60,
      maxWidth: 90,
      isRowHeader: true,
      isSortable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item) => item.size && FileBiz.formatSize(item.size),
    },
    {
      key: 'modifiedDate',
      name: 'Date',
      fieldName: 'modifiedDate',
      minWidth: 70,
      maxWidth: 150,
      isRowHeader: true,
      isSortable: true,
      data: 'string',
      isPadded: !isMobile,
      onRender: (item) => toLocalTime(item.modifiedDate || item.createdDate),
    },
    {
      key: 'status',
      name: '',
      fieldName: 'status',
      minWidth: 41,
      maxWidth: 50,
      isPadded: !isMobile,
      onRender: renderToggleStatus,
    },
  ];
}
