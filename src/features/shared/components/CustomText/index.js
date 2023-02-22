import React from 'react';
import PropTypes from 'prop-types';
import { ThemeContext, Text } from '@fluentui/react';

export default function CustomText(props) {
  const { children, styles, color } = props;

  const _getTextColor = (theme) => {
    if (color === 'textSecondary') {
      return theme.palette.neutralSecondaryAlt;
    }
    if (color === 'textSecondaryAlt') {
      return theme.palette.neutralQuaternaryAlt;
    }
    if (color === 'textDanger') {
      return theme.palette.red;
    }
    if (color === 'textSuccess') {
      return theme.palette.green;
    }
    return theme.palette[color];
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Text
          {...props}
          styles={{
            ...styles,
            root: {
              color: _getTextColor(theme),
              overflow: 'hidden',
              ...(styles && styles.root),
            },
          }}
        >
          {children}
        </Text>
      )}
    </ThemeContext.Consumer>
  );
}
CustomText.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object]),
  color: PropTypes.string,
};
CustomText.defaultProps = {
  styles: undefined,
  color: undefined,
};
