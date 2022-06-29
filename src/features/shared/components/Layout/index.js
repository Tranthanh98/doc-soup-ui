import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@fluentui/react';
import { LIGHT_THEME } from 'core/constants/Theme';

class Layout extends Component {
  render() {
    const { children } = this.props;
    const theme = createTheme(LIGHT_THEME);
    return (
      <ThemeProvider theme={theme} applyTo="body">
        {children}
      </ThemeProvider>
    );
  }
}
Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};
export default Layout;
