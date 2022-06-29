import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, Nav, DefaultButton } from '@fluentui/react';
import { DARK_THEME, LIGHT_THEME } from 'core/constants/Theme';
import { HASH_TAG } from 'core/constants/Const';
import General from './General';
import Users from './Users';
import NDAManagement from './NDA';
import Watermark from './Watermark';

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
const linkStyles = { root: { height: '100%', width: '100%' } };
const navStyles = (props) => {
  const { isSelected, theme } = props;
  return {
    root: {
      width: '100%',
    },
    compositeLink: {
      color: isSelected ? theme.palette.orangeLight : 'inherit',
      border: 0,
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

const companySettings = [
  { key: 0, name: 'General', title: 'General', component: <General /> },
  { key: 1, name: 'Users', title: 'Users', component: <Users /> },
  { key: 2, name: 'NDA', title: 'NDA', component: <NDAManagement /> },
  { key: 3, name: 'Watermark', title: 'Watermarking', component: <Watermark /> },
];

export default function Company(props) {
  const [selectedKey, setSelectedKey] = useState();
  const { selectHashTag } = props;

  const _selectNavItem = (_key) => {
    if (_key === selectedKey) {
      setSelectedKey('');
    } else {
      setSelectedKey(_key);
    }
  };

  useEffect(() => {
    if (selectHashTag === HASH_TAG.USER_SETTING) {
      setSelectedKey(1);
    }
  }, []);

  return (
    <Stack>
      <Stack.Item>
        <Nav
          ariaLabel="Nav company"
          styles={navStyles}
          groups={[{ links: companySettings }]}
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
Company.propTypes = {
  selectHashTag: PropTypes.string,
};
Company.defaultProps = {
  selectHashTag: undefined,
};
