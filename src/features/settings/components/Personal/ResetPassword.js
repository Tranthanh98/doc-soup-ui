import { Image, ImageFit, Stack, Text } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { CustomText } from 'features/shared/components';
import RestService from 'features/shared/services/restService';
import React, { useContext, useEffect } from 'react';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import GlobalContext from 'security/GlobalContext';
import ResetPasswordForm from './ResetPasswordForm';

const wrapPageStyles = {
  root: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
  },
};

const imgPageStyles = {
  root: {
    width: '60%',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      display: 'none',
    },
  },
};

const formResetStyles = {
  root: {
    width: '40%',
    padding: 60,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '100%',
      padding: 30,
    },
  },
};

const rightPageWrapper = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'stretch',
  width: '100%',
  backgroundColor: '#f7f1e8',
  flexGrow: 1,
};

const orangeBlock = {
  fontSize: '0.875rem',
  backgroundColor: '#ff8d00',
  minWidth: '62%',
  height: '66%',
  borderTopLeftRadius: '35%',
  alignSelf: 'flex-end',
  display: 'flex',
  alignItems: 'flex-end',
  padding: '90px 70px',
};

function ResetPassword() {
  const context = useContext(GlobalContext);

  const { authenticated, authContext } = context;

  const _onLogout = () => {
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

  const _redirecToLogin = async () => {
    if (authenticated) {
      _onLogout();
    }

    authContext.login({ redirectUri: window.location.origin });
  };

  useEffect(() => {
    if (authenticated) {
      _onLogout();
    }
  }, []);

  const _handleSubmit = (values, formProps) => {
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');

    token = token.replaceAll(' ', '+');

    new RestService()
      .setPath('/account/reset-password')
      .post({
        token,
        ...values,
      })
      .then(() => {
        _redirecToLogin();
      })
      .catch((err) => {
        restServiceHelper.handleError(err, formProps);
      })
      .finally(() => {
        formProps.setSubmitting(false);
      });
  };

  return (
    <Stack styles={wrapPageStyles}>
      <Stack verticalAlign="center" horizontalAlign="center" styles={formResetStyles}>
        <Image
          imageFit={ImageFit.contain}
          src="/img/logo-black.png"
          srcSet="/img/logo2x-black.png 2x, /img/logo3x-black.png 3x"
          alt="Logo"
          width={186}
          height={48}
          styles={{ root: { marginBottom: 60 } }}
          onClick={_redirecToLogin}
        />
        <Stack horizontalAlign="start" styles={{ root: { width: '100%' } }}>
          <Text styles={{ root: { marginBottom: 16 } }} variant="xLarge">
            Create new password
          </Text>
          <CustomText color="textSecondary"> Enter a new password below to change your password. </CustomText>
        </Stack>
        <ResetPasswordForm onSubmit={_handleSubmit} onLogin={_redirecToLogin} />
      </Stack>
      <Stack styles={imgPageStyles}>
        <div style={rightPageWrapper}>
          <div style={orangeBlock}>
            <p style={{ maxWidth: 120 }}>Share in seconds, Get in sights</p>
          </div>
          <div>
            <div style={{ backgroundColor: '#fe5700', width: '15vw', height: '34%' }} />
            <div style={{ flexGrow: 1, backgroundColor: '#00667d', width: '15vw', height: '66%' }} />
          </div>
        </div>
      </Stack>
    </Stack>
  );
}

export default ResetPassword;
