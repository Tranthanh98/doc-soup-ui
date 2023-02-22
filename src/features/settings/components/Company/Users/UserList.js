/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { FontWeights, Pivot, PivotItem } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { COMPANY_USER_STATUS, COMPANY_USER_STATUS_NAME } from 'core/constants/Const';
import UserListStatus from './UserListStatus';

const pivotStatusStyles = (props) => {
  const { neutralPrimaryAlt, white, neutralQuaternary } = props.theme.palette;
  return {
    root: {
      fontSize: 13,
      fontWeight: FontWeights.semibold,
      borderBottom: 'none',
      marginBottom: 10,
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        marginBottom: 50,
      },
    },
    itemContainer: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        marginTop: 45,
      },
    },
    link: {
      height: 30,
      margin: 0,
      padding: 0,
      color: LIGHT_THEME.palette.neutralSecondaryAlt,
      fontSize: 'inherit',
      fontWeight: 'inherit',
      backgroundColor: LIGHT_THEME.palette.white,
      borderColor: `${neutralQuaternary} transparent`,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      minWidth: '100px !important',
      selectors: {
        '&:first-child': {
          borderLeft: `1px solid ${neutralQuaternary}`,
          borderRight: `1px solid ${neutralQuaternary}`,
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
        },
        '&:last-child': {
          borderLeft: `1px solid ${neutralQuaternary}`,
          borderRight: `1px solid ${neutralQuaternary}`,
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
        },
        '&:hover': {
          backgroundColor: LIGHT_THEME.palette.white,
        },
      },
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        width: '33%',
      },
    },
    linkContent: {
      paddingLeft: 16,
      paddingRight: 16,
    },
    linkIsSelected: {
      color: `${white} !important`,
      borderColor: `${neutralPrimaryAlt} !important`,
      margin: 0,
      borderWidth: 0,
      backgroundColor: `${neutralPrimaryAlt} !important`,
      selectors: {
        '& > span': {
          '&:hover': { backgroundColor: 'transparent' },
        },
      },
    },
  };
};

const activeStatus = [COMPANY_USER_STATUS.ACTIVE];

const inactiveStatus = [COMPANY_USER_STATUS.INACTIVE, COMPANY_USER_STATUS.SUSPENDED, COMPANY_USER_STATUS.TRANSFERRED];

const invitedStatus = [COMPANY_USER_STATUS.INVITED];

export default function UserList(props) {
  const { allUsers } = props;
  return (
    <Pivot aria-label="User status pivot" styles={pivotStatusStyles}>
      <PivotItem
        headerText={`${COMPANY_USER_STATUS_NAME.ACTIVE} (${
          allUsers?.filter((i) => i.status === 1 && i.userId).length || 0
        })`}
      >
        <UserListStatus status={activeStatus} {...props} />
      </PivotItem>
      <PivotItem
        headerText={`${COMPANY_USER_STATUS_NAME.INACTIVE} (${
          allUsers?.filter((i) => i.status < 1 && i.userId).length || 0
        })`}
      >
        <UserListStatus status={inactiveStatus} {...props} />
      </PivotItem>
      <PivotItem headerText={`${COMPANY_USER_STATUS_NAME.INVITED} (${allUsers?.filter((i) => !i.userId).length || 0})`}>
        <UserListStatus status={invitedStatus} {...props} />
      </PivotItem>
    </Pivot>
  );
}

UserList.propTypes = {
  allUsers: PropTypes.oneOfType([PropTypes.array]),
  transferData: PropTypes.func.isRequired,
};

UserList.defaultProps = {
  allUsers: undefined,
};
