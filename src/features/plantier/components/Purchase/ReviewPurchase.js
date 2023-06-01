import { FontSizes, FontWeights, Stack, Text } from '@fluentui/react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LIGHT_THEME } from 'core/constants/Theme';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import PayItems from './PayItems';

const styleWrapper = {
  root: {
    width: 600,
    backgroundColor: LIGHT_THEME.palette.white,
    padding: 20,
  },
};
const titleTextStyle = {
  root: {
    fontSize: FontSizes.size20,
    color: LIGHT_THEME.palette.neutralPrimary,
    fontWeight: FontWeights.bold,
    margin: 16,
  },
};

export default function ReviewPurchase() {
  const { subscriptionType, id } = useParams();

  const context = useContext(GlobalContext);

  const { getToken } = context;

  const [planDetail, setPlanDetail] = useState({
    initialFee: 0,
    initialSeat: 0,
    seatPrice: 0,
  });

  const [totalUsers, setTotalUsers] = useState(1);
  const [companyId, setCompanyId] = useState(undefined);

  const _getPlanTierDetail = () => {
    new RestService()
      .setPath('/plan-tier')
      .setToken(getToken())
      .get()
      .then((res) => {
        const selectedPlan = res.data.find((i) => i.id === parseInt(id, 10));

        if (selectedPlan) {
          setPlanDetail(selectedPlan);
        }
      })
      .catch((err) => {
        restServiceHelper.handleError(err);
      });
  };

  const _getCompanyInfo = (activeCompanyId) => {
    const { getToken } = context;
    return new RestService()
      .setPath(`/company/${activeCompanyId}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        setTotalUsers(res.data.totalUsers);
      });
  };

  const _getAccountInfo = () => {
    const { getToken } = context;

    new RestService()
      .setPath(`/account`)
      .setToken(getToken())
      .get()
      .then((res) => {
        setCompanyId(res.data.activeCompanyId);
        _getCompanyInfo(res.data.activeCompanyId);
      });
  };

  useEffect(() => {
    _getPlanTierDetail();
    _getAccountInfo();
  }, [subscriptionType, id]);

  return (
    <Stack styles={styleWrapper}>
      <Text styles={titleTextStyle}>Complete Your Purchase</Text>
      <PayItems
        planDetail={planDetail}
        subscriptionType={subscriptionType}
        totalUsers={totalUsers}
        planId={id}
        companyId={companyId}
      />
    </Stack>
  );
}
