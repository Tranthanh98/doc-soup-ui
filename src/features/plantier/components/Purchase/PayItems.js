import { PrimaryButton, Separator, Stack, Text } from '@fluentui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { LIGHT_THEME } from 'core/constants/Theme';
import { CURRENCY, PAGE_PATHS, PAYPAL_STATUS, PLAN_TYPE, SUBCRIPTION_PLAN_TIER } from 'core/constants/Const';
import { CustomText, LoadingPage } from 'features/shared/components';
import RestService from 'features/shared/services/restService';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import GlobalContext from 'security/GlobalContext';
import restServiceHelper from 'features/shared/lib/restServiceHelper';

const detailTextStyle = {
  root: {
    fontSize: 14,
    color: LIGHT_THEME.palette.neutralSecondaryAlt,
  },
};

const TOTAL_MONTH = 12;
export default function PayItems(props) {
  const { planDetail, subscriptionType, planId, totalUsers, companyId } = props;

  const context = useContext(GlobalContext);
  const history = useHistory();

  const { getToken } = context;

  const totalPaidSeat = totalUsers - planDetail.initialSeat < 0 ? 0 : totalUsers - planDetail.initialSeat;

  const [currentPaypalSubscription, setCurrentSubscription] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const getCurrentSubscriptionStatus = () => {
    setLoading(true);
    new RestService()
      .setPath('/billing/current-paypal-subscription')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          setCurrentSubscription(res.data);
        }
      })
      .catch((err) => {
        restServiceHelper.handleError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getCurrentSubscriptionStatus();
  }, []);

  // price per user
  const price = useMemo(() => {
    if (subscriptionType === SUBCRIPTION_PLAN_TIER.YEARLY && planDetail?.yearlyDiscount > 0) {
      return parseFloat((planDetail.seatPrice - (planDetail.seatPrice * planDetail.yearlyDiscount) / 100).toFixed(2));
    }
    return planDetail.seatPrice;
  }, [subscriptionType, planDetail]);

  const totalPaid = useMemo(() => {
    if (subscriptionType === SUBCRIPTION_PLAN_TIER.YEARLY && planDetail?.yearlyDiscount > 0) {
      const priceAfterDiscount = planDetail.initialFee - (planDetail.initialFee * planDetail.yearlyDiscount) / 100;
      return (priceAfterDiscount + totalPaidSeat * price) * TOTAL_MONTH;
    }

    return planDetail.initialFee + planDetail.seatPrice * totalPaidSeat;
  }, [planDetail, totalPaidSeat, subscriptionType]);

  const subTotal = useMemo(() => {
    if (subscriptionType === SUBCRIPTION_PLAN_TIER.YEARLY) {
      return TOTAL_MONTH * (planDetail.initialFee + totalPaidSeat * planDetail.seatPrice);
    }

    return planDetail.initialFee + planDetail.seatPrice * totalPaidSeat;
  }, [planDetail, subscriptionType, totalPaidSeat]);

  const totalDiscountAnnual = useMemo(() => {
    const totalDiscount =
      ((100 - planDetail.yearlyDiscount || 0) / 100) *
      TOTAL_MONTH *
      (planDetail.initialFee + totalPaidSeat * planDetail.seatPrice);

    return TOTAL_MONTH * (planDetail.initialFee + totalPaidSeat * planDetail.seatPrice) - totalDiscount;
  }, [subscriptionType, planDetail.yearlyDiscount, planDetail, totalPaidSeat]);

  const _upgradeDowngradePlan = (subscriptionId, paypalPlanId) => {
    setLoading(true);
    const request = {
      planTierId: planId,
      subscriptionId,
      subscriptionType,
      paypalPlanId,
    };

    new RestService()
      .setPath('/payment/upgrade-downgrade')
      .setToken(getToken())
      .post(request)
      .then((res) => {
        if (res.data) {
          window.open(res.data, '_self');
        } else {
          history.push(`/${PAGE_PATHS.checkout}/success`);
        }
      })
      .catch((err) => {
        restServiceHelper.handleError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const paypalPlanId = useMemo(() => {
    let planId =
      subscriptionType === SUBCRIPTION_PLAN_TIER.YEARLY
        ? planDetail.yearlyPlanPaypalId
        : planDetail.monthlyPlanPaypalId;
    if (planDetail.initialSeat > 0 && totalUsers < planDetail.initialSeat) {
      planId =
        subscriptionType === SUBCRIPTION_PLAN_TIER.YEARLY
          ? planDetail.yearlyFixedPlanPaypalId
          : planDetail.monthlyFixedPlanPaypalId;
    }

    return planId;
  }, [subscriptionType, planDetail, totalUsers]);

  const isUseFixedPlan = planDetail.initialSeat > 0 && totalUsers < planDetail.initialSeat;

  const { REACT_APP_PAYPAL_CLIENT_ID } = process.env;

  const createSubscription = (data, actions) => {
    return actions.subscription.create({
      plan_id: paypalPlanId,
      quantity: !isUseFixedPlan ? totalUsers : null,
      custom_id: companyId,
    });
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Stack>
        <Stack
          horizontal
          horizontalAlign="space-between"
          styles={{ root: { margin: '10px 16px 20px' } }}
          tokens={{ childrenGap: 16 }}
        >
          <Text styles={detailTextStyle}>
            {`${planDetail.name} Plan - ${subscriptionType} ($${price} / ${
              subscriptionType === SUBCRIPTION_PLAN_TIER.MONTHLY ? 'month' : 'year'
            } x ${totalUsers} seat)`}
          </Text>
          <Text styles={detailTextStyle}>{`$${parseFloat(totalPaid.toFixed(2))}`}</Text>
        </Stack>
        <Stack horizontal horizontalAlign="space-between" styles={{ root: { margin: '8px 16px' } }}>
          <Text styles={{ root: { fontWeight: 500 } }}>Subtotal</Text>
          <Text styles={{ root: { fontWeight: 500 } }}>{`$${parseFloat(subTotal.toFixed(2))}`}</Text>
        </Stack>
      </Stack>
      <Separator horizontal />
      <Stack horizontal horizontalAlign="space-between" style={{ margin: '10px 16px 20px' }}>
        <Text variant="xxLarge" styles={{ root: { fontWeight: 500 } }}>
          Total
        </Text>
        <Text variant="xxLarge" styles={{ root: { fontWeight: 500 } }}>{`$${totalPaid}`}</Text>
      </Stack>
      <Stack horizontalAlign="end" styles={{ root: { padding: '0 16px' } }}>
        <Stack style={{ marginBottom: 36 }} horizontalAlign="end">
          <CustomText color="textSecondary">Billed {subscriptionType}</CustomText>
          {subscriptionType === SUBCRIPTION_PLAN_TIER.MONTHLY ? (
            <Stack.Item style={{ marginTop: 12 }}>
              <Link
                // eslint-disable-next-line max-len
                to={`/upgrade/plans/${planId}/${SUBCRIPTION_PLAN_TIER.YEARLY}/purchase?type=${PLAN_TYPE.UPGRADE}&currency=${CURRENCY.USD}`}
                style={{ color: LIGHT_THEME.palette.orangeLight, textDecoration: 'underline' }}
              >
                Save ${parseFloat(totalDiscountAnnual.toFixed(2))} / year with an annual plan
              </Link>
            </Stack.Item>
          ) : null}
        </Stack>

        {paypalPlanId &&
        (!currentPaypalSubscription || currentPaypalSubscription.paypalSubscriptionStatus !== PAYPAL_STATUS.ACTIVE) ? (
          <PayPalScriptProvider
            options={{ 'client-id': REACT_APP_PAYPAL_CLIENT_ID, vault: true, intent: 'subscription' }}
          >
            <PayPalButtons
              forceReRender={[paypalPlanId, totalUsers]}
              createSubscription={createSubscription}
              onApprove={() => {
                history.push(`/${PAGE_PATHS.checkout}/success`);
              }}
            />
          </PayPalScriptProvider>
        ) : null}

        {!paypalPlanId ||
        (currentPaypalSubscription && currentPaypalSubscription.paypalSubscriptionStatus === PAYPAL_STATUS.ACTIVE) ? (
          <PrimaryButton
            disabled={loading}
            onClick={() => _upgradeDowngradePlan(currentPaypalSubscription.id, paypalPlanId)}
            text="Complete"
          />
        ) : null}
      </Stack>
    </>
  );
}
PayItems.propTypes = {
  planDetail: PropTypes.oneOfType([PropTypes.object]).isRequired,
  subscriptionType: PropTypes.string.isRequired,
  planId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  totalUsers: PropTypes.number.isRequired,
  companyId: PropTypes.string.isRequired,
};
