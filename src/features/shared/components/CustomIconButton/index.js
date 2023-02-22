import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton } from '@fluentui/react';

const btnStyles = {
  root: {
    height: 40,
    minWidth: 'auto',
    padding: '0 4px',
    border: 'none',
    backgroundColor: 'transparent',
  },
};
export default function CustomIconButton(props) {
  const { styles } = props;
  return (
    <DefaultButton
      {...props}
      styles={{
        ...btnStyles,
        ...styles,
        root: {
          ...btnStyles.root,
          ...(styles && styles.root),
        },
      }}
    />
  );
}
CustomIconButton.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object]),
};
CustomIconButton.defaultProps = {
  styles: undefined,
};
