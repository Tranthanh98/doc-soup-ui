import React, { Component } from 'react';

import PromotionLayout from 'features/shared/components/Layout/PromotionLayout';
import { Stack, Text } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import { CustomButton, CustomText } from 'features/shared/components';
import { CURRENCY, PLAN_TYPE } from 'core/constants/Const';
import Resource from 'core/constants/Resource';
import CompareDowngrade from './CompareDowngrade';

const styleWrapper = {
  root: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: LIGHT_THEME.palette.white,
    padding: 20,
  },
};

const buttonStyles = {
  root: {
    display: 'flex',
    marginBottom: 30,
    flexFlow: 'row nowrap',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      marginBottom: 20,
      flexFlow: 'column nowrap',
      alignItems: 'start',
    },
  },
};

export default class Downgrade extends Component {
  state = {
    company: {},
    currentPlan: {
      limits: [],
    },
    selectedPlan: {
      limits: [],
    },
    allLinks: 0,
  };

  async componentDidMount() {
    const { getToken } = this.context;

    const { match } = this.props;

    this._getAllLinks();

    const { data: accountInfo } = await this._getAccountInfo();

    const { data: company } = await this._getUserPlanTier(accountInfo.activeCompanyId);

    const response = await new RestService().setPath('/plan-tier').setToken(getToken()).get();

    const selectedPlan = response.data.find((i) => i.id === Number(match.params.id));
    const currentPlan = response.data.find((i) => i.id === company.planTier.id);

    this.setState({ company, selectedPlan, currentPlan });
  }

  _getAllLinks = () => {
    const { getToken } = this.context;

    new RestService()
      .setPath('/link/count-all-link-by-company')
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        this.setState({ allLinks: data });
      });
  };

  _getUserPlanTier = (companyId) => {
    const { getToken } = this.context;
    return new RestService().setPath(`/company/${companyId}`).setToken(getToken()).get();
  };

  _getAccountInfo = () => {
    const { getToken } = this.context;
    return new RestService().setPath(`/account`).setToken(getToken()).get();
  };

  _processPayment = () => {
    const { history, match } = this.props;

    const { id, subscriptionType } = match.params;

    const url = `/downgrade/plan/${id}/${subscriptionType}/purchase?type=${PLAN_TYPE.UPGRADE}&currency=${CURRENCY.USD}`;

    history.push(url);
  };

  render() {
    const { history } = this.props;
    const { company, selectedPlan, currentPlan, allLinks } = this.state;
    return (
      <PromotionLayout
        onPrevious={() => history.goBack()}
        title={`Would you like to downgrade ${company.name}?`}
        propsTitles={{
          styles: {
            root: {
              fontSize: 28,
              justifyContent: 'center',
              [BREAKPOINTS_RESPONSIVE.mdDown]: {
                fontSize: 20,
              },
            },
          },
        }}
      >
        <Stack horizontalAlign="center" verticalAlign="start" tokens={{ childrenGap: 60 }}>
          <Text styles={{ root: { width: '100%', textAlign: 'center' } }}>
            {Resource.WARNING_DOWNGRADE_PLAN.format(currentPlan.name, selectedPlan.name)}
          </Text>
          <Stack styles={styleWrapper}>
            <CompareDowngrade selectedPlan={selectedPlan} currentPlan={currentPlan} />
          </Stack>

          <CustomText color="red" style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>
            There are {allLinks} {allLinks > 1 ? 'links' : 'link'} that use premium features, which will be deactivated
            as soon as you downgrade.
          </CustomText>
          <Stack styles={buttonStyles}>
            <CustomButton
              styles={{
                root: {
                  marginRight: 12,
                  width: 215,
                  [BREAKPOINTS_RESPONSIVE.mdDown]: { marginRight: 0, marginBottom: 12, width: '100%', height: 40 },
                },
              }}
              onClick={() => history.push('/')}
            >
              No, I’ll keep my current plan.
            </CustomButton>
            <CustomButton
              onClick={this._processPayment}
              primary
              styles={{
                root: {
                  width: 215,
                  [BREAKPOINTS_RESPONSIVE.mdDown]: { marginBottom: 12, width: '100%', height: 40 },
                },
              }}
            >
              I’m sure, continue to downgrade.
            </CustomButton>
          </Stack>
        </Stack>
      </PromotionLayout>
    );
  }
}

Downgrade.contextType = GlobalContext;
