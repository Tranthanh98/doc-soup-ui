import { IconButton, Image, ImageFit, Stack, Text } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { CustomText } from 'features/shared/components';
import { success } from 'features/shared/components/ToastMessage';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import RestService from 'features/shared/services/restService';
import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import CompanyList from './components/CompanyList';

const wrapPageStyles = {
  root: {
    height: '100vh',
    width: '100%',
    margin: 'auto',
  },
};

const wrapFormSwitchStyles = {
  root: {
    height: '100vh',
    width: '50%',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '100%',
    },
  },
};

const logoSwitchStyles = {
  root: {
    height: '100vh',
    width: '50%',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      display: 'none',
    },
  },
};

const imgPageStyles = {
  root: {
    width: '100%',
    height: '100%',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      display: 'none',
    },
  },
};

const btnArrowBackStyles = {
  root: {
    margin: '10px 30px',
  },
  rootHovered: {
    backgroundColor: LIGHT_THEME.palette.noBackground,
  },
  rootPressed: {
    backgroundColor: LIGHT_THEME.palette.noBackground,
  },
};

const wrapStyles = {
  root: {
    width: 338,
    height: '100%',
    margin: 'auto 86px auto auto',
    display: 'flex',
    justifyContent: 'center',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      margin: 'auto',
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
  minWidth: '60%',
  height: '66%',
  width: '100%',
  alignSelf: 'flex-end',
  display: 'flex',
  alignItems: 'flex-end',
  padding: '90px 70px',
};

const textTitleStyle = {
  root: {
    marginBottom: 16,
    color: `${LIGHT_THEME.palette.neutralSecondaryAlt}`,
    letterSpacing: -0.5,
    fontSize: 13,
    fontWeight: 500,
  },
};

const footerStyles = {
  root: {
    width: 338,
    margin: 'auto',
    marginRight: 86,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      flexFlow: 'column nowrap',
      alignItems: 'flex-start',
      margin: 'auto',
    },
  },
};

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
    };
  }

  componentDidMount() {
    this._getCompaniesOfUser();
  }

  _selectCompany = (company) => {
    const { getToken } = this.context;
    const values = { destinationCompanyId: company.id };

    new RestService()
      .setPath('/account/switch-company')
      .setToken(getToken())
      .put(values)
      .then(() => {
        success(`Switch to ${company.name}`);
        window.open('/', '_self');
        this._getPlanFeatures();
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

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

  _redirectToPrevPage = () => {
    const { history } = this.props;
    history.goBack();
  };

  _getCompaniesOfUser() {
    const { getToken } = this.context;
    new RestService()
      .setPath('/company')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          this.setState({ companies: res.data });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  }

  render() {
    const { companies } = this.state;
    return (
      <Stack horizontal styles={wrapPageStyles}>
        <Stack styles={wrapFormSwitchStyles}>
          <IconButton
            iconProps={{ iconName: 'arrow-back' }}
            styles={btnArrowBackStyles}
            onClick={this._redirectToPrevPage}
          />
          <Stack.Item style={{ height: 'calc(100vh - 142px)' }}>
            <Stack styles={wrapStyles}>
              <Image
                imageFit={ImageFit.contain}
                src="/img/logo-black.png"
                srcSet="/img/logo2x-black.png 2x, /img/logo3x-black.png 3x"
                alt="Logo"
                width={186}
                height={48}
                styles={{ root: { margin: '0 auto 60px auto' } }}
              />
              <Stack horizontalAlign="start" styles={{ root: { width: '100%' } }}>
                <Text styles={textTitleStyle} variant="xLarge">
                  Your Companies
                </Text>
                <CompanyList
                  companies={companies}
                  selectCompany={this._selectCompany}
                  onRefreshAllCompanies={() => this._getCompaniesOfUser()}
                />
              </Stack>
            </Stack>
            <Stack styles={footerStyles} verticalAlign="center">
              <CustomText color="textSecondary">©2004–2022 ePapyrus Inc. All Rights Reserved</CustomText>
              <CustomText color="textSecondary">support@epapyrus.com</CustomText>
            </Stack>
          </Stack.Item>
        </Stack>
        <Stack styles={logoSwitchStyles}>
          <Stack styles={imgPageStyles}>
            <div style={rightPageWrapper}>
              <div style={orangeBlock}>
                <p style={{ maxWidth: 120 }}>Share in seconds, Get in sights</p>
              </div>
              <div>
                <div style={{ backgroundColor: '#fe5700', width: '20vw', height: '34%' }} />
                <div style={{ flexGrow: 1, backgroundColor: '#00667d', width: '20vw', height: '66%' }} />
              </div>
            </div>
          </Stack>
        </Stack>
      </Stack>
    );
  }
}

Company.contextType = GlobalContext;
export default Company;
