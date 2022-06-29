import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Stack, Nav, Text, FontWeights, Panel } from '@fluentui/react';
import { NAV_LINK_GROUP, STRING } from 'core/constants/Const';

const stackNavBarStyle = {
  root: {
    overflow: 'auto',
  },
};
const navStyles = (props, isDesktop, isMobile) => {
  const { theme } = props;
  return {
    root: {
      overflow: 'hidden',
    },
    groupContent: {
      marginBottom: 0,
    },
    navItems: {
      maxWidth: isMobile ? 400 : 'auto',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: isDesktop ? undefined : 'center',
      margin: 'auto',
    },
    compositeLink: {
      display: 'flex',
      padding: 0,
      marginBottom: isMobile ? 7 : 0,
      overflow: 'initial',
      height: isDesktop ? STRING.HEADER_HEIGHT : 50,
      lineHeight: 'auto',
      selectors: {
        '::after': { border: 0 },
        '&:hover': {
          color: theme.palette.themePrimary,
          i: {
            fill: theme.palette.themePrimary,
          },
        },
        a: {
          width: '100%',
          height: '100%',
          marginLeft: 15,
          marginRight: 15,
          paddingLeft: 10,
          paddingRight: 10,
          outline: 'none',
          overflow: 'hidden',
        },
        '.active-route': {
          fontWeight: FontWeights.semibold,
          color: theme.palette.orangeLight,
          borderBottom: `3px solid ${theme.palette.orangeLight}`,
        },
      },
    },
    chevronButton: {
      height: 56,
    },
  };
};
const linkNameStyles = {
  root: {
    color: 'inherit',
    fontWeight: 'inherit',
  },
};
const panelStyles = (props, isMobile) => ({
  commands: { margin: 0 },
  root: {
    top: STRING.HEADER_HEIGHT,
    left: 0,
    borderRadius: 0,
  },
  content: { padding: 0 },
  main: {
    minWidth: '100%',
    minHeight: 71,
    height: 'auto',
    maxHeight: isMobile ? 126 : 71,
    boxShadow: 0,
    borderBottom: `2px solid ${props.theme.palette.neutralQuaternaryAlt}`,
  },
  overlay: {
    backgroundColor: 'none',
  },
});

const navLinkGroups = [
  {
    links: NAV_LINK_GROUP,
  },
];
const renderNavLinkItem = ({ link }, onToggleNavbar) => (
  <NavLink
    to={link.to}
    onClick={() => onToggleNavbar && onToggleNavbar()}
    activeClassName="active-route"
    isActive={(match, location) => !!match || link.paths.includes(location.pathname)}
  >
    <Stack horizontal verticalAlign="center" styles={{ root: { height: '100%' } }}>
      <Text variant="mediumPlus" styles={linkNameStyles}>
        {link.name}
      </Text>
    </Stack>
  </NavLink>
);

export default function NavBar(props) {
  const { isMobile, isDesktop, isOpenNavBar, onToggleNavbar } = props;
  if (isDesktop) {
    return (
      <Stack.Item className="ms-hiddenMdDown" grow styles={stackNavBarStyle}>
        <Nav
          ariaLabel="main navigation"
          styles={(styleProps) => navStyles(styleProps, isDesktop, isMobile)}
          groups={navLinkGroups}
          linkAs={(linkItem) => renderNavLinkItem(linkItem)}
        />
      </Stack.Item>
    );
  }
  return (
    <Panel
      isLightDismiss
      hasCloseButton={false}
      isOpen={isOpenNavBar}
      closeButtonAriaLabel="Close"
      styles={(styleProps) => panelStyles(styleProps, isMobile)}
    >
      <Nav
        ariaLabel="main navigation"
        styles={(styleProps) => navStyles(styleProps, isDesktop, isMobile)}
        groups={navLinkGroups}
        linkAs={(linkItem) => renderNavLinkItem(linkItem, onToggleNavbar)}
      />
    </Panel>
  );
}
NavBar.propTypes = {
  isOpenNavBar: PropTypes.bool.isRequired,
  onToggleNavbar: PropTypes.func.isRequired,
  isDesktop: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
};
