/* eslint-disable max-lines */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CustomDetailsList, CustomText } from 'features/shared/components';
import GlobalContext from 'security/GlobalContext';
import { COMPANY_USER_STATUS, MEMBER_USER, USER_ROLES } from 'core/constants/Const';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import PropTypes from 'prop-types';
import { success } from 'features/shared/components/ToastMessage';
import { LIGHT_THEME } from 'core/constants/Theme';
import Resource from 'core/constants/Resource';
import { DirectionalHint, mergeStyleSets } from '@fluentui/react';
import CustomDetailRow from 'features/shared/components/CustomDetailsList/CustomDetailRow';
import { columnsSchema, columnConfigMobile } from './configs';

const classNames = mergeStyleSets({
  headerStyle: {
    selectors: {
      '.ms-DetailsHeader': { background: LIGHT_THEME.palette.grayLight },
      '.ms-SelectionZone': {
        maxHeight: 270,
        overflowY: 'overlay',
      },
    },
  },
});
const detailRowListStyles = {
  root: {
    selectors: {
      '&:hover': {
        backgroundColor: LIGHT_THEME.palette.darkLight,
      },
    },
  },
};

export default function UserListStatus({ transferData, onChangeStatus, status, users, companyId }) {
  const context = useContext(GlobalContext);

  const [userInfo, setUserInfo] = useState({});
  const { isMobile, getToken, getUserInfo } = context;

  const _deactive = (row) => {
    new RestService()
      .setPath(`/company/${companyId}/user/${row.userId}/de-active`)
      .setToken(getToken())
      .put()
      .then(() => {
        success('User deactivated.');
        onChangeStatus(status);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  const _active = (row) => {
    new RestService()
      .setPath(`/company/${companyId}/user/${row.userId}/re-active`)
      .setToken(getToken())
      .put()
      .then(() => {
        success('User reactivated.');
        onChangeStatus(status);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  const _makeOwner = (row) => {
    new RestService()
      .setPath(`/company/${companyId}/user/${row.userId}/make-owner`)
      .setToken(getToken())
      .put()
      .then(() => {
        success(`${row.email} is now an Owner of your company.`);
        onChangeStatus(status);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  const _makeMember = (row) => {
    new RestService()
      .setPath(`/company/${companyId}/user/${row.userId}/make-member`)
      .setToken(getToken())
      .put()
      .then(() => {
        success(`${row.email} was demoted from Admin to Member.`);
        onChangeStatus(status);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  const _suspended = (row) => {
    new RestService()
      .setPath(`/company/${companyId}/user/${row.userId}/suspend`)
      .setToken(getToken())
      .put()
      .then(() => {
        success(`User suspended successfully.`);
        onChangeStatus(status);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  const _unsuspended = (row) => {
    new RestService()
      .setPath(`/company/${companyId}/user/${row.userId}/unsuspend`)
      .setToken(getToken())
      .put()
      .then(() => {
        success(`User unsuspend successfully.`);
        onChangeStatus(status);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  const _unInvite = (row) => {
    new RestService()
      .setPath(`/company/user/cancel-invitation/${row.id}`)
      .setToken(getToken())
      .put()
      .then(() => {
        success(`${row.email} has been uninvited`);
        onChangeStatus(status);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  const _resendInvite = (row) => {
    new RestService()
      .setPath(`/company/user/resend-invitation/${row.id}`)
      .setToken(getToken())
      .put()
      .then(() => {
        success(`Invite resent to ${row.email}`);
        onChangeStatus(status);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  useEffect(() => {
    onChangeStatus(status);
  }, [status, onChangeStatus]);

  useEffect(() => {
    getUserInfo().then((res) => {
      setUserInfo(res);
    });
  }, []);
  // eslint-disable-next-line react/no-multi-comp
  const _getMenuProps = (row) => {
    const { email, status: statusUser, role, member, fullName } = row;

    if (status.includes(COMPANY_USER_STATUS.ACTIVE)) {
      if (member === MEMBER_USER.OWNER) {
        return null;
      }

      const menuList = [
        {
          key: 'suspended',
          text: 'Suspend Account',
          onClick: () => {
            window.confirm({
              title: `Are you sure you want to suspend the account for ${email}?`,
              yesText: `Yes, Suspend ${fullName}`,
              noText: 'Cancel',
              subText: Resource.SUSPENDING_ACCOUNT_SUB_TEXT,
              yesAction: () => _suspended(row),
            });
          },
        },
        {
          key: 'deactive',
          text: 'Deactive',
          onClick: () => {
            window.confirm({
              title: `Are you sure you want to deactivate ${email}?`,
              yesText: 'Deactive',
              noText: 'Cancel',
              subText: Resource.DEACTIVE_ACCOUNT_SUB_TEXT,
              yesAction: () => _deactive(row),
            });
          },
        },
      ];

      if (member === MEMBER_USER.MEMBER) {
        menuList.splice(1, 0, {
          key: 'makeOwner',
          text: 'Make Owner',
          onClick: () => {
            window.confirm({
              title: Resource.TITLE_MAKE_OWNER,
              yesText: 'Yes, Transfer ownership',
              noText: 'Cancel',
              subText: Resource.MAKE_OWNER_SUB_TEXT.format(email),
              yesAction: () => _makeOwner(row),
              minWidth: 480,
            });
          },
        });
      }

      if (role === USER_ROLES.c_admin && member !== MEMBER_USER.OWNER) {
        menuList.splice(2, 0, {
          key: 'makeMember',
          text: 'Make Member',
          onClick: () => {
            window.confirm({
              title: Resource.TITLE_MAKE_MEMBER.format(email),
              yesText: 'Yes, Change role to Member',
              noText: 'Cancel',
              subText: Resource.MAKE_MEMBER_SUB_TEXT.format(email),
              yesAction: () => _makeMember(row),
              minWidth: 450,
            });
          },
        });
      }

      return {
        items: menuList,
        directionalHint: DirectionalHint.bottomRightEdge,
        directionalHintFixed: true,
        beakWidth: 0,
      };
    }

    if (
      status.includes(COMPANY_USER_STATUS.INACTIVE) ||
      status.includes(COMPANY_USER_STATUS.SUSPENDED) ||
      status.includes(COMPANY_USER_STATUS.TRANSFERRED)
    ) {
      const menuList = [
        {
          key: 'transferData',
          text: (
            <CustomText
              style={{
                color:
                  statusUser === COMPANY_USER_STATUS.TRANSFERRED ? LIGHT_THEME.palette.gray : LIGHT_THEME.palette.red,
              }}
            >
              Transfer user data
            </CustomText>
          ),
          onClick: () => transferData(row),
          disabled: statusUser === COMPANY_USER_STATUS.TRANSFERRED,
        },
      ];

      if (statusUser === COMPANY_USER_STATUS.SUSPENDED) {
        menuList.unshift({
          key: 'unsuspended',
          text: 'Unsuspended',
          onClick: () => {
            window.confirm({
              title: `Are you sure you want to unsuspended ${email}?`,
              yesText: 'Unsuspended',
              noText: 'Cancel',
              subText: Resource.UNSUSPEND_ACCOUNT,
              yesAction: () => _unsuspended(row),
            });
          },
        });
      }

      if (statusUser === COMPANY_USER_STATUS.INACTIVE || statusUser === COMPANY_USER_STATUS.TRANSFERRED) {
        menuList.unshift({
          key: 'reactive',
          text: 'Reactive',
          onClick: () => {
            window.confirm({
              title: `Are you sure you want to reactivate ${email}?`,
              yesText: 'Reactive',
              noText: 'Cancel',
              subText: Resource.REACTIVE_ACCOUNT_SUB_TEXT,
              yesAction: () => _active(row),
            });
          },
        });
      }

      return {
        items: menuList,
        directionalHint: DirectionalHint.bottomRightEdge,
        directionalHintFixed: true,
        beakWidth: 0,
      };
    }
    return {
      items: [
        {
          key: 'Uninvite',
          text: 'Uninvite',
          onClick: () => {
            window.confirm({
              title: `Are you sure you want to uninvite ${email}?`,
              yesText: 'Uninvite',
              noText: 'Cancel',
              yesAction: () => _unInvite(row),
              minWidth: 430,
            });
          },
        },
        {
          key: 'Resend invite',
          text: 'Resend invite',
          onClick: () => {
            window.confirm({
              title: `Are you sure you want to resend invite to ${email}?`,
              yesText: 'Resend',
              noText: 'Cancel',
              yesAction: () => _resendInvite(row),
              minWidth: 430,
            });
          },
        },
      ],
      directionalHint: DirectionalHint.bottomRightEdge,
      directionalHintFixed: true,
      beakWidth: 0,
    };
  };

  const columnConfig = useMemo(() => {
    if (status.includes(COMPANY_USER_STATUS.INVITED)) {
      return columnConfigMobile(userInfo, COMPANY_USER_STATUS.INVITED);
    }

    if (!isMobile) {
      return [...columnsSchema(isMobile, userInfo), ...columnConfigMobile(userInfo)];
    }

    return columnsSchema(isMobile, userInfo);
  }, [isMobile, userInfo]);

  return (
    <CustomDetailsList
      isStickyHeader={false}
      striped
      columns={columnConfig}
      items={users}
      onGetMenuActions={_getMenuProps}
      actionIconName="more-svg"
      detailListProps={{
        className: classNames.headerStyle,
        onRenderRow: (row) => {
          return <CustomDetailRow rowProps={row} styles={detailRowListStyles} />;
        },
      }}
    />
  );
}

UserListStatus.propTypes = {
  transferData: PropTypes.func.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  status: PropTypes.arrayOf(PropTypes.number).isRequired,
  users: PropTypes.oneOfType([PropTypes.array]).isRequired,
  companyId: PropTypes.string,
};

UserListStatus.defaultProps = {
  companyId: undefined,
};
