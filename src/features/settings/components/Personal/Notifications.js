import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { Stack, Shimmer, ShimmerElementsGroup, ShimmerElementType, ThemeContext } from '@fluentui/react';
import AutoForm from 'features/shared/components/ModalForm/AutoForm';
import { success } from 'features/shared/components/ToastMessage';
import { CustomText } from 'features/shared/components';

const stylesField = {
  root: {
    [BREAKPOINTS_RESPONSIVE.lgUp]: {
      div: {
        display: 'flex',
        width: '100%',
        minWidth: 270,
      },
      label: {
        minWidth: 120,
      },
    },
  },
};

const wrapStyles = (theme) => ({
  root: {
    padding: 40,
    paddingLeft: 80,
    backgroundColor: theme.palette.grayLight,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      padding: '40px 24px',
    },
  },
});

const notificationsFormSchema = {
  formTitle: 'Notifications',
  submitBtnName: 'Save Changes',
  submitBtnAlign: 'start',
  submitBtnSpace: 0,
  formSchema: [
    {
      inputProps: {
        label: 'Daily',
        id: 'sendDailySummary',
        name: 'sendDailySummary',
        type: 'checkbox',
        minLength: 3,
        maxLength: 200,
        autoFocus: true,
        inputStyleCheckBox: {
          root: { marginLeft: 84, [BREAKPOINTS_RESPONSIVE.mdDown]: { marginLeft: 24 } },
        },
      },
      inputWrapperProps: {
        horizontal: false,
        tokens: { childrenGap: 0 },
      },
      initialValue: undefined,
    },
    {
      inputProps: {
        label: 'Weekly team update emails',
        id: 'sendWeeklySummary',
        name: 'sendWeeklySummary',
        type: 'checkbox',
        minLength: 3,
        maxLength: 200,
        autoFocus: true,
        inputStyleCheckBox: {
          root: { marginLeft: 84, [BREAKPOINTS_RESPONSIVE.mdDown]: { marginLeft: 24 } },
        },
      },
      inputWrapperProps: {
        horizontal: false,
        tokens: { childrenGap: 0 },
      },
      initialValue: undefined,
    },
  ],
};
const formShimmer = (
  <>
    <ShimmerElementsGroup
      shimmerElements={[
        { type: ShimmerElementType.line, width: 80, height: 16 },
        { type: ShimmerElementType.gap, width: '100%', height: 16 },
      ]}
    />
    <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 8 }]} />
    <ShimmerElementsGroup
      shimmerElements={[
        { type: ShimmerElementType.circle, width: 52, height: 52 },
        { type: ShimmerElementType.gap, width: '100%', height: 52 },
      ]}
    />
    <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 32 }]} />
    {notificationsFormSchema.formSchema.map((field, index) => (
      <React.Fragment key={index}>
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, width: 80, height: 12 },
            { type: ShimmerElementType.gap, width: '100%', height: 12 },
          ]}
        />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 8 }]} />
        <ShimmerElementsGroup
          flexWrap
          shimmerElements={[
            { type: ShimmerElementType.line, width: '100%', height: 32 },
            { type: ShimmerElementType.gap, width: '100%', height: 32 },
          ]}
        />
      </React.Fragment>
    ))}
    <ShimmerElementsGroup
      shimmerElements={[
        { type: ShimmerElementType.line, width: 120, height: 40 },
        { type: ShimmerElementType.gap, width: '100%', height: 40 },
      ]}
    />
  </>
);

class Notifications extends Component {
  state = {
    notificationsFormSchema: { ...notificationsFormSchema },
    isDataLoaded: false,
  };

  componentDidMount() {
    this._getDataInfo();
  }

  _getDataInfo = () => {
    const { getToken } = this.context;

    new RestService()
      .setPath('/account')
      .setToken(getToken())
      .get()
      .then((response) => {
        this.setState((state) => {
          const newFormSchema = state.notificationsFormSchema.formSchema.map((fieldInput) => ({
            ...fieldInput,
            initialValue: response.data[fieldInput.inputProps.name],
          }));
          return {
            notificationsFormSchema: { ...state.notificationsFormSchema, formSchema: newFormSchema },
            isDataLoaded: true,
            userInfo: response.data,
          };
        });
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _updateNotificationSetting = (values, formProps) => {
    const { getToken } = this.context;

    new RestService()
      .setPath('/account/update-notification-setting')
      .setToken(getToken())
      .put(values)
      .then(() => {
        formProps.setStatus(true);
        this._getDataInfo();
        success('Update notification setting is successfully');
      })
      .catch((err) => RestServiceHelper.handleError(err, formProps))
      .finally(() => formProps.setSubmitting(false));
  };

  render() {
    const { notificationsFormSchema, isDataLoaded } = this.state;

    return (
      <ThemeContext.Consumer>
        {(theme) => {
          return (
            <Stack horizontalAlign="center" verticalAlign="center" styles={wrapStyles(theme)}>
              <Shimmer
                styles={{ root: { width: '100%' } }}
                isDataLoaded={isDataLoaded}
                customElementsGroup={formShimmer}
              >
                <CustomText styles={{ root: { fontSize: 14, fontWeight: 500 } }}>Send me digest</CustomText>
                <Stack styles={{ root: { marginTop: 15 } }}>
                  <AutoForm
                    minWidthLabel={94}
                    formData={notificationsFormSchema}
                    onSubmit={this._updateNotificationSetting}
                    stylesField={stylesField}
                  />
                </Stack>
              </Shimmer>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
Notifications.contextType = GlobalContext;
export default Notifications;
