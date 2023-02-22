import React from 'react';
import { Link } from 'react-router-dom';
import { mergeStyleSets, Persona, PersonaSize, Stack, Text } from '@fluentui/react';
import { LIGHT_THEME } from 'core/constants/Theme';
import { CustomText } from 'features/shared/components';
import { MEMBER_USER, PAGE_PATHS, USER_ROLE_OPTIONS } from 'core/constants/Const';

const classNames = mergeStyleSets({
  cellName: {
    padding: '0px !important',
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

const personaStyle = {
  primaryText: {
    fontSize: 13,
    fontWeight: 'normal',
  },
};

const detailTextPersona = {
  root: {
    color: LIGHT_THEME.palette.neutralPrimary,
    paddingLeft: 12,
    fontWeight: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:hover': {
      color: LIGHT_THEME.palette.neutralPrimary,
      textDecoration: 'underline',
    },
  },
};

const renderName = (item, userInfo, isAdmin) => (
  <>
    <Persona text={item.fullName} size={PersonaSize.size40} styles={personaStyle} hidePersonaDetails />
    {isAdmin ? (
      <Link to={`/${PAGE_PATHS.team}/${item.accountId}`}>
        <Text styles={detailTextPersona}>
          {item?.accountId === userInfo?.id ? `${item.fullName} (You)` : item.fullName}
        </Text>
      </Link>
    ) : (
      <Text styles={detailTextPersona} nowrap>
        {item?.accountId === userInfo?.id ? `${item.fullName} (You)` : item.fullName}
      </Text>
    )}
  </>
);

const renderEmail = (item) => {
  return <Text nowrap>{item.email}</Text>;
};

const renderRole = (item) => {
  const { role, memberType } = item;
  let userRole = null;
  if (memberType === MEMBER_USER.OWNER) {
    userRole = MEMBER_USER[memberType];
  } else {
    userRole = USER_ROLE_OPTIONS.find((i) => i.key === role)?.text;
  }
  return <CustomText variant="smallPlus">{userRole}</CustomText>;
};

const renderNameMB = (item, userInfo, isAdmin) =>
  isAdmin ? (
    <Stack verticalAlign="center">
      <Link to={`/${PAGE_PATHS.team}/${item.accountId}`}>
        <Text
          variant="smallPlus"
          styles={{
            root: {
              display: 'flex',
              flexDirection: 'column',
              color: LIGHT_THEME.palette.neutralPrimary,
              fontWeight: '500',
            },
          }}
        >
          {`${item.fullName} ${item?.accountId === userInfo?.id ? '(You)' : ''}`}
        </Text>
        <Text
          variant="small"
          styles={{
            root: {
              color: LIGHT_THEME.palette.neutralSecondaryAlt,
            },
          }}
        >
          {`${item.email}`}
        </Text>
        <Text
          variant="small"
          styles={{
            root: {
              color: LIGHT_THEME.palette.neutralSecondaryAlt,
            },
          }}
        >
          {renderRole(item)}
        </Text>
      </Link>
    </Stack>
  ) : (
    <Stack verticalAlign="center">
      <Text
        variant="smallPlus"
        styles={{
          root: {
            color: LIGHT_THEME.palette.neutralPrimary,
            fontWeight: '500',
          },
        }}
      >
        {`${item.fullName} ${item?.accountId === userInfo?.id ? '(You)' : ''}`}
      </Text>
      <Text
        variant="small"
        styles={{
          root: {
            color: LIGHT_THEME.palette.neutralSecondaryAlt,
          },
        }}
      >
        {`${item.email}`}
      </Text>
      <Text
        variant="small"
        styles={{
          root: {
            color: LIGHT_THEME.palette.neutralSecondaryAlt,
          },
        }}
      >
        {renderRole(item)}
      </Text>
    </Stack>
  );

const columnTeamConfig = (isMobile, isDesktop, userInfo, isAdmin = false) => {
  const columnConfig = [
    {
      key: 'links',
      name: 'Links',
      fieldName: 'links',
      ariaLabel: 'Links',
      minWidth: isDesktop ? 100 : 45,
      isSortable: true,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'number',
    },
    {
      key: 'dataRooms',
      name: 'Data Rooms',
      fieldName: 'dataRooms',
      ariaLabel: 'Data Rooms',
      minWidth: isDesktop ? 100 : 45,
      data: 'number',
    },
    {
      key: 'roomLinks',
      name: 'Room Links',
      fieldName: 'roomLinks',
      ariaLabel: 'Room Links',
      minWidth: isDesktop ? 100 : 45,
      data: 'number',
    },
    {
      key: 'visits',
      name: 'Visits',
      fieldName: 'visits',
      ariaLabel: 'Visits',
      minWidth: isDesktop ? 100 : 45,
      data: 'number',
    },
  ];

  const columnDesktop = [
    {
      key: 'name',
      name: 'Name',
      fieldName: 'fullName',
      ariaLabel: 'Name',
      minWidth: 100,
      isSortable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'string',
      className: classNames.cellName,
      onRender: (item) => renderName(item, userInfo, isAdmin),
    },
    {
      key: 'email',
      name: 'Email',
      fieldName: 'email',
      ariaLabel: 'Email',
      minWidth: 170,
      isSortable: true,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'string',
      className: classNames.cellName,
      onRender: renderEmail,
    },
    {
      key: 'states',
      name: 'States',
      fieldName: 'states',
      ariaLabel: 'States',
      minWidth: 100,
      data: 'string',
      onRender: (item) => renderRole(item),
    },
  ];

  const columnMobile = [
    {
      key: 'name',
      name: 'Name',
      fieldName: 'fullName',
      ariaLabel: 'Name',
      minWidth: 100,
      isSortable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'string',
      className: classNames.cellName,
      onRender: (item) => renderNameMB(item, userInfo, isAdmin),
    },
  ];
  return isMobile ? columnMobile.concat(columnConfig) : columnDesktop.concat(columnConfig);
};

export default columnTeamConfig;
