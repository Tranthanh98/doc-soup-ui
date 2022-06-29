import { Stack, Toggle } from '@fluentui/react';
import { CustomText } from 'features/shared/components';
import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import { SUBCRIPTION_PLAN_TIER } from 'core/constants/Const';
import PromotionLayout from 'features/shared/components/Layout/PromotionLayout';
import Resource from 'core/constants/Resource';
import PlanTierCard from './components/PlanTierCard';
import mockUpLimitedFeatures from './configs/mockUpLimitedFeatures';
import {
  discountTagStyles,
  planTierCardStyles,
  planTierCardWrapper,
  plantiersStyles,
  yearlyOptionStyles,
} from './configs/styles';

const PLAN_TIER_LIMITED_TRIAL_LEVEL = 0;

export default class PlanTier extends Component {
  state = {
    isAnnual: true,
    planTiers: [],
    companyPlan: {},
    isCurrentSubscriptionTypeAnnual: true,
  };

  async componentDidMount() {
    const { getToken } = this.context;

    try {
      const { data: accountInfo } = await this._getAccountInfo();

      const { data: companyPlanTier } = await this._getUserPlanTier(accountInfo.activeCompanyId);

      const response = await new RestService().setPath('/plan-tier').setToken(getToken()).get();

      const indexLimitedTrial = response.data.findIndex((i) => i.level === PLAN_TIER_LIMITED_TRIAL_LEVEL);

      if (indexLimitedTrial !== -1 && companyPlanTier?.planTier?.level === PLAN_TIER_LIMITED_TRIAL_LEVEL) {
        response.data.splice(indexLimitedTrial, 1);
      }

      this.setState({
        companyPlan: companyPlanTier.planTier,
        isCurrentSubscriptionTypeAnnual: companyPlanTier?.currentSubscriptionType === SUBCRIPTION_PLAN_TIER.YEARLY,
        planTiers: mockUpLimitedFeatures(response.data),
      });
    } catch (e) {
      restServiceHelper.handleError(e);
    }
  }

  _onChangePlan = (value) => {
    this.setState({ isAnnual: value });
  };

  _getUserPlanTier = (companyId) => {
    const { getToken } = this.context;
    return new RestService().setPath(`/company/${companyId}`).setToken(getToken()).get();
  };

  _getAccountInfo = () => {
    const { getToken } = this.context;
    return new RestService().setPath(`/account`).setToken(getToken()).get();
  };

  _renderPromotion = () => {
    const { planTiers, isAnnual } = this.state;
    const { isMobile } = this.context;
    if (planTiers?.length > 0) {
      const discount = planTiers.filter((x) => x.level > 0)[0].yearlyDiscount;
      return (
        <Stack tokens={{ childrenGap: 16 }} horizontal horizontalAlign="center" verticalAlign="center">
          <CustomText styles={{ root: { fontWeight: 500 } }} color={isAnnual ? 'textSecondary' : 'orangeLight'}>
            Monthly
          </CustomText>
          <Toggle
            checked={isAnnual}
            styles={{ root: { marginBottom: 0 } }}
            onChange={(_, value) => this._onChangePlan(value)}
          />
          <Stack styles={yearlyOptionStyles}>
            <CustomText
              styles={{ root: { fontWeight: 500, marginRight: 8 } }}
              color={!isAnnual ? 'textSecondary' : 'orangeLight'}
            >
              Annual
            </CustomText>
            <Stack styles={discountTagStyles}>
              <CustomText color={!isAnnual ? 'textSecondary' : 'orangeLight'}>
                {isMobile ? `(${discount}% OFF)` : `${discount}% OFF`}
              </CustomText>
            </Stack>
          </Stack>
        </Stack>
      );
    }

    return null;
  };

  render() {
    const { isAnnual, planTiers, companyPlan, isCurrentSubscriptionTypeAnnual } = this.state;

    const { history } = this.props;

    return (
      <PromotionLayout onPrevious={() => history.goBack()} title={Resource.PLAN_TIER}>
        <Stack verticalAlign="center" tokens={{ childrenGap: 42 }} styles={plantiersStyles}>
          {this._renderPromotion()}

          <Stack styles={planTierCardWrapper}>
            {planTiers.map((plan, index) => {
              return (
                <Stack.Item key={index} styles={planTierCardStyles}>
                  <PlanTierCard
                    {...plan}
                    subcription={isAnnual ? SUBCRIPTION_PLAN_TIER.YEARLY : SUBCRIPTION_PLAN_TIER.MONTHLY}
                    discountValue={plan?.yearlyDiscount}
                    isCurrentPlan={companyPlan.id === plan.id && isCurrentSubscriptionTypeAnnual === isAnnual}
                    currentLevel={companyPlan.level}
                  />
                </Stack.Item>
              );
            })}
          </Stack>
        </Stack>
      </PromotionLayout>
    );
  }
}

PlanTier.contextType = GlobalContext;
