import { Link } from 'react-router-dom';
import { Image, ImageFit, mergeStyleSets, Stack, Text } from '@fluentui/react';
import { PAGE_PATHS } from 'core/constants/Const';
import React from 'react';
import { LIGHT_THEME } from 'core/constants/Theme';

const classNames = mergeStyleSets({
  cellName: {
    padding: '10px 0 !important',
    display: 'flex !important',
    alignItems: 'center',
    paddingLeft: 16,
  },
  linkItem: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    color: 'none',
    '&:hover': { color: 'none', textDecoration: 'none' },
  },
});

const detailTextContent = {
  root: {
    color: LIGHT_THEME.palette.neutralPrimary,
    paddingLeft: 6,
    fontWeight: 'normal',
    '&:hover': {
      color: LIGHT_THEME.palette.neutralPrimary,
      textDecoration: 'underline',
    },
  },
};

const renderFileName = (item, imgSrcs = []) => (
  <Stack grow horizontal verticalAlign="center" tokens={{ childrenGap: 10 }} styles={{ root: { width: '100%' } }}>
    <Stack.Item>
      <Image
        imageFit={ImageFit.contain}
        src={imgSrcs.find((i) => i.id === item.fileId)?.src || '/img/pdf.svg'}
        alt="Logo"
        width={36}
        height={36}
      />
    </Stack.Item>
    <Link to={`/${PAGE_PATHS.fileDetail}/${item.fileId}`}>
      <Text styles={detailTextContent}>{item.displayName}</Text>
    </Link>
  </Stack>
);

const columnsFileScheme = (imgSrcs) => [
  {
    key: 'fileName',
    name: 'Content',
    fieldName: 'fileName',
    ariaLabel: 'Content',
    minWidth: 100,
    isSortable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellName,
    onRender: (item) => renderFileName(item, imgSrcs),
  },
  {
    key: 'links',
    name: 'Links',
    fieldName: 'links',
    ariaLabel: 'Links',
    minWidth: 100,
    isSortable: true,
    data: 'number',
  },
  {
    key: 'dataRooms',
    name: 'Data Rooms',
    fieldName: 'dataRoomNumberOfFile',
    ariaLabel: 'Data Rooms',
    minWidth: 100,
    isSortable: true,
    data: 'number',
  },
];

export default columnsFileScheme;
