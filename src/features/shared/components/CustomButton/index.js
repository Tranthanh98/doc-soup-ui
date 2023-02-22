import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, FontSizes } from '@fluentui/react';

const largeButtonStyles = {
  root: {
    height: 44,
    padding: 16,
  },
  label: {
    fontSize: FontSizes.size16,
  },
  icon: {
    width: 28,
    fontWeight: 'bold',
  },
};
const mediumButtonStyles = {
  root: {
    height: 40,
    padding: 16,
  },
  label: {
    fontSize: FontSizes.size13,
  },
  icon: {
    width: 20,
    fontWeight: 'bold',
  },
};
const smallButtonStyles = {
  root: {
    height: 30,
    padding: '8px 16px',
  },
  label: {
    fontSize: FontSizes.size13,
  },
};

export default function CustomButton(props) {
  const { styles, primary, size } = props;

  let sizeStyles = styles;
  if (size === 'large') {
    sizeStyles = { ...largeButtonStyles, ...styles, root: { ...largeButtonStyles?.root, ...styles?.root } };
  }
  if (size === 'medium') {
    sizeStyles = { ...mediumButtonStyles, ...styles, root: { ...mediumButtonStyles?.root, ...styles?.root } };
  }
  if (size === 'small') {
    sizeStyles = { ...smallButtonStyles, ...styles, root: { ...smallButtonStyles?.root, ...styles?.root } };
  }

  if (primary) {
    return <PrimaryButton {...props} styles={sizeStyles} />;
  }

  return <DefaultButton {...props} styles={sizeStyles} />;
}
CustomButton.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object]),
  primary: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
};
CustomButton.defaultProps = {
  styles: undefined,
  primary: false,
  size: 'medium',
};
