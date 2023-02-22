/* eslint-disable max-lines */
import React from 'react';
import { Persona, PersonaSize, Stack, Image, ImageFit, Icon } from '@fluentui/react';
import { Link } from 'react-router-dom';
import { millisecondsToStr } from 'features/shared/lib/utils';
import { CustomText } from 'features/shared/components';
import { PersonaLinkTag } from 'core/components';
import { PAGE_PATHS } from 'core/constants/Const';

const { mergeStyleSets } = require('@fluentui/merge-styles');

const renderContentName = (item, isMobile, imgSrc = []) => {
  const fileThumb = imgSrc.find((i) => i.id === item.id && item.isFile);
  const dateFormat = millisecondsToStr(new Date() - new Date(item.updateDate));

  return (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
      {!isMobile && (
        <Stack.Item disableShrink>
          {item.isFile ? (
            <Image
              src={fileThumb?.src ?? '/img/pdf.svg'}
              height={40}
              width={40}
              imageFit={ImageFit.contain}
              alt="page"
            />
          ) : (
            <Icon iconName="folder-svg" styles={{ root: { width: 24, height: 24 } }} />
          )}
        </Stack.Item>
      )}
      <Stack styles={{ root: { paddingLeft: 6 } }}>
        <CustomText>{item.displayName}</CustomText>
        {isMobile && <CustomText variant="small" color="textSecondary">{`Updated ${dateFormat}`}</CustomText>}
      </Stack>
    </Stack>
  );
};

const renderName = (isMobile, name, dateTitle, date, isLink = false) => {
  const dateFormat = millisecondsToStr(new Date() - new Date(date));
  return (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
      {!isMobile && (
        <Stack.Item disableShrink>
          {!isLink ? (
            <Image
              imageFit={ImageFit.contain}
              src="/img/default-pdf-thumbnail.png"
              srcSet="/img/default-pdf-thumbnail-2x.png, /img/default-pdf-thumbnail-3x.png"
              alt="Logo"
              width={36}
              height={36}
            />
          ) : (
            <Icon iconName="hyperlink-svg" styles={{ root: { width: 24, height: 24 } }} />
          )}
        </Stack.Item>
      )}
      <Stack styles={{ root: { paddingLeft: 6 } }}>
        <CustomText>{name}</CustomText>
        {isMobile && <CustomText variant="small" color="textSecondary">{`${dateTitle} ${dateFormat}`}</CustomText>}
      </Stack>
    </Stack>
  );
};

const accountClassNames = mergeStyleSets({
  cellName: {
    padding: '22px auto',
    fontSize: 14,
  },
  linkItem: {
    '&:hover': { color: 'pink' },
  },
});

const textClassNames = mergeStyleSets({
  cellName: {
    fontSize: 14,
  },
});

export const contentColumnSchema = (context, imgSrc = []) => [
  {
    key: 'displayName',
    name: 'Name',
    fieldName: 'displayName',
    ariaLabel: 'Name',
    minWidth: 150,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    onRender: (item) => {
      const path = item.isFile ? `/${PAGE_PATHS.content}/file/${item.id}` : `/${PAGE_PATHS.content}`;

      const _handleClick = () => {
        if (!item.isFile) {
          context.setSelectedFolderId(item.id);
        }
      };

      return (
        <Link onClick={_handleClick} to={path}>
          {renderContentName(item, context.isMobile, imgSrc)}
        </Link>
      );
    },
  },
  {
    key: 'locationPath',
    name: 'Location',
    fieldName: 'locationPath',
    ariaLabel: 'Location',
    minWidth: 250,
    className: textClassNames.cellName,
    onRender: ({ locationPath, isTeam }) => {
      const path = isTeam ? `My Folder/${locationPath}` : locationPath;
      return <CustomText>{path}</CustomText>;
    },
    data: 'string',
  },
  {
    key: 'updateDate',
    name: 'Updated Date',
    fieldName: 'updateDate',
    ariaLabel: 'Updated Date',
    minWidth: 100,
    className: textClassNames.cellName,
    onRender: ({ updateDate }) => {
      return millisecondsToStr(new Date() - new Date(updateDate));
    },
    data: 'string',
  },
  {
    key: 'owner',
    name: 'Owner',
    fieldName: 'owner',
    ariaLabel: 'Owner',
    minWidth: 80,
    isRowHeader: true,
    onRender: (item) => {
      const { owner } = item;
      return <Persona size={PersonaSize.size40} text={owner} hidePersonaDetails />;
    },
    data: 'string',
  },
];

