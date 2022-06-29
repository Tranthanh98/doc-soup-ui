/* eslint-disable prefer-destructuring */
import React, { useContext, useEffect, useState } from 'react';
import GlobalContext from 'security/GlobalContext';
import PromotionLayout from 'features/shared/components/Layout/PromotionLayout';
import { error } from 'features/shared/components/ToastMessage';
import RestService from 'features/shared/services/restService';
import { Stack, Text, Image, ImageFit, PrimaryButton, DefaultButton } from '@fluentui/react';
import { LIGHT_THEME } from 'core/constants/Theme';
import { LoadingPage } from 'features/shared/components';

const descriptionTextStyles = { root: { color: LIGHT_THEME.palette.neutralSecondaryAlt } };
const ignoreBtnStyles = {
  root: { width: 80, height: 40 },
  label: { color: LIGHT_THEME.palette.neutralSecondaryAlt, fontWeight: 500 },
};
const acceptInvitationBtnStyles = { root: { width: 160, height: 40 }, label: { fontSize: 14, fontWeight: 500 } };

const invitedWrapStyle = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
};

export default function AcceptInvitation(props) {
  const { history } = props;
  const params = new URL(document.location).searchParams;
  const clientToken = params.get('clientToken');
  const decodedString = window.atob(clientToken);
  const emailAndCompanyArray = decodedString.split('_');
  let email = '';
  let companyName = '';
  if (emailAndCompanyArray.length >= 2) {
    email = emailAndCompanyArray[0];
    companyName = emailAndCompanyArray[1];
  }

  const token = params.get('token');
  const [loading, setLoading] = useState(false);

  const context = useContext(GlobalContext);

  const _onLogout = () => {
    const { authContext } = context;
    const logoutUrl = `${authContext.authServerUrl}realms/${authContext.realm}/protocol/openid-connect/logout`;
    const request = {
      client_id: authContext.clientId,
      refresh_token: authContext.refreshToken,
    };
    return new RestService()
      .setPath(logoutUrl)
      .setHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      .post(new URLSearchParams(request));
  };

  const _onRedirectToLogin = async () => {
    const { authContext, authenticated } = context;
    if (authenticated) {
      await _onLogout();
    }

    authContext.login({ redirectUri: window.location.origin });
  };

  const _acceptInvitation = (isAccepted) => {
    setLoading(true);
    new RestService()
      .setPath(`/company/user/accept-invitation?token=${token}`)
      .post({ isAccepted })
      .then(() => {
        _onRedirectToLogin();
      })
      .catch((err) => {
        const fieldErrors = err?.response?.data?.fieldErrors || {};
        if (fieldErrors?.token) {
          error(fieldErrors.token);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const _checkAndAcceptInvitation = () => {
    const accepted = params.get('accepted');
    if (accepted && Boolean(accepted)) {
      _acceptInvitation(true);
    }
  };

  useEffect(() => {
    _checkAndAcceptInvitation();
  }, [token]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <PromotionLayout title="" onPrevious={() => history.push('/')}>
      <Stack styles={invitedWrapStyle}>
        <Stack horizontalAlign="center" verticalAlign="center">
          <Image
            imageFit={ImageFit.centerContain}
            src="/img/airplane.png"
            srcSet="/img/airplane-2x.png, /img/airplane-3x.png"
            width={140}
            height={80}
          />
          <Text variant="xLarge" styles={{ root: { fontWeight: 'normal' } }} style={{ marginTop: 40 }}>
            Accept your invitation
          </Text>
          <Text variant="small" styles={descriptionTextStyles} style={{ marginTop: 20 }}>
            You ({email}) have been invited to join ({companyName}) on DocSoup.
          </Text>
          <Text variant="small" styles={descriptionTextStyles}>
            Click the button below to confirm your acceptance and gain access.
          </Text>
          <Stack horizontal style={{ marginTop: 20 }} tokens={{ childrenGap: 12 }}>
            <DefaultButton onClick={() => _acceptInvitation(false)} styles={ignoreBtnStyles} text="Ignore" />
            <PrimaryButton
              onClick={() => _acceptInvitation(true)}
              styles={acceptInvitationBtnStyles}
              text="Accept Invitation"
            />
          </Stack>
        </Stack>
      </Stack>
    </PromotionLayout>
  );
}
