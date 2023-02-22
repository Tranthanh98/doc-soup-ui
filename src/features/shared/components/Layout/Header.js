/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import {
  ThemeContext,
  FontWeights,
  Stack,
  Persona,
  PersonaSize,
  Image,
  ImageFit,
  IconButton,
  DirectionalHint,
  ContextualMenuItemType,
  PrimaryButton,
  Panel,
  TooltipHost,
  TooltipDelay,
} from '@fluentui/react';
import { MEMBER_USER, PAGE_PATHS, USER_ROLES, PLAN_TIER_LEVEL } from 'core/constants/Const';
import { LIGHT_THEME } from 'core/constants/Theme';
import { SearchBox } from 'features/search/components';
import eventBus from 'features/shared/lib/eventBus';
import domainEvents from 'features/shared/domainEvents';
import NavBar from './NavBar';

const headerGridStyles = (theme, headerHeight, isMobile) => ({
  root: {
    position: 'sticky',
    top: 0,
    zIndex: 7000,
    height: headerHeight,
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: isMobile ? '0 15px' : '0 30px',
    borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
    backgroundColor: theme.palette.white,
  },
});
const headerRowStyles = (headerMaxWidth) => ({ root: { width: '100%', height: '100%', maxWidth: headerMaxWidth } });
const menuButtonStyles = {
  root: { marginLeft: '24px !important' },
  icon: {
    width: 28,
    height: 28,
  },
};
const searchButtonStyles = (theme) => ({
  icon: { fill: theme.palette.neutralSecondaryAlt, width: 28, height: 28 },
  iconDisabled: { fill: theme.palette.neutralQuaternaryAlt, background: '#fff', border: 'none' },
  root: {
    marginRight: 16,
    height: 40,
    width: 40,
    borderRadius: 4,
    '&:hover': {
      backgroundColor: `${theme.palette.neutralLight} !important`,
    },
    selectors: {
      svg: {
        ':hover': {
          backgroundColor: theme.palette.neutralLight,
        },
      },
    },
  },
  rootHovered: {
    backgroundColor: `${theme.palette.neutralLight} !important`,
  },
});
const upgradeBtnStyles = {
  root: {
    height: '40px !important',
    marginRight: 21,
    borderRadius: 2,
    padding: '7px 7px 8px 5px',
  },
  rootHovered: {
    backgroundColor: LIGHT_THEME.palette.themeDarkAlt,
  },
  label: { fontSize: 14, fontWeight: 500 },
  icon: {
    width: 26,
    transform: 'rotate(180deg)',
  },
};