export const dataRoomColumnSchema = (isMobile) => [
  {
    key: 'name',
    name: 'Name',
    fieldName: 'name',
    ariaLabel: 'Name',
    minWidth: 150,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    onRender: (item) => {
      const { name, createdDate } = item;

      return (
        <Link to={`/${PAGE_PATHS.dataRooms}/${item.id}`}>{renderName(isMobile, name, 'Created', createdDate)}</Link>
      );
    },
  },
  {
    key: 'createdDate',
    name: 'Created Date',
    fieldName: 'createdDate',
    ariaLabel: 'Created Date',
    minWidth: 100,
    onRender: (item) => {
      const { createdDate } = item;
      return millisecondsToStr(new Date() - new Date(createdDate));
    },
    data: 'string',
  },
  {
    key: 'owner',
    name: 'Owner',
    fieldName: 'owner',
    ariaLabel: 'Owner',
    minWidth: 80,
    isRowHeader: true,
    onRender: (item) => {
      const { owner } = item;
      return <Persona size={PersonaSize.size40} text={owner} hidePersonaDetails />;
    },
    data: 'string',
  },
];

export const accountColumnSchema = (isMobile) => [
  {
    key: 'name',
    name: 'Name',
    fieldName: 'name',
    ariaLabel: 'Name',
    minWidth: 150,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: accountClassNames.cellName,
    onRender: (item) => (
      <Link to={`/${PAGE_PATHS.account}/${item.id}`} className={accountClassNames.linkItem}>
        {renderName(isMobile, item.name, 'Active', item.activeDate, true)}
      </Link>
    ),
  },
  {
    key: 'activeDate',
    name: 'Active Date',
    fieldName: 'lastActivity',
    ariaLabel: 'Active Date',
    minWidth: 100,
    className: accountClassNames.cellName,
    onRender: (item) => {
      const { lastActivity } = item;
      return millisecondsToStr(new Date() - new Date(lastActivity));
    },
    data: 'string',
  },
];

export const linksColumnSchema = (isMobile) => [
  {
    key: 'name',
    name: 'Name',
    fieldName: 'name',
    ariaLabel: 'Name',
    minWidth: 150,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    onRender: (item) => {
      const _handleOnClick = () => {
        window.open(`/view/${item.id}`, '_blank');
      };

      return (
        <Stack styles={{ root: { cursor: 'pointer' } }} onClick={_handleOnClick}>
          {renderName(isMobile, item.name, 'Created', item.createdDate)}
        </Stack>
      );
    },
  },
  {
    key: 'originalLink',
    name: 'Original Link',
    fieldName: 'originalLink',
    ariaLabel: 'Original Link',
    minWidth: 250,
    data: 'string',
    onRender: (item) => {
      const { id, owner } = item;
      return <PersonaLinkTag linkId={id} width={230} isCopyToClipboard createdBy={owner} />;
    },
  },
  {
    key: 'createDate',
    name: 'Created Date',
    fieldName: 'createDate',
    ariaLabel: 'Created Date',
    minWidth: 100,
    onRender: (item) => {
      const { createDate } = item;
      return millisecondsToStr(new Date() - new Date(createDate));
    },
    data: 'string',
  },
  {
    key: 'owner',
    name: 'Owner',
    fieldName: 'owner',
    ariaLabel: 'Owner',
    minWidth: 80,
    isRowHeader: true,
    onRender: (item) => {
      const { owner } = item;
      return <Persona size={PersonaSize.size40} text={owner} hidePersonaDetails />;
    },
    data: 'string',
  },
];

export const columnContactSchema = (isMobile) => [
  {
    key: 'name',
    name: 'Name',
    fieldName: 'name',
    ariaLabel: 'Name',
    minWidth: 150,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    onRender: (item) => {
      const _handleOnClick = () => {
        window.open(`/contacts/${item.id}`, '_self');
      };

      return (
        <Stack styles={{ root: { cursor: 'pointer' } }} onClick={_handleOnClick}>
          {renderName(isMobile, item.name, 'Last activity', item.lastActivity)}
        </Stack>
      );
    },
  },
  {
    key: 'linkAccountNames',
    name: 'Account Name',
    fieldName: 'linkAccountNames',
    ariaLabel: 'Account Name',
    minWidth: isMobile ? 130 : 250,
    data: 'string',
    onRender: (item) => {
      const { linkAccountNames } = item;
      return (
        <Stack style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {linkAccountNames}
        </Stack>
      );
    },
  },
  {
    key: 'lastActivity',
    name: 'Last Activity',
    fieldName: 'lastActivity',
    ariaLabel: 'Last Activity',
    minWidth: 140,
    onRender: (item) => {
      const { lastActivity } = item;
      return `Last seen ${millisecondsToStr(new Date() - new Date(lastActivity))}`;
    },
    data: 'string',
  },
];
