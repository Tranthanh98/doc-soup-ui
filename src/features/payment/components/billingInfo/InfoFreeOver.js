import { Image, ImageFit, Stack, Text } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { CustomButton } from 'features/shared/components';
import React from 'react';
import { useHistory } from 'react-router-dom';

const stylesWrapper = {
  root: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    padding: '16px 18px',
    background: LIGHT_THEME.palette.neutralLight,
    marginBottom: 36,
    maxWidth: '100%',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      flexFlow: 'column nowrap',
    },
  },
};

const featureTextStyles = {
  root: {
    fontSize: 13,
    marginBottom: 8,
  },
};

const textFeatureNameStyles = {
  root: {
    fontSize: 13,
    fontWeight: 500,
  },
};

export default function InfoFreeOver() {
  const history = useHistory();
  return (
    <Stack styles={stylesWrapper}>
      <Stack styles={{ root: { [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' } } }}>
        <Image
          style={{ paddingRight: 30 }}
          imageFit={ImageFit.contain}
          src="/img/billing-advanced-img.png"
          alt="upgrade advanced"
        />
      </Stack>
      <Stack styles={{ root: { flex: 1, paddingRight: 12, [BREAKPOINTS_RESPONSIVE.mdDown]: { marginBottom: 24 } } }}>
        <Text styles={{ root: { fontWeight: 500, marginBottom: 16 } }}>
          You can use it when you upgrade to the Advanced Plan
        </Text>
        <Text styles={featureTextStyles}>
          &#183;&nbsp;
          <Text styles={textFeatureNameStyles}>Data Room: &nbsp; </Text>A single link allows you to securely share and
          track business-critical documents.
        </Text>
        <Text styles={featureTextStyles}>
          &#183;&nbsp;
          <Text styles={textFeatureNameStyles}>Access restrictions: &nbsp; </Text>Allow or block access to content by
          domain or email.
        </Text>
        <Text styles={{ root: { fontSize: 13 } }}>
          &#183;&nbsp;
          <Text styles={textFeatureNameStyles}>Watermarking: &nbsp; </Text>Add custom text and images to your docs to
          prevent spills.
        </Text>
      </Stack>
      <Stack>
        <CustomButton
          styles={{ root: { height: 30, borderRadius: 2 }, label: { fontWeight: 400 } }}
          onClick={() => history.push(`/upgrade/plans`)}
          primary
        >
          See upgrade options
        </CustomButton>
      </Stack>
    </Stack>
  );
}
