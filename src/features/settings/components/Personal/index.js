import React, { useState } from 'react';
import { Stack, Nav, DefaultButton } from '@fluentui/react';
import { DARK_THEME, LIGHT_THEME } from 'core/constants/Theme';
import ChangePassword from './ChangePassword';
import Account from './Account';
import Notifications from './Notifications';

const navLinkStyles = (selectedKey, _key) => {
  return {
    root: {
      width: '100%',
      height: '50px !important',
      border: 0,
      color: `${LIGHT_THEME.palette.neutralPrimary}`,
      borderBottom: `1px solid ${DARK_THEME.palette.neutralPrimaryAlt}`,
      '&:active': {
        paddingRight: 0,
      },
    },
    flexContainer: {
      '&:hover': {
        color: `${LIGHT_THEME.palette.themePrimary}`,
      },
    },
    label: {
      display: 'flex',
      paddingLeft: 10,
      fontSize: 14,
      justifyContent: 'flex-start',
    },
    icon: {
      position: 'absolute',
      right: 20,
      width: 12,
      height: 8,
      top: 12,
      '&:nth-child(1)': {
        fill: parseInt(selectedKey, 10) === _key ? `${LIGHT_THEME.palette.themePrimary}` : '',
      },
    },
  };
};

const navStyles = (props) => {
  const { isSelected, theme } = props;
  return {
    root: {
      width: '100%',
    },
    compositeLink: {
      color: isSelected ? theme.palette.orangeLight : 'inherit',
      border: 0,
      selectors: {
        '&:hover': {
          color: theme.palette.orangeLight,
        },
      },
    },
    link: {
      background: isSelected ? 'transparent' : 'inherit',
      color: isSelected ? theme.palette.orangeLight : 'inherit',
      selectors: {
        '&::after': {
          border: 0,
        },
      },
    },
  };
};

const linkStyles = { root: { height: '100%', width: '100%' } };

const personalSettings = [
  {
    key: 0,
    name: 'Account',
    title: 'Account',
    component: <Account />,
  },
  {
    key: 1,
    name: 'Password',
    title: 'Password',
    component: <ChangePassword />,
  },
  {
    key: 2,
    name: 'Notifications',
    title: 'Notifications',
    component: <Notifications />,
  },
];
export default function Personal() {
  const [selectedKey, setSelectedKey] = useState();

  const _selectNavItem = (_key) => {
    if (_key === selectedKey) {
      setSelectedKey('');
    } else {
      setSelectedKey(_key);
    }
  };

  return (
    <Stack>
      <Stack.Item>
        <Nav
          ariaLabel="Nav personal"
          styles={navStyles}
          groups={[{ links: personalSettings }]}
          linkAs={(item) => {
            return (
              <Stack styles={linkStyles}>
                <DefaultButton
                  styles={navLinkStyles(selectedKey, item.link.key)}
                  text={`${item.link.name}`}
                  iconProps={{
                    iconName: selectedKey === item.link.key ? 'chevron-up-svg' : 'chevron-down-svg',
                  }}
                  onClick={() => _selectNavItem(item.link.key)}
                />
                {selectedKey === item.link.key ? (
                  <Stack.Item
                    styles={{
                      root: {
                        width: '100%',
                        borderBottom: `1px solid ${DARK_THEME.palette.neutralPrimaryAlt}`,
                      },
                    }}
                  >
                    {item.link.component}
                  </Stack.Item>
                ) : (
                  <></>
                )}
              </Stack>
            );
          }}
        />
      </Stack.Item>
    </Stack>
  );
}
