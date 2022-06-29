import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import GlobalContext from 'security/GlobalContext';
import { UnAuthenticationPage, LoadingPage } from 'features/shared/components';
import Keycloak from 'keycloak-js';

class AuthorizedRoute extends Component {
  componentDidMount() {
    const { REACT_APP_PROFILE, NODE_ENV } = process.env;

    const { authContext, authenticated } = this.context;

    if (!authContext || !authenticated) {
      if (!NODE_ENV || NODE_ENV === 'development') {
        console.log('authenticate from authorized router');
      }
      const { setAuthenticated, setAuthContext } = this.context;

      const keycloak = Keycloak(`/${REACT_APP_PROFILE}.json`);

      keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then((authenticated) => {
        setAuthenticated(authenticated);
        setAuthContext({ authContext: keycloak });
      });
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    const { authContext, authenticated } = this.context;
    if (authContext) {
      if (authenticated) {
        return <Route {...rest} render={(props) => <Component {...props} />} />;
      }
      return <UnAuthenticationPage onBtnClick={() => authContext.login()} />;
    }

    return <LoadingPage />;
  }
}
AuthorizedRoute.contextType = GlobalContext;
AuthorizedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};
export default AuthorizedRoute;
