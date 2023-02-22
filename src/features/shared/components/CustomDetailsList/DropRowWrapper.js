import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@fluentui/react';

const getClassNames = makeStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.palette.neutralLight,
  },
}));

export default function DropRowWrapper(props) {
  const { isDropable, children, isOddRowStyle } = props;
  const classNames = getClassNames();
  return <div className={!isDropable && isOddRowStyle ? classNames.wrapper : undefined}>{children}</div>;
}
DropRowWrapper.propTypes = {
  isOddRowStyle: PropTypes.bool,
  isDropable: PropTypes.bool,
};
DropRowWrapper.defaultProps = {
  isOddRowStyle: false,
  isDropable: false,
};
