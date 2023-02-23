import React, { Component } from 'react';
import Keycloak from 'keycloak-js';
import GlobalContext from 'security/GlobalContext';
import { LoadingPage } from 'features/shared/components';

class Auth extends Component {
  componentDidMount() {
    const { setAuthenticated, setAuthContext } = this.context;

    const { REACT_APP_PROFILE } = process.env;

    const keycloak = new Keycloak(`/${REACT_APP_PROFILE}.json`);

    keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).then((authenticated) => {
      setAuthenticated(authenticated);
      setAuthContext({ authContext: keycloak });
    });

    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(5)
        .then((refreshed) => {
          if (!refreshed) {
            setAuthenticated(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  }

  render() {
    const { authContext, isInitialized } = this.context;

    const { children } = this.props;

    if (authContext) {
      return { ...(!isInitialized && LoadingPage), ...children };
    }

    return <LoadingPage />;
  }
}

Auth.contextType = GlobalContext;

export default Auth;
