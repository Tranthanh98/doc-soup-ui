import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import {
  Stack,
  Shimmer,
  ShimmerElementsGroup,
  ShimmerElementType,
  MessageBar,
  MessageBarType,
  ThemeContext,
} from '@fluentui/react';
import AutoForm from 'features/shared/components/ModalForm/AutoForm';
import { CustomText } from 'features/shared/components';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import Resource from 'core/constants/Resource';

const stackItemStyles = (theme) => ({
  root: {
    padding: 40,
    paddingLeft: 20,
    width: '100%',
    backgroundColor: theme.palette.grayLight,
    [BREAKPOINTS_RESPONSIVE.md]: {
      padding: `40px 24px`,
    },
  },
});
const wrapperForm = {
  root: {
    [BREAKPOINTS_RESPONSIVE.md]: {
      maxWidth: 390,
      margin: 'auto',
    },
    [BREAKPOINTS_RESPONSIVE.sm]: {
      maxWidth: 282,
      margin: 'auto',
    },
  },
};
const styleForm = {
  root: {
    paddingLeft: 90,
    paddingRight: 90,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      paddingTop: 20,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
};
const stylesField = {
  root: {
    [BREAKPOINTS_RESPONSIVE.lgUp]: {
      div: {
        display: 'flex',
        width: '100%',
        minWidth: 270,
      },
      label: {
        minWidth: 61,
      },
    },
  },
};
const companyFormSchema = (companyInfo) => ({
  formTitle: 'General',
  submitBtnName: 'Save Changes',
  submitBtnSpace: 84,
  submitBtnAlign: 'start',
  formSchema: [
    {
      inputProps: {
        label: 'Name',
        id: 'name',
        name: 'name',
        type: 'text',
        required: true,
        minLength: 3,
        maxLength: 200,
        description: '',
        autoFocus: true,
      },
      initialValue: companyInfo?.name,
    },
    {
      inputProps: {
        label: 'Tracking Owner Visit',
        id: 'trackingOwnerVisit',
        name: 'trackingOwnerVisit',
        type: 'checkbox',
        minLength: 3,
        maxLength: 200,
        autoFocus: true,
        inputStyleCheckBox: {
          root: { marginLeft: 62, [BREAKPOINTS_RESPONSIVE.mdDown]: { marginLeft: 0 } },
        },
      },
      // eslint-disable-next-line no-unused-vars
      onRenderSuffixes: (_) => (
        <Stack styles={{ root: { margin: 0, fontSize: 12, paddingLeft: 20 } }}>
          <CustomText variant="small" styles={{ root: { paddingBottom: 12 } }} color="textSecondary" block>
            {Resource.TRACKING_OWNER_VISIT}
          </CustomText>
        </Stack>
      ),
      inputWrapperProps: {
        horizontal: false,
        tokens: { childrenGap: 0 },
      },
      initialValue: companyInfo?.trackingOwnerVisit,
    },
  ],
});

const formShimmer = (
  <>
    <ShimmerElementsGroup
      shimmerElements={[
        { type: ShimmerElementType.line, width: 50, height: 16 },
        { type: ShimmerElementType.gap, width: '100%', height: 20 },
      ]}
    />
    <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 8 }]} />
    <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.line, width: '100%', height: 32 }]} />
    <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 32 }]} />
    <ShimmerElementsGroup
      shimmerElements={[
        { type: ShimmerElementType.line, width: 135, height: 32 },
        { type: ShimmerElementType.gap, width: '100%', height: 20 },
      ]}
    />
  </>
);

class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyInfo: undefined,
    };
  }

  componentDidMount() {
    this._getCompanyId();
  }

  _getCompanyId = () => {
    const { getToken } = this.context;
    new RestService()
      .setPath('/account')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          this.activeCompanyId = res.data.activeCompanyId;
          this._getCompanyInfo(this.activeCompanyId);
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _getCompanyInfo = (activeCompanyId) => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/company/${activeCompanyId}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        this.setState({ companyInfo: res.data });
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message;
        if (errorMessage) {
          this.setState({ errorMessage });
        } else {
          RestServiceHelper.handleError(err);
        }
      });
  };

  _updateCompany = (values, formProps) => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/company/${this.activeCompanyId}`)
      .setToken(getToken())
      .put(values)
      .then(() => {
        formProps.setStatus(true);
      })
      .catch((err) => RestServiceHelper.handleError(err, formProps))
      .finally(() => formProps.setSubmitting(false));
  };

  render() {
    const { companyInfo, errorMessage } = this.state;
    if (errorMessage) {
      return (
        <MessageBar messageBarType={MessageBarType.severeWarning} isMultiline={false}>
          {errorMessage}
        </MessageBar>
      );
    }
    return (
      <ThemeContext.Consumer>
        {(theme) => {
          return (
            <Stack styles={stackItemStyles(theme)}>
              <Stack.Item styles={wrapperForm}>
                <Shimmer isDataLoaded={companyInfo} customElementsGroup={formShimmer} styles={styleForm}>
                  <AutoForm
                    formData={companyFormSchema(companyInfo)}
                    onSubmit={this._updateCompany}
                    stylesField={stylesField}
                  />
                </Shimmer>
              </Stack.Item>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
General.contextType = GlobalContext;
export default General;
