import { Stack, Text } from '@fluentui/react';
import { MEMBER_USER } from 'core/constants/Const';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import RestService from 'features/shared/services/restService';
import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import BillingHistory from './BillingHistory';
import PlanInfo from './PlanInfo';

export default class BillingInfo extends Component {
  state = {
    planDetail: {},
    totalUsers: 1,
    isOwnerUser: false,
    companyInfo: {},
  };

  componentDidMount() {
    const { getToken } = this.context;

    new RestService()
      .setPath('/account')
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        this.setState({ isOwnerUser: data.member === MEMBER_USER.OWNER }, () => {
          const { isOwnerUser } = this.state;
          console.log('isOwner:', isOwnerUser);
          if (isOwnerUser) {
            this._getCompanyInfo(data.activeCompanyId);
          }
        });
      })
      .catch(() => {
        this.setState({ isOwnerUser: false });
      });
  }

  _getCompanyInfo = (activeCompanyId) => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/company/${activeCompanyId}`)
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        this.setState({
          planDetail: data?.planTier,
          totalUsers: data?.totalUsers,
          companyInfo: { ...data, planTier: undefined },
        });
      })
      .catch((err) => {
        restServiceHelper.handleError(err);
      });
  };

  render() {
    const { planDetail, totalUsers, isOwnerUser, companyInfo } = this.state;

    return (
      <Stack>
        {isOwnerUser ? (
          <>
            <Text variant="xLarge">Billing</Text>
            <Stack style={{ margin: '36px 0 48px' }}>
              <PlanInfo
                planDetail={planDetail}
                totalUsers={totalUsers}
                companyInfo={companyInfo}
                onRefreshCompany={() => this._getCompanyInfo(companyInfo.id)}
              />
              <BillingHistory totalUsers={totalUsers} />
            </Stack>
          </>
        ) : (
          <Stack
            horizontal
            horizontalAlign="center"
            verticalAlign="center"
            styles={{ root: { height: '85vh', width: '100%' } }}
          >
            <Text variant="xxLarge">You do not have a right privilege to perform this operation!</Text>
          </Stack>
        )}
      </Stack>
    );
  }
}

BillingInfo.contextType = GlobalContext;
