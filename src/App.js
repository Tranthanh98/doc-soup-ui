import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { initializeFileTypeIcons } from '@uifabric/file-type-icons';
import { registerIcons, ProgressIndicator } from '@fluentui/react';
import { REGISTER_ICONS } from 'core/constants/Theme';
import Auth from 'security/Auth';
import CheckIn from 'security/CheckIn';
import AuthorizedRoute from 'security/AuthorizedRoute';
import { Layout, AppLayout } from 'features/shared/components';
import ConfirmDialog from 'features/shared/components/ConfirmDialog';
import AlertDialog from 'features/shared/components/AlertDialog';
import '@fluentui/react/dist/css/fabric.min.css';
import './styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

const Content = lazy(() => import('./features/content'));
const FileDetail = lazy(() => import('./features/content/fileDetail'));
const FilePreview = lazy(() => import('./features/content/fileDetail/FilePreview'));
const LinkView = lazy(() => import('./features/linkView'));
const DataRoom = lazy(() => import('./features/dataRooms'));
const Contacts = lazy(() => import('./features/contacts'));
const ContactDetail = lazy(() => import('./features/contacts/contactDetail'));
const DataRoomDetail = lazy(() => import('./features/dataRooms/dataRoomDetail'));
const Settings = lazy(() => import('./features/settings'));
const ErrorPage = lazy(() => import('./features/shared/components/ErrorPage'));
const InternalErrorPage = lazy(() => import('./features/shared/components/ErrorPage/Page500'));
const AcceptInvitation = lazy(() => import('./features/settings/components/Company/Users/AcceptInvitation'));
const Dashboard = lazy(() => import('./features/dashboard'));
const ResetPassword = lazy(() => import('./features/settings/components/Personal/ResetPassword'));
const PlanTier = lazy(() => import('./features/plantier'));
const Purchase = lazy(() => import('./features/plantier/components/Purchase'));
const CheckoutSuccess = lazy(() => import('./features/shared/components/SuccessPage/CheckoutSuccess'));
const BillingInfo = lazy(() => import('./features/payment/components/billingInfo'));
const Payment = lazy(() => import('./features/payment'));
const LinkAccount = lazy(() => import('./features/linkAccount'));
const Company = lazy(() => import('./features/company'));
const LinkAccountDetail = lazy(() => import('./features/linkAccount/linkAccountDetail'));
const Search = lazy(() => import('./features/search'));
const SearchAll = lazy(() => import('./features/search/searchAll'));
const CancelPlan = lazy(() => import('./features/plantier/components/Cancel'));
const Downgrade = lazy(() => import('./features/plantier/components/Downgrade'));
const Team = lazy(() => import('./features/team'));
const TeamDetail = lazy(() => import('./features/team/TeamDetail'));

export default class App extends Component {
  constructor(props) {
    super(props);
    initializeIcons();
    initializeFileTypeIcons();
    registerIcons(REGISTER_ICONS);
    window.confirm = ConfirmDialog;
    window.alert = AlertDialog;
  }

  componentDidMount() {
    this._loadScript();
  }

  _loadScript = () => {
    const { REACT_APP_TALK_TO_KEY } = process.env;
    const script = document.createElement('script');
    const scriptBefore = document.getElementsByTagName('script')[0];
    script.src = `https://embed.tawk.to/${REACT_APP_TALK_TO_KEY}`;
    script.async = true;
    script.setAttribute('crossorigin', '*');
    scriptBefore.parentNode.insertBefore(script, scriptBefore);
  };

  render() {
    return (
      <Layout>
        <Auth>
          <CheckIn>
            <Suspense fallback={<ProgressIndicator barHeight={4} />}>
              <Switch>
                <AuthorizedRoute path="/content/file/:id/preview" component={FilePreview} />
                <Route exact path="/view/:linkId" component={LinkView} />
                <Route path="/internal-error" component={InternalErrorPage} />
                <Route exact path="/accept-invitation" component={AcceptInvitation} />
                <Route path="/reset-password" component={ResetPassword} />
                <AuthorizedRoute exact path="/upgrade/plans" component={PlanTier} />
                <AuthorizedRoute exact path="/upgrade/plans/:id/:subscriptionType/purchase" component={Purchase} />
                <AuthorizedRoute exact path="/company" component={Company} />
                <AuthorizedRoute exact path="/checkout/success" component={CheckoutSuccess} />
                <AuthorizedRoute exact path="/cancel/plan" component={CancelPlan} />
                <AuthorizedRoute exact path="/downgrade/plan/:id/:subscriptionType" component={Downgrade} />
                <AuthorizedRoute exact path="/downgrade/plan/:id/:subscriptionType/purchase" component={Purchase} />
                <Route path="*">
                  <AppLayout>
                    <Switch>
                      <AuthorizedRoute exact path="/" component={Content} />
                      <AuthorizedRoute exact path="/content" component={Content} />
                      <AuthorizedRoute exact path="/content/file/:id" component={FileDetail} />
                      <AuthorizedRoute exact path="/data-rooms" component={DataRoom} />
                      <AuthorizedRoute exact path="/contacts" component={Contacts} />
                      <AuthorizedRoute exact path="/contacts/:id" component={ContactDetail} />
                      <AuthorizedRoute exact path="/data-rooms/:id" component={DataRoomDetail} />
                      <AuthorizedRoute exact path="/settings" component={Settings} />
                      <AuthorizedRoute exact path="/dashboard" component={Dashboard} />
                      <AuthorizedRoute exact path="/billing" component={BillingInfo} />
                      <AuthorizedRoute exact path="/payment/execute-payment" component={Payment} />
                      <AuthorizedRoute exact path="/link-account" component={LinkAccount} />
                      <AuthorizedRoute exact path="/link-account/:id" component={LinkAccountDetail} />
                      <AuthorizedRoute exact path="/search" component={Search} />
                      <AuthorizedRoute exact path="/search/:id" component={SearchAll} />
                      <AuthorizedRoute exact path="/team" component={Team} />
                      <AuthorizedRoute exact path="/team/:userId" component={TeamDetail} />
                      <Route path="*" component={ErrorPage} />
                    </Switch>
                  </AppLayout>
                </Route>
              </Switch>
            </Suspense>
          </CheckIn>
        </Auth>
      </Layout>
    );
  }
}
