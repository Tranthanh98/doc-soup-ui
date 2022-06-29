import { getTheme, Persona, PersonaSize, Shimmer, ShimmerElementType, Stack, Text } from '@fluentui/react';
import { USER_ROLES } from 'core/constants/Const';
import { LIGHT_THEME } from 'core/constants/Theme';
import RestService from 'features/shared/services/restService';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalContext from 'security/GlobalContext';
import ContentOfUser from '../components/ContentOfUser';
import RecentVisit from '../components/RecentVisit';

const getShimmerElements = () => {
  return [
    { type: ShimmerElementType.circle, height: 24 },
    { type: ShimmerElementType.gap, width: 8 },
    { type: ShimmerElementType.line, height: 8 },
  ];
};

const theme = getTheme();
const stackControlStyles = {
  root: {
    paddingBottom: theme.spacing.l2,
  },
};

const personaStyle = {
  primaryText: {
    fontSize: 13,
    fontWeight: 'normal',
  },
};

const detailPersona = {
  root: {
    marginLeft: 8,
  },
};

const titleDetail = {
  root: {
    fontSize: 16,
    color: LIGHT_THEME.palette.neutralPrimary,
    letterSpacing: -0.5,
    fontWeight: 500,
  },
};

const subTitleDetail = {
  root: {
    fontSize: 12,
    color: LIGHT_THEME.palette.neutralSecondaryAlt,
    letterSpacing: -0.5,
  },
};

export default function TeamDetail() {
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [teamUser, setTeamUser] = useState(undefined);
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(GlobalContext);

  const _getUserOfTeamInfo = () => {
    const { getToken } = context;
    new RestService()
      .setPath(`/company/user/${userId}`)
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        setTeamUser(data);
      });
  };

  const _checkAdmin = () => {
    const { getToken } = context;

    setIsLoading(true);
    new RestService()
      .setPath('/account')
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        setIsAdminUser(data.role === USER_ROLES.c_admin);
        _getUserOfTeamInfo();
      })
      .catch(() => {
        setIsAdminUser(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    _checkAdmin();
  }, []);

  if (isLoading) {
    return (
      <Stack tokens={{ childrenGap: 16 }}>
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <br />
      </Stack>
    );
  }

  return (
    <>
      {isAdminUser ? (
        <>
          {teamUser && (
            <>
              <Stack horizontal horizontalAlign="start" tokens={{ childrenGap: 8 }} styles={stackControlStyles}>
                <Persona
                  text={`${teamUser?.firstName} ${teamUser?.lastName}`}
                  size={PersonaSize.size40}
                  styles={personaStyle}
                  hidePersonaDetails
                  initialsColor={15}
                />
                <Stack styles={detailPersona}>
                  <Text styles={titleDetail}>{`${teamUser?.firstName} ${teamUser?.lastName}`}</Text>
                  <Text styles={subTitleDetail}>{teamUser?.email}</Text>
                </Stack>
              </Stack>
              <Stack>
                <ContentOfUser />
              </Stack>
              <Stack>
                <RecentVisit />
              </Stack>
            </>
          )}
        </>
      ) : (
        <Stack
          horizontal
          horizontalAlign="center"
          verticalAlign="center"
          styles={{ root: { height: '85vh', width: '100%' } }}
        >
          <Text variant="xxLarge">You do not have a right privilege to perform this operation!</Text>
        </Stack>
      )}
    </>
  );
}
