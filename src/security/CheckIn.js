import { Component } from 'react';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import { COMPANY_USER_STATUS } from 'core/constants/Const';
import PdfViewerComponent from 'core/components/PdfViewerComponent';

const BAD_REQUEST_STATUS = 400;

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkIn: true,
    };
  }

  componentDidMount() {
    const { authContext, authenticated, setInitialized } = this.context;

    if (authContext && authenticated) {
      const { getToken } = this.context;

      new RestService()
        .setPath('/check-in')
        .setToken(getToken())
        .post()
        .then(() => {
          console.log('checked in');
          this.setState({ checkIn: false });
          setInitialized(true);
          this._getPlanFeatures();
        })
        .catch((err) => {
          const resData = err.response?.data;

          if (
            err.response?.status === BAD_REQUEST_STATUS &&
            (resData?.status === COMPANY_USER_STATUS.SUSPENDED || resData?.status === COMPANY_USER_STATUS.INACTIVE)
          ) {
            this.setState({ checkIn: true });

            window.alert(resData.message, {
              title: `Suspended!`,
              subText: resData.message,
              actionText: 'Go to Login',
              onClose: this._onRedirectToLogin,
            });
          } else {
            window.alert(err.message, {
              title: `Error!`,
              actionText: 'Go to Login',
              onClose: this._onRedirectToLogin,
            });
          }
        });
    } else {
      this.setState({ checkIn: false });
      setInitialized(true);
    }
  }

  _getPlanFeatures = () => {
    const { getToken, setPlanFeatures } = this.context;

    new RestService()
      .setPath('/plan-tier/current/features')
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        setPlanFeatures(data);
      });
  };

  _onRedirectToLogin = async () => {
    const { authContext, authenticated } = this.context;
    if (authenticated) {
      await this._onLogout();
    }

    authContext.login();
  };

  _onLogout = () => {
    const { authContext } = this.context;
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

  render() {
    const { checkIn } = this.state;
    const { children } = this.props;

    if (checkIn) {
      return null;
      // return <PdfViewerComponent document="document.pdf"/>
    }
    return { ...children };
  }
}

CheckIn.contextType = GlobalContext;

export default CheckIn;
