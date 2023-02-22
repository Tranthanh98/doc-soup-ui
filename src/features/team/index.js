import { FontWeights, getTheme, Pivot, PivotItem, Shimmer, ShimmerElementType, Stack, Text } from '@fluentui/react';
import { CustomButton } from 'features/shared/components';
import React, { useContext, useEffect, useState } from 'react';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import RestService from 'features/shared/services/restService';
import { HASH_TAG, PAGE_PATHS, USER_ROLES } from 'core/constants/Const';
import GlobalContext from 'security/GlobalContext';
import { useHistory } from 'react-router-dom';
import TeammateTable from './components/TeammateTable';

const theme = getTheme();
const stackControlStyles = {
  root: {
    paddingBottom: theme.spacing.l2,
  },
};

const pageTitleStyles = {
  root: {
    fontWeight: FontWeights.bold,
    maxWidth: '50%',
  },
};

const pivotStatusStyles = {
  root: {
    fontSize: 13,
    fontWeight: FontWeights.semibold,
    borderBottom: 'none',
    justifyContent: 'flex-end',
  },
  link: {
    height: 30,
    margin: 0,
    padding: 0,
    color: LIGHT_THEME.palette.neutralSecondaryAlt,
    fontSize: 'inherit',
    fontWeight: 'inherit',
    backgroundColor: 'transparent',
    borderColor: `${LIGHT_THEME.palette.neutralQuaternary} transparent`,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    minWidth: 100,
    selectors: {
      '&:first-child': {
        borderLeft: `1px solid ${LIGHT_THEME.palette.neutralQuaternary}`,
        borderRight: `1px solid ${LIGHT_THEME.palette.neutralQuaternary}`,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
      },
      '&:last-child': {
        borderLeft: `1px solid ${LIGHT_THEME.palette.neutralQuaternary}`,
        borderRight: `1px solid ${LIGHT_THEME.palette.neutralQuaternary}`,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
      },
    },
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '50%',
    },
  },
  linkContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  linkIsSelected: {
    color: `${LIGHT_THEME.palette.white} !important`,
    borderColor: `${LIGHT_THEME.palette.neutralPrimaryAlt} !important`,
    margin: 0,
    borderWidth: 0,
    backgroundColor: `${LIGHT_THEME.palette.neutralPrimaryAlt} !important`,
    selectors: {
      '& > span': {
        '&:hover': { backgroundColor: 'transparent' },
      },
    },
  },
  itemContainer: {
    marginTop: 11,
  },
};

const getShimmerElements = () => {
  return [
    { type: ShimmerElementType.circle, height: 24 },
    { type: ShimmerElementType.gap, width: 8 },
    { type: ShimmerElementType.line, height: 8 },
  ];
};

export default function Team() {
  const [totalMember, setTotalMember] = useState(0);
  const [activeCompany, setActiveCompany] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const context = useContext(GlobalContext);

  const history = useHistory();

  const _handleTotalMember = (value) => {
    setTotalMember(value);
  };

  const _getActiveCompany = () => {
    const { getToken } = context;
    new RestService()
      .setPath(`/company/current-active`)
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        setActiveCompany(data);
      });
  };

  const _getAccount = () => {
    const { getToken } = context;
    new RestService()
      .setPath('/account')
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        setIsAdmin(data.role === USER_ROLES.c_admin);
      });
  };

  const _getUserInfo = async () => {
    const { getUserInfo } = context;
    const userInfoResult = await getUserInfo();
    if (userInfoResult) {
      setUserInfo(userInfoResult);
    }
  };

  useEffect(() => {
    _getAccount();
    _getActiveCompany();
    _getUserInfo();
  }, []);

  return (
    <>
      <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: 8 }} styles={stackControlStyles}>
        {!activeCompany ? (
          <Shimmer shimmerElements={getShimmerElements()} />
        ) : (
          <>
            <Text variant="xLarge" styles={pageTitleStyles} nowrap>
              {`${activeCompany.name} `}
            </Text>
            <Text variant="xLarge" styles={pageTitleStyles}>{` (${totalMember})`}</Text>
          </>
        )}
        <div style={{ flex: 1 }} />
        {isAdmin && (
          <CustomButton
            primary
            size="medium"
            text="Manage Users"
            onClick={() => history.push(`/${PAGE_PATHS.settings}${HASH_TAG.USER_SETTING}`)}
          />
        )}
      </Stack>
      <Pivot aria-label="Team status pivot" defaultSelectedKey="thirtyDays" styles={pivotStatusStyles}>
        <PivotItem headerText="Last 7 Days" itemKey="sevenDays">
          <TeammateTable days={7} handleTotalMember={_handleTotalMember} isAdmin={isAdmin} userInfo={userInfo} />
        </PivotItem>
        <PivotItem headerText="Last 30 days" itemKey="thirtyDays">
          <TeammateTable days={30} handleTotalMember={_handleTotalMember} isAdmin={isAdmin} userInfo={userInfo} />
        </PivotItem>
      </Pivot>
    </>
  );
}
