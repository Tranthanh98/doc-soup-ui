import React, { useContext, useEffect } from 'react';
import { Image, ImageFit, PrimaryButton, Stack, Text } from '@fluentui/react';
import { DARK_THEME } from 'core/constants/Theme';
import PromotionLayout from 'features/shared/components/Layout/PromotionLayout';
import { useHistory } from 'react-router-dom';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';

const completeTextStyles = { root: { fontSize: 36, fontWeight: 500, letterSpacing: -1.13 } };
const textContainerStyles = { root: { paddingTop: 60, textAlign: 'center' } };
const descriptionTextStyles = { root: { paddingTop: 28, fontSize: 14, fontWeight: 'normal' } };
const goHomeContainer = { root: { height: '100%', padding: '10px 16px' } };
const goHomeText = { root: { fontSize: 16, color: DARK_THEME.palette.neutralPrimary } };

export default function CheckoutSuccess() {
  const history = useHistory();

  const { getToken, setPlanFeatures } = useContext(GlobalContext);

  const _getPlanFeatures = () => {
    new RestService()
      .setPath('/plan-tier/current/features')
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        setPlanFeatures(data);
      });
  };

  useEffect(() => {
    _getPlanFeatures();
  }, []);

  return (
    <PromotionLayout title="" onPrevious={() => history.push('/')}>
      <Stack horizontalAlign="center" styles={{ root: { minHeight: 'calc(100vh - 196px)' } }} verticalAlign="center">
        <Image
          imageFit={ImageFit.contain}
          src="/img/artboard.png"
          srcSet="/img/artboard.png 2x, /img/artboard.png 3x"
          alt="Logo"
          width={180}
          height={202}
        />
        <Stack styles={textContainerStyles}>
          <Text styles={completeTextStyles}>Your order is complete!</Text>
          <Text styles={descriptionTextStyles}>You will be receiving a confirmation email with order details.</Text>
        </Stack>

        <Stack style={{ marginTop: 48 }}>
          <PrimaryButton styles={goHomeContainer} href="/">
            <Text styles={goHomeText}>Go to main page</Text>
          </PrimaryButton>
        </Stack>
      </Stack>
    </PromotionLayout>
  );
}
