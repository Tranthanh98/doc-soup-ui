import { Stack } from '@fluentui/react';
import { STRING } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import Footer from './Footer';
import Header from './Header';

const stackContainerStyles = {
  root: {
    maxWidth: STRING.HEADER_MAX_WIDTH,
    height: `calc(100vh - ${STRING.HEADER_HEIGHT}px)`,
    margin: 'auto',
  },
};
const stackBodyStyles = {
  root: {
    width: '100%',
  },
};
const stackChildrenStyles = {
  root: {
    paddingTop: 48,
    paddingLeft: 15,
    paddingRight: 15,
    width: '100%',
    maxWidth: STRING.HEADER_MAX_WIDTH - 180, // -120 * 2 + 30 * 2,
    alignSelf: 'center',
    selectors: {
      [BREAKPOINTS_RESPONSIVE.lgUp]: {
        paddingLeft: 30,
        paddingRight: 30,
      },
    },
  },
};

class AppLayout extends Component {
  render() {
    const { children } = this.props;
    return (
      <>
        <Header headerMaxWidth={STRING.HEADER_MAX_WIDTH} headerHeight={STRING.HEADER_HEIGHT} />
        <div style={{ overflow: 'auto' }}>
          <Stack horizontal styles={stackContainerStyles}>
            <Stack grow verticalAlign="space-between" styles={stackBodyStyles}>
              <Stack grow styles={stackChildrenStyles}>
                {children}
              </Stack>
              <Stack.Item>
                <Footer />
              </Stack.Item>
            </Stack>
          </Stack>
        </div>
      </>
    );
  }
}
AppLayout.contextType = GlobalContext;

export default AppLayout;
