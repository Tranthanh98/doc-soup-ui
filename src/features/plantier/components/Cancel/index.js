import React, { Component } from 'react';
import PromotionLayout from 'features/shared/components/Layout/PromotionLayout';
import { withRouter } from 'react-router-dom';
import { Stack, Text } from '@fluentui/react';
import { MEMBER_USER, PAGE_PATHS, SUBCRIPTION_PLAN_TIER } from 'core/constants/Const';
import { planTierCardStyles, planTierCardWrapper, plantiersStyles } from 'features/plantier/configs/styles';
import RestService from 'features/shared/services/restService';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import mockUpLimitedFeatures from 'features/plantier/configs/mockUpLimitedFeatures';
import GlobalContext from 'security/GlobalContext';
import { CustomButton } from 'features/shared/components';
import { LIGHT_THEME } from 'core/constants/Theme';
import Resource from 'core/constants/Resource';
import PlanTierCard from '../PlanTierCard';

const PLAN_TIER_LIMITED_TRIAL_LEVEL = 0;

class CancelPlan extends Component {
  state = {
    planTiers: [],
    accountInfo: {},
    company: {
      planTier: {},
      currentSubscriptionType: SUBCRIPTION_PLAN_TIER.MONTHLY,
      totalLinks: 0,
      totalVisits: 0,
    },
    limitedPlan: {},
    subscription: undefined,
    isOwnerUser: false,
  };

  componentDidMount() {
    this._getCurrentSubscriptionStatus();
  }

  _getDataAndPlanTier = async () => {
    const { getToken } = this.context;

    try {
      const { data: accountInfo } = await this._getAccountInfo();

      const { data: companyPlanTier } = await this._getUserPlanTier(accountInfo.activeCompanyId);

      const response = await new RestService().setPath('/plan-tier').setToken(getToken()).get();

      const indexLimitedTrial = response.data.findIndex((i) => i.level === PLAN_TIER_LIMITED_TRIAL_LEVEL);

      let limitedPlan;

      if (indexLimitedTrial !== -1) {
        limitedPlan = response.data[indexLimitedTrial];
        response.data.splice(indexLimitedTrial, 1);
      }

      this.setState({
        company: companyPlanTier,
        planTiers: mockUpLimitedFeatures(response.data),
        accountInfo,
        limitedPlan,
        isOwnerUser: accountInfo.member === MEMBER_USER.OWNER,
      });
    } catch (e) {
      restServiceHelper.handleError(e);
    }
  };

  _getUserPlanTier = (companyId) => {
    const { getToken } = this.context;
    return new RestService().setPath(`/company/${companyId}`).setToken(getToken()).get();
  };

  _getAccountInfo = () => {
    const { getToken } = this.context;
    return new RestService().setPath(`/account`).setToken(getToken()).get();
  };

  _renderTitle = () => {
    return (
      <Text styles={{ root: { textAlign: 'center' } }}>
        You can downgrade your payment plan to keep the link active and continue to use DocSoup at a reasonable price.
      </Text>
    );
  };

  _getCurrentSubscriptionStatus = () => {
    const { getToken } = this.context;
    const { history } = this.props;

    new RestService()
      .setPath('/billing/current-paypal-subscription')
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        if (data) {
          this.setState({ subscription: data }, this._getDataAndPlanTier);
        } else {
          history.push('/');
        }
      })
      .catch(() => {
        history.push('/');
      });
  };

  _handleCancelPlan = async () => {
    const { limitedPlan, company, subscription } = this.state;
    const { getToken } = this.context;
    const { history } = this.props;

    const request = {
      planTierId: limitedPlan.id,
      subscriptionId: subscription?.id,
      subscriptionType: company.currentSubscriptionType,
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
      });
  };

  render() {
    const { history } = this.props;

    const { planTiers, company, accountInfo, isOwnerUser } = this.state;

    const companyPlan = company.planTier;

    return (
      <PromotionLayout
        onPrevious={() => history.goBack()}
        // eslint-disable-next-line max-len
        title={
          isOwnerUser
            ? Resource.NOTICE_CANCEL_PLAN.format(
                accountInfo.firstName,
                company.totalLinks || 0,
                company.totalVisits || 0
              )
            : 'You do not have a right privilege to perform this operation!'
        }
        propsTitles={{
          style: {
            fontSize: 28,
          },
        }}
      >
        {isOwnerUser && (
          <Stack verticalAlign="center" tokens={{ childrenGap: 42 }} styles={plantiersStyles}>
            {this._renderTitle()}

            <Stack styles={planTierCardWrapper}>
              {planTiers.map((plan, index) => {
                return (
                  <Stack.Item key={index} styles={planTierCardStyles}>
                    <PlanTierCard
                      {...plan}
                      subcription={company.currentSubscriptionType}
                      discountValue={plan?.yearlyDiscount}
                      isCurrentPlan={companyPlan.id === plan.id}
                      currentLevel={companyPlan.level}
                    />
                  </Stack.Item>
                );
              })}
            </Stack>
            <Stack horizontal horizontalAlign="center" verticalAlign="center">
              <Stack>
                <Text styles={{ root: { textAlign: 'center', marginBottom: 12 } }}>
                  No thanks, I don’t need DocSoup anymore
                </Text>
                <CustomButton
                  styles={{ root: { backgroundColor: LIGHT_THEME.palette.red, color: LIGHT_THEME.palette.white } }}
                  size="large"
                  onClick={this._handleCancelPlan}
                >
                  Continue cancelling my plan
                </CustomButton>
              </Stack>
            </Stack>
          </Stack>
        )}
      </PromotionLayout>
    );
  }
}

CancelPlan.contextType = GlobalContext;
export default withRouter(CancelPlan);