const searchPanelStyles = (theme, headerHeight) => ({
  root: {
    top: headerHeight,
    left: 0,
    borderRadius: 0,
  },
  main: {
    minWidth: '100%',
    borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
    boxShadow: 0,
    maxHeight: '152px',
    minHeight: 'auto',
  },
  header: {
    minWidth: '100%',
  },
  headerText: {
    textAlign: 'center',
    fontWeight: FontWeights.bold,
  },
  content: {
    margin: 0,
    padding: 0,
  },
  contentInner: {
    margin: 0,
  },
});
const dropdownMenuStyles = ({ theme }) => {
  return {
    container: { border: 'none', marginTop: 4 },
    list: { overflow: 'auto' },
    subComponentStyles: {
      callout: {
        root: {
          marginTop: 4,
          borderRadius: 4,
          boxShadow: '0 4px 32px 0 rgba(108, 108, 108, 0.12)',
          border: `solid 1.2px ${theme.palette.neutralQuaternaryAlt}`,
        },
      },
      menuItem: {
        root: { height: 30, lineHeight: 30 },
        icon: { display: 'none' },
        label: { ...theme.fonts.smallPlus, margin: 0 },
      },
    },
  };
};
const SCREEN_WIDTH_BREAKPOINT = 1152;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      isOpenNavBar: false,
      accountInfo: {},
      isOpenSearchBox: false,
    };
  }

  componentDidMount() {
    this._handleRefreshAccount();
    eventBus.subscribe(this, domainEvents.CHANGE_ACCOUNT_NAME_DOMAINEVENT, () => {
      this._handleRefreshAccount();
    });
  }

  componentWillUnmount() {
    eventBus.unsubscribe(this);
  }

  _onSubmitSearch = (keyword) => {
    const { history } = this.props;
    history.push(`/${PAGE_PATHS.search}?keyword=${keyword}`);
    this.setState({ isOpenSearchBox: false });
  };

  _getAccountInfo = () => {
    const { getToken } = this.context;
    const { accountInfo } = this.state;

    new RestService()
      .setPath(`/account`)
      .setToken(getToken())
      .get()
      .then((res) => {
        this.setState({ accountInfo: res.data }, () =>
          this._getCompanyPlanTier(accountInfo.activeCompanyId || res.data.activeCompanyId)
        );
      });
  };

  _getCompanyPlanTier = (activeCompanyId) => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/company/${activeCompanyId}`)
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        this.setState((state) => ({ accountInfo: { ...state.accountInfo, planTierLevel: data?.planTier.level } }));
      });
  };

  _toggleNavbar = () => {
    this.setState((state) => ({ isOpenNavBar: !state.isOpenNavBar }));
  };

  _toggleSearchBox = (e) => {
    e.preventDefault();
    this.setState((state) => ({ isOpenSearchBox: !state.isOpenSearchBox }));
  };

  async _handleRefreshAccount() {
    const { getUserInfo } = this.context;
    const userInfo = await getUserInfo();
    this.setState({ userInfo });
    this._getAccountInfo();
  }

  render() {
    const { userInfo, isOpenNavBar, isOpenSearchBox } = this.state;
    const { headerMaxWidth, headerHeight, history } = this.props;
    const { authContext, authenticated, isDesktop, isMobile } = this.context;
    const { accountInfo } = this.state;
    const listContextualMenu = authenticated
      ? [
          {
            key: 'username',
            text: userInfo.name,
          },
          {
            key: 'email',
            text: userInfo.email,
            disabled: true,
            itemProps: { styles: { root: { height: 12, marginBottom: 14 }, label: { fontSize: 12 } } },
          },
          { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
          {
            key: 'switchCompany',
            text: 'Switch Company',
            onClick: () => history.push(`/${PAGE_PATHS.company}`),
          },
          {
            key: 'team',
            text: 'Team',
            onClick: () => history.push(`/${PAGE_PATHS.team}`),
          },
          {
            key: 'settings',
            text: 'Settings',
            onClick: () => history.push(`/${PAGE_PATHS.settings}`),
          },
          {
            key: 'logout',
            text: 'Log out',
            onClick: () => authContext.logout(),
          },
        ]
      : [
          {
            key: 'login',
            text: 'Login',
            onClick: () => authContext.login(),
          },
        ];

    if (accountInfo.role === USER_ROLES.c_admin && accountInfo.member === MEMBER_USER.OWNER && authenticated) {
      listContextualMenu.splice(4, 0, {
        key: 'billing',
        text: 'Billing',
        onClick: () => history.push(`/${PAGE_PATHS.billing}`),
      });
      if (window.innerWidth < SCREEN_WIDTH_BREAKPOINT && accountInfo.planTierLevel === PLAN_TIER_LEVEL.LIMITED) {
        listContextualMenu.push({
          key: 'upgrade',
          text: 'Upgrade',
          iconProps: { iconName: 'double-chevron-up-svg' },
          onClick: () => history.push(`/${PAGE_PATHS.plans}`),
          styles: { upgradeBtnStyles },
          itemProps: { styles: { item: { padding: 10 } } },
          onRender: () => (
            <PrimaryButton
              iconProps={{ iconName: 'download-svg' }}
              text="Upgrade"
              ariaLabel="Upgrade"
              allowDisabledFocus
              styles={upgradeBtnStyles}
              onClick={() => history.push(`/${PAGE_PATHS.plans}`)}
            />
          ),
        });
      }
    }

    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <Stack horizontalAlign="center" verticalAlign="end" styles={headerGridStyles(theme, headerHeight, isMobile)}>
            <Stack
              dir="ltr"
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              styles={headerRowStyles(headerMaxWidth)}
            >
              <Stack grow disableShrink horizontal verticalAlign="center" tokens={{ childrenGap: theme.spacing.s1 }}>
                <Stack.Item grow={1}>
                  <Link to="/">
                    <Image
                      imageFit={ImageFit.contain}
                      src="/img/logo-black.svg"
                      alt="Logo"
                      width={120}
                      height={32}
                      styles={{ root: { marginRight: 16 } }}
                    />
                  </Link>
                </Stack.Item>
                {authenticated && (
                  <Stack.Item grow={2} disableShrink>
                    <NavBar
                      isMobile={isMobile}
                      isDesktop={isDesktop}
                      isOpenNavBar={isOpenNavBar}
                      onToggleNavbar={this._toggleNavbar}
                    />
                  </Stack.Item>
                )}
              </Stack>
              {authenticated && (
                <Stack grow horizontal horizontalAlign="end" verticalAlign="center" tokens={{ childrenGap: 8 }}>
                  <TooltipHost delay={TooltipDelay.zero} content="Search">
                    <IconButton
                      iconProps={{ iconName: 'search-svg' }}
                      styles={searchButtonStyles(theme)}
                      onClick={this._toggleSearchBox}
                    />
                  </TooltipHost>
                  {window.innerWidth >= SCREEN_WIDTH_BREAKPOINT &&
                  accountInfo.role === USER_ROLES.c_admin &&
                  accountInfo.member === MEMBER_USER.OWNER &&
                  accountInfo.planTierLevel === PLAN_TIER_LEVEL.LIMITED ? (
                    <PrimaryButton
                      iconProps={{ iconName: 'download-svg' }}
                      text="Upgrade"
                      ariaLabel="Upgrade"
                      className="ms-hiddenLgDown"
                      allowDisabledFocus
                      styles={upgradeBtnStyles}
                      onClick={() => history.push(`/${PAGE_PATHS.plans}`)}
                    />
                  ) : null}
                  <IconButton
                    text="Main menu"
                    menuProps={{
                      items: listContextualMenu,
                      isBeakVisible: false,
                      directionalHint: DirectionalHint.bottomRightEdge,
                      styles: dropdownMenuStyles,
                    }}
                    styles={{
                      root: { height: 'none' },
                      rootExpanded: { backgroundColor: 'transparent' },
                      rootPressed: { backgroundColor: 'transparent' },
                    }}
                    onRenderMenuIcon={() => undefined}
                    onRenderChildren={() => (
                      <Persona
                        hidePersonaDetails={!isDesktop}
                        name={userInfo.name}
                        size={PersonaSize.size40}
                        styles={{ details: { padding: '0 8px' } }}
                        initialsColor={theme.palette.greenLight}
                        text={userInfo.name}
                      />
                    )}
                  />
                  <IconButton
                    className="ms-hiddenXlUp"
                    iconProps={{ iconName: 'menu-svg' }}
                    title="Menu"
                    ariaLabel="Menu"
                    styles={menuButtonStyles}
                    onClick={this._toggleNavbar}
                  />
                </Stack>
              )}
            </Stack>
            <Panel
              isLightDismiss
              isOpen={isOpenSearchBox}
              // onDismiss={this._toggleSearchBox}
              onLightDismissClick={this._toggleSearchBox}
              hasCloseButton={false}
              closeButtonAriaLabel="Close"
              styles={searchPanelStyles(theme, headerHeight)}
            >
              <SearchBox submit={this._onSubmitSearch} />
            </Panel>
          </Stack>
        )}
      </ThemeContext.Consumer>
    );
  }
}
Header.propTypes = {
  headerHeight: PropTypes.number.isRequired,
  headerMaxWidth: PropTypes.number.isRequired,
};
Header.contextType = GlobalContext;
export default withRouter(Header);
