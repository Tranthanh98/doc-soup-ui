import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, Icon, FontWeights, Image, ImageFit } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';

export default function DocumentNotAvailable(props) {
  const { linkCreator } = props;
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      tokens={{ childrenGap: 16 }}
      styles={{ root: { minHeight: 'calc(100vh - 70px)' } }}
    >
      <Image
        imageFit={ImageFit.contain}
        src="/img/logo-black.png"
        srcSet="/img/logo2x-black.png 2x, /img/logo3x-black.png 3x"
        alt="Doc-soup"
        styles={{
          root: {
            [BREAKPOINTS_RESPONSIVE.mdDown]: {
              display: 'none',
            },
          },
        }}
      />

      <Image
        imageFit={ImageFit.contain}
        style={{ maxHeight: '100%', paddingTop: 30 }}
        src="/img/pages/noDocument.png"
        srcSet="/img/pages/noDocument2x.png 2x, /img/pages/noDocument3x.png 3x"
        alt="No document"
        styles={{
          root: {
            [BREAKPOINTS_RESPONSIVE.mdDown]: {
              marginLeft: 40,
              marginRight: 40,
            },
          },
        }}
      />
      <Stack
        styles={{
          root: {
            fontSize: 42,
            paddingTop: 10,
            paddingBottom: 10,
            textAlign: 'center',
            fontWeight: 500,
            [BREAKPOINTS_RESPONSIVE.mdDown]: {
              fontSize: 32,
            },
          },
        }}
      >
        This document is not available
      </Stack>
      <Text
        block
        variant="xLarge"
        style={{ marginTop: 0, paddingBottom: 24 }}
        styles={{ root: { fontWeight: FontWeights.semilight } }}
      >
        For more information, contact:
      </Text>

      <Stack
        horizontal="center"
        verticalAlign="center"
        styles={{
          root: {
            minHeight: 80,
            minWidth: 220,
            marginTop: 50,
            paddingLeft: 20,
            paddingRight: 20,
            border: `1px solid ${LIGHT_THEME.palette.neutralQuaternaryAlt}`,
            background: LIGHT_THEME.palette.darkLight,
          },
        }}
        tokens={{ childrenGap: 8 }}
      >
        <Icon iconName="gray-profile-user" styles={{ root: { width: 32, minWidth: 40, height: 40 } }} />
        <Text style={{ color: LIGHT_THEME.palette.neutralSecondaryAlt }}>{linkCreator?.fullName}</Text>
      </Stack>
    </Stack>
  );
}

DocumentNotAvailable.propTypes = {
  linkCreator: PropTypes.oneOfType([PropTypes.object]),
};
DocumentNotAvailable.defaultProps = {
  linkCreator: {},
};
