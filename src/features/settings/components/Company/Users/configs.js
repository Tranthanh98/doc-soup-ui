import { mergeStyleSets, Persona, PersonaSize, Stack, Text } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { COMPANY_USER_STATUS, MEMBER_USER, USER_ROLES } from 'core/constants/Const';
import React from 'react';

const classNames = mergeStyleSets({
  cellName: {
    padding: '0 !important',
    paddingLeft: 16,
    display: 'flex !important',
    alignItems: 'center',
  },
  cellNameMb: {
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      padding: '0px !important',
    },
    paddingLeft: '20px !important',
    display: 'flex !important',
    alignItems: 'center',
  },
  cellEmail: {
    display: 'flex !important',
    height: 60,
    alignItems: 'center',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      padding: '0px !important',
    },
  },
  cellState: {
    display: 'flex !important',
    alignItems: 'center',
  },
});

const personaStyle = {
  primaryText: {
    fontSize: 13,
    fontWeight: 'normal',
  },
};

const renderMember = (item, userInfo) => {
  if (item.status === COMPANY_USER_STATUS.INACTIVE && item.userId) {
    return 'Deactivated';
  }

  if (item.status === COMPANY_USER_STATUS.SUSPENDED && item.userId) {
    return 'Suspended';
  }

  let states = MEMBER_USER[item.member];

  if (item.member === MEMBER_USER.MEMBER && item.role === USER_ROLES.c_admin) {
    states = 'Admin';
  }

  if (item?.userId === userInfo?.id) {
    states += ' (You)';
  }

  return states;
};

const renderNameMb = (item, userInfo) => {
  return (
    <Stack verticalAlign="center" styles={{ root: { padding: '8px 0' } }}>
      <Text
        variant="smallPlus"
        styles={{
          root: {
            color: LIGHT_THEME.palette.neutralPrimary,
            fontWeight: '500',
          },
        }}
      >
        {`${item.fullName} ${item?.userId === userInfo?.id ? '(You)' : ''}`}
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
        {renderMember(item)}
      </Text>
    </Stack>
  );
};

const renderName = (item) => <Persona text={item.fullName} size={PersonaSize.size40} styles={personaStyle} />;

const columnsSchema = (isMobile, userInfo) => [
  {
    key: 'fullName',
    name: 'Name',
    fieldName: 'fullName',
    ariaLabel: 'Name',
    minWidth: 120,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellNameMb,
    styles: {
      cellTitle: {
        paddingLeft: '20px !important',
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          padding: '0px !important',
        },
        '&:hover': { background: 'transparent' },
      },
    },
    onRender: (item) => (isMobile ? renderNameMb(item, userInfo) : renderName(item)),
  },
];

const columnConfigMobile = (userInfo, status = null) => [
  {
    key: 'email',
    name: 'Email',
    fieldName: 'email',
    ariaLabel: 'Email',
    minWidth: 120,
    isRowHeader: true,
    isSortable: true,
    isSorted: status === COMPANY_USER_STATUS.INVITED,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    className: classNames.cellEmail,
    styles:
      status === COMPANY_USER_STATUS.INVITED
        ? {
            cellTitle: {
              paddingLeft: '20px !important',
              [BREAKPOINTS_RESPONSIVE.mdDown]: {
                padding: '0px !important',
              },
              '&:hover': { background: 'transparent' },
            },
          }
        : { cellTitle: { '&:hover': { background: 'transparent' } } },
    data: 'string',
  },
  {
    key: 'states',
    name: 'States',
    fieldName: 'states',
    ariaLabel: 'States',
    minWidth: 80,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellState,
    styles: { cellTitle: { '&:hover': { background: 'transparent' } } },
    onRender: (item) => renderMember(item, userInfo),
  },
];

export { columnsSchema, columnConfigMobile };
