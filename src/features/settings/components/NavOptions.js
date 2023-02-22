import React from 'react';
import { Nav } from '@fluentui/react';

const navStyles = (props) => {
  const { isSelected, theme } = props;
  return {
    root: {
      width: 280,
      height: '100%',
    },
    compositeLink: {
      color: isSelected ? theme.palette.orangeLight : 'inherit',
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

export default function NavOptions(props) {
  return <Nav {...props} styles={navStyles} />;
}
