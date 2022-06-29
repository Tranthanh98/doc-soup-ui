/* eslint-disable max-lines */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { Stack, Text, ThemeProvider } from '@fluentui/react';
import PropTypes from 'prop-types';
import { BUTTON_DARK_THEME, LIGHT_THEME } from 'core/constants/Theme';
import { CustomButton } from 'features/shared/components';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MODAL_NAME, PAYMENT_METHOD, SUBCRIPTION_PLAN_TIER, TIME_FORMAT } from 'core/constants/Const';
import GlobalContext from 'security/GlobalContext';
import dayjs from 'dayjs';
import RestService from 'features/shared/services/restService';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import AddBillingContactModal from '../AddBillingContactModal';
import InvoiceBillingInfoModal from '../InvoiceBillingInfoModal';
import InfoFreeOver from './InfoFreeOver';

const titleStyles = { root: { color: LIGHT_THEME.palette.neutralSecondaryAlt, width: 120 } };
const valueStyles = {
  root: {
    fontWeight: 500,
    width: 206,
    paddingLeft: 28,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
const billingTitleStyles = {
  root: { color: LIGHT_THEME.palette.neutralSecondaryAlt, width: 150 },
};
const billingBtnStyles = {
  root: { height: 30, marginTop: -5, borderRadius: 2, padding: '0 16px' },
  label: { fontWeight: 500 },
};
const billingContainerStyles = {
  root: {
    borderLeft: '1px solid',
    borderLeftColor: LIGHT_THEME.palette.neutralQuaternaryAlt,
    width: 370,
    padding: '0 18px',
    float: 'right',
  },
};
const switchBillingStyles = {
  color: LIGHT_THEME.palette.orangeLight,
  textDecoration: 'underline',
  paddingLeft: 14,
  fontSize: 13,
  letterSpacing: -0.5,
};

const editTextStyles = {
  root: {
    cursor: 'pointer',
    width: 120,
    paddingLeft: 28,
    textDecoration: 'underline',
    color: LIGHT_THEME.palette.red,
    '&:hover': {
      color: LIGHT_THEME.palette.themePrimary,
    },
  },
};

const TOTAL_MONTH = 12;

const PLAN_TIER_LIMITED_TRIAL_LEVEL = 0;

class PlanInfo extends Component {
  state = {
    currentSubscription: undefined,
    paypalSubscription: undefined,
    modalName: undefined,
  };

  componentDidMount() {
    this._getCurrentSubscription();
  }

  _onChangePlanTier = () => {
    const { history, planDetail } = this.props;

    let url = `/upgrade/plans`;

    if (planDetail?.level !== 0) {
      url = '/cancel/plan';
    }

    history.push(url);
  };

  _getCurrentSubscription = () => {
    const { getToken } = this.context;

    new RestService()
      .setPath('/payment/subscription/current')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          this.setState({ currentSubscription: res.data });
          if (res.data.paypalSubscriptionPayload) {
            const paypalSubscription = JSON.parse(res.data.paypalSubscriptionPayload);
            this.setState({ paypalSubscription });
          }
        }
      })
      .catch((err) => {
        restServiceHelper.handleError(err);
      });
  };

  _addBillingContact = () => {
    this.setState({ modalName: MODAL_NAME.ADD_BILLING_CONTACT });
  };

  _addBillingInfo = () => {
    this.setState({ modalName: MODAL_NAME.INVOICE_BILLING_INFO });
  };

  _getDiscount = () => {
    const { planDetail, totalUsers } = this.props;

    const totalPaidSeat = totalUsers - planDetail.initialSeat < 0 ? 0 : totalUsers - planDetail.initialSeat;

    const totalDiscount =
      ((100 - planDetail.yearlyDiscount) / 100) *
      TOTAL_MONTH *
      (planDetail.initialFee + totalPaidSeat * planDetail.seatPrice);

    return parseFloat(
      (TOTAL_MONTH * (planDetail.initialFee + totalPaidSeat * planDetail.seatPrice) - totalDiscount).toFixed(2)
    );
  };

  render() {
    const { planDetail, companyInfo, onRefreshCompany } = this.props;
    const { currentSubscription, paypalSubscription, modalName } = this.state;

    const {
      billingInfoCity,
      billingInfoName,
      billingInfoState,
      billingInfoStreet,
      billingInfoTaxId,
      billingInfoZipCode,
    } = companyInfo;

    const billingAddress = [billingInfoCity, billingInfoState, billingInfoZipCode];

    return (
      <>
        {planDetail.level === PLAN_TIER_LIMITED_TRIAL_LEVEL ? <InfoFreeOver /> : null}
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 500, marginBottom: 16 } }}>
          Plan Information
        </Text>
        <Stack
          className="hiddenMdDown"
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          styles={{ root: { padding: '23px 18px', backgroundColor: LIGHT_THEME.palette.neutralLight } }}
        >
          <Stack>
            <Stack horizontal verticalAlign="center">
              <Text>Your company in on the</Text>
              <Text style={{ margin: '0 4px', fontWeight: 500 }}>{planDetail?.name}</Text>
              <Text>plan</Text>
            </Stack>
          </Stack>

          <ThemeProvider theme={BUTTON_DARK_THEME}>
            <CustomButton
              styles={{ root: { height: 30, width: 120, borderRadius: 2 }, label: { fontWeight: 400 } }}
              color={LIGHT_THEME.palette.white}
              primary
              size="small"
              text="Change plan"
              title="Change plan"
              onClick={this._onChangePlanTier}
            />
          </ThemeProvider>
        </Stack>

        <Stack
          className="hiddenLgUp"
          horizontalAlign="center"
          verticalAlign="center"
          styles={{ root: { padding: '23px 18px', backgroundColor: LIGHT_THEME.palette.neutralLight } }}
        >
          <Stack horizontal verticalAlign="center">
            <Text>Your company in on the</Text>
            <Text style={{ margin: '0 4px', fontWeight: 500 }}>{planDetail?.name}</Text>
            <Text>plan</Text>
          </Stack>

          <ThemeProvider style={{ width: 120, marginTop: 12 }} theme={BUTTON_DARK_THEME}>
            <CustomButton
              styles={{ root: { height: 30, width: 120 }, label: { fontWeight: 400 } }}
              color={LIGHT_THEME.palette.white}
              primary
              size="small"
              text="Change plan"
              title="Change plan"
              onClick={this._onChangePlanTier}
            />
          </ThemeProvider>
        </Stack>

        <Stack horizontal style={{ padding: '28px 18px', width: '100%' }}>
          <Stack style={{ flexGrow: 1 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Stack horizontal>
                <Text styles={titleStyles}>Billing Cycle </Text>
                <Stack>
                  <Text styles={valueStyles} style={{ paddingLeft: 28 }}>
                    {currentSubscription?.subType}
                  </Text>
                  {currentSubscription?.subType === SUBCRIPTION_PLAN_TIER.MONTHLY ? (
                    <Link
                      className="hiddenLgUp"
                      to={`/upgrade/plans/${planDetail.id}/Yearly/purchase?type=UPGRADE&currency=USD`}
                      style={{ ...switchBillingStyles, paddingLeft: 28, paddingTop: 12 }}
                    >
                      <Text styles={{ root: { color: 'inherit', width: '100%' } }}> Switch to annual billing</Text>
                    </Link>
                  ) : null}
                </Stack>
              </Stack>
              {currentSubscription?.subType === SUBCRIPTION_PLAN_TIER.MONTHLY ? (
                <Link
                  className="hiddenMdDown"
                  to={`/upgrade/plans/${planDetail.id}/Yearly/purchase?type=UPGRADE&currency=USD`}
                  style={switchBillingStyles}
                >
                  <Text styles={{ root: { color: 'inherit' } }}>
                    Switch to annual billing and save ${this._getDiscount()} / year
                  </Text>
                </Link>
              ) : null}
            </Stack>
            <Stack horizontal style={{ marginTop: 24 }}>
              <Text styles={titleStyles}>Next billing date </Text>
              <Text styles={valueStyles}>
                {dayjs(paypalSubscription?.billing_info?.next_billing_time).format(TIME_FORMAT.YEAR_MONTH_DAY_SLASH)}
              </Text>
            </Stack>
            <Stack horizontal style={{ marginTop: 24 }}>
              <Text styles={titleStyles}>Payment method </Text>

              <Stack>
                <Text styles={valueStyles}>{PAYMENT_METHOD.PAYPAL}</Text>
                <Text
                  onClick={() => this._onChangePlanTier()}
                  styles={{
                    root: {
                      color: LIGHT_THEME.palette.red,
                      textDecoration: 'underline',
                      paddingLeft: 28,
                      paddingTop: 28,
                      cursor: 'pointer',
                    },
                  }}
                >
                  {planDetail?.level === 0 ? 'Upgrade plan' : 'Cancel plan'}
                </Text>
              </Stack>
            </Stack>
            <Stack className="hiddenXlUp">
              <Stack horizontal style={{ marginTop: 24 }}>
                <Text styles={billingTitleStyles}>Billing contact email</Text>
                {companyInfo?.billingContact ? (
                  <Stack tokens={{ childrenGap: 6 }}>
                    <Text styles={valueStyles} style={{ paddingLeft: 0 }}>
                      {companyInfo.billingContact}
                    </Text>
                    <Text styles={editTextStyles} style={{ paddingLeft: 0 }} onClick={this._addBillingContact}>
                      Edit
                    </Text>
                  </Stack>
                ) : (
                  <CustomButton
                    styles={billingBtnStyles}
                    color={LIGHT_THEME.palette.neutralSecondaryAlt}
                    size="small"
                    text="Add billing contact"
                    title="Add billing contact"
                    onClick={this._addBillingContact}
                  />
                )}
              </Stack>
              <Stack horizontal style={{ marginTop: 24 }}>
                <Text styles={billingTitleStyles}>Invoice billing info</Text>
                {companyInfo?.billingInfoName ? (
                  <Stack tokens={{ childrenGap: 6 }}>
                    <Text styles={valueStyles} style={{ paddingLeft: 0 }}>
                      {billingInfoName}
                    </Text>
                    {billingInfoStreet && (
                      <Text styles={valueStyles} style={{ paddingLeft: 0 }}>
                        {billingInfoStreet}
                      </Text>
                    )}
                    {billingAddress?.length > 0 && (
                      <Text styles={valueStyles} style={{ paddingLeft: 0 }}>
                        {billingAddress.filter((i) => i).join(', ')}{' '}
                      </Text>
                    )}
                    {billingInfoTaxId && (
                      <Text styles={valueStyles} style={{ paddingLeft: 0 }}>
                        {billingInfoTaxId}
                      </Text>
                    )}
                    <Text styles={editTextStyles} onClick={this._addBillingInfo} style={{ paddingLeft: 0 }}>
                      Edit
                    </Text>
                  </Stack>
                ) : (
                  <CustomButton
                    styles={billingBtnStyles}
                    color={LIGHT_THEME.palette.neutralSecondaryAlt}
                    size="small"
                    text="Add billing info"
                    title="Add billing info"
                    onClick={this._addBillingInfo}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
          <Stack className="hiddenLgDown" styles={billingContainerStyles} style={{ marginLeft: 20 }}>
            <Stack horizontal>
              <Text styles={billingTitleStyles}>Billing contact email</Text>
              {companyInfo?.billingContact ? (
                <Stack tokens={{ childrenGap: 6 }}>
                  <Text styles={valueStyles}>{companyInfo.billingContact}</Text>
                  <Text styles={editTextStyles} onClick={this._addBillingContact}>
                    Edit
                  </Text>
                </Stack>
              ) : (
                <CustomButton
                  styles={billingBtnStyles}
                  color={LIGHT_THEME.palette.neutralSecondaryAlt}
                  size="small"
                  text="Add billing contact"
                  title="Add billing contact"
                  onClick={this._addBillingContact}
                />
              )}
            </Stack>
            <Stack horizontal style={{ marginTop: 24 }}>
              <Text styles={billingTitleStyles}>Invoice billing info</Text>
              {companyInfo?.billingInfoName ? (
                <Stack tokens={{ childrenGap: 6 }}>
                  <Text styles={valueStyles}>{billingInfoName}</Text>
                  {billingInfoStreet && <Text styles={valueStyles}>{billingInfoStreet}</Text>}
                  {billingAddress?.length > 0 && (
                    <Text styles={valueStyles}>{billingAddress.filter((i) => i).join(', ')} </Text>
                  )}
                  {billingInfoTaxId && <Text styles={valueStyles}>{billingInfoTaxId}</Text>}
                  <Text styles={editTextStyles} onClick={this._addBillingInfo}>
                    Edit
                  </Text>
                </Stack>
              ) : (
                <CustomButton
                  styles={billingBtnStyles}
                  color={LIGHT_THEME.palette.neutralSecondaryAlt}
                  size="small"
                  text="Add billing info"
                  title="Add billing info"
                  onClick={this._addBillingInfo}
                />
              )}
            </Stack>
          </Stack>
          <AddBillingContactModal
            isOpen={modalName === MODAL_NAME.ADD_BILLING_CONTACT}
            onToggle={() => this.setState({ modalName: undefined })}
            onRefresh={onRefreshCompany}
            billingContactEmail={companyInfo.billingContact}
          />
          <InvoiceBillingInfoModal
            isOpen={modalName === MODAL_NAME.INVOICE_BILLING_INFO}
            onToggle={() => this.setState({ modalName: undefined })}
            onRefresh={onRefreshCompany}
            {...companyInfo}
          />
        </Stack>
      </>
    );
  }
}

PlanInfo.propTypes = {
  planDetail: PropTypes.oneOfType([PropTypes.object]),
  totalUsers: PropTypes.number.isRequired,
  companyInfo: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onRefreshCompany: PropTypes.func,
};

PlanInfo.defaultProps = {
  planDetail: {
    name: 'Advanced',
  },
  onRefreshCompany: undefined,
};

PlanInfo.contextType = GlobalContext;

export default withRouter(PlanInfo);
