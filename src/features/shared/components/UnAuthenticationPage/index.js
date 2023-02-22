import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme, Stack, Image, ImageFit, Text, PrimaryButton } from '@fluentui/react';
import { LIGHT_THEME } from 'core/constants/Theme';

export default function UnAuthenticationPage(props) {
  const theme = createTheme(LIGHT_THEME);
  const { onBtnClick } = props;
  return (
    <ThemeProvider theme={theme}>
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        tokens={{ childrenGap: 16 }}
        styles={{ root: { height: '100vh' } }}
      >
        <Image
          imageFit={ImageFit.contain}
          src="/img/logo-black.png"
          srcSet="/img/logo2x-black.png 2x, /img/logo3x-black.png 3x"
          alt="unauthorized"
          width={200}
          height={52}
          styles={{ root: { marginBottom: 16 } }}
        />
        <Text block variant="mediumPlus">
          Your session were expired!
        </Text>
        <PrimaryButton text="Click to refresh" title="Click to refresh" onClick={onBtnClick} />
      </Stack>
    </ThemeProvider>
  );
}
UnAuthenticationPage.propTypes = {
  onBtnClick: PropTypes.func.isRequired,
};
