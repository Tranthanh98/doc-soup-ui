import React, { useEffect, useContext } from 'react';
import { LoadingPage } from 'features/shared/components';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';

export default function Payment() {
  const context = useContext(GlobalContext);
  const params = new URLSearchParams(window.location.search);
  const paymentId = params.get('paymentId');
  const payerId = params.get('PayerID');
  const billingInfoId = params.get('billingInfoId');
  const executePayment = () => {
    const { getToken } = context;
    const request = {
      billingInfoId,
      paymentId,
      payerId,
    };
    new RestService()
      .setPath(`/payment/execute-payment`)
      .setToken(getToken())
      .post(request)
      .then((res) => {
        window.open(res.data, '_self');
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };
  useEffect(() => {
    executePayment();
  }, []);
  return <LoadingPage />;
}
