import { Stack, Text, ThemeContext, TooltipDelay, TooltipHost } from '@fluentui/react';
import React, { useMemo } from 'react';
import { CustomButton, CustomText } from 'features/shared/components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { CURRENCY, PLAN_TYPE, SUBCRIPTION_PLAN_TIER } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const tierCardWrapper = (theme, isCurrentPlan) => ({
  root: {
    padding: 20,
    backgroundColor: theme.palette.white,
    height: '100%',
    minWidth: '290px',
    borderRadius: '6px',
    border: isCurrentPlan ? `1px solid ${theme.palette.themePrimary}` : undefined,
    [BREAKPOINTS_RESPONSIVE.lgDown]: {
      minWidth: '242px',
    },
  },
});
export default function PlanTierCard({
  name,
  seatPrice,
  features,
  subcription,
  id,
  discountValue,
  initialFee,
  isCurrentPlan,
  level,
  currentLevel,
}) {
  const history = useHistory();

  const _processPayment = (planId) => {
    let url = `/upgrade/plans/${planId}/${subcription}/purchase?type=${PLAN_TYPE.UPGRADE}&currency=${CURRENCY.USD}`;

    if (level < currentLevel) {
      url = `/downgrade/plan/${planId}/${subcription}`;
    }

    history.push(url);
  };

  const price = useMemo(() => {
    const priceToDiscount = initialFee || seatPrice;

    if (subcription === SUBCRIPTION_PLAN_TIER.YEARLY && discountValue > 0) {
      return parseFloat((priceToDiscount - (priceToDiscount * discountValue) / 100).toFixed(2));
    }
    return priceToDiscount;
  }, [discountValue, seatPrice, subcription, initialFee]);

  // this method will be remove when we have limited of tier plan feature
  const _repplacePrice = (description) => {
    if (description?.includes('@price')) {
      return description.replace(
        '@price',
        subcription === SUBCRIPTION_PLAN_TIER.YEARLY
          ? parseFloat((seatPrice * (1 - discountValue / 100)).toFixed(2))
          : seatPrice
      );
    }
    return description;
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => {
        return (
          <Stack styles={tierCardWrapper(theme, isCurrentPlan)} tokens={{ childrenGap: 28 }}>
            <Text
              styles={{ root: { padding: '0 16px', [BREAKPOINTS_RESPONSIVE.lgDown]: { padding: 0 } } }}
              variant="xxLarge"
            >
              {name}
            </Text>
            <TooltipHost content={`$${price} /month`} delay={TooltipDelay.zero}>
              <Stack
                styles={{ root: { padding: '0 16px', [BREAKPOINTS_RESPONSIVE.lgDown]: { padding: 0 } } }}
                horizontal
                verticalAlign="end"
              >
                <CustomText styles={{ root: { fontSize: 48 } }}>${price}</CustomText>
                <CustomText styles={{ root: { fontSize: 16, marginBottom: 10 } }} color="textSecondary">
                  /month
                </CustomText>
              </Stack>
            </TooltipHost>
            <Stack styles={{ root: { flexGrow: 1 } }}>
              {features?.map((feature, index) => {
                return (
                  <Stack
                    key={index}
                    styles={{
                      root: {
                        padding: '12px 16px',
                        borderBottom: index === features?.length - 1 ? '' : '1px solid #dadada',
                        [BREAKPOINTS_RESPONSIVE.lgDown]: { padding: '12px 0' },
                      },
                    }}
                  >
                    <CustomText color="neutralPrimary">{feature.name}</CustomText>
                    <CustomText styles={{ root: { fontSize: 13, marginTop: 6 } }} color="textSecondary">
                      {_repplacePrice(feature.desciption)}
                    </CustomText>
                  </Stack>
                );
              })}
            </Stack>
            {isCurrentPlan ? (
              <CustomText
                styles={{ root: { textAlign: 'center', fontWeight: 500 } }}
                style={{ marginTop: 0, marginBottom: 12 }}
                color="themePrimary"
              >
                Your Current Plan
              </CustomText>
            ) : (
              <CustomButton
                styles={{ root: { [BREAKPOINTS_RESPONSIVE.mdDown]: { height: 40 } } }}
                primary
                title="Select Plan"
                text="Select Plan"
                onClick={() => _processPayment(id)}
              />
            )}
          </Stack>
        );
      }}
    </ThemeContext.Consumer>
  );
}

PlanTierCard.propTypes = {
  name: PropTypes.string.isRequired,
  seatPrice: PropTypes.number.isRequired,
  features: PropTypes.oneOfType([PropTypes.array]).isRequired,
  subcription: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  discountValue: PropTypes.number,
  initialFee: PropTypes.number,
  isCurrentPlan: PropTypes.bool,
  level: PropTypes.number,
  currentLevel: PropTypes.number,
};

PlanTierCard.defaultProps = {
  discountValue: undefined,
  initialFee: undefined,
  isCurrentPlan: false,
  level: 0,
  currentLevel: 0,
};
