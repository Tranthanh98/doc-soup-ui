import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { Stack, Text, Persona, Shimmer, ShimmerElementsGroup, ShimmerElementType, ThemeContext } from '@fluentui/react';
import AutoForm from 'features/shared/components/ModalForm/AutoForm';
import { success } from 'features/shared/components/ToastMessage';
import { ACCOUNT_KEY } from 'core/constants/Const';
import eventBus from 'features/shared/lib/eventBus';
import domainEvents from 'features/shared/domainEvents';

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

const personaStyles = {
  root: {
    cursor: 'pointer',
  },
};

const profilePictureStyles = {
  root: {
    display: 'flex',
    marginBottom: 30,
    flexFlow: 'row nowrap',
    alignItems: 'center',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      marginBottom: 20,
      flexFlow: 'column nowrap',
      alignItems: 'start',
    },
  },
};

const labelProfileStyles = {
  root: {
    width: 120,
    paddingRight: 24,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      textAlign: 'left',
      marginRight: 0,
      marginBottom: 12,
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
      maxWidth: 390,
      margin: 'auto',
    },
  },
});

const accountFormSchema = {
  formTitle: 'Account',
  submitBtnName: 'Save Changes',
  submitBtnAlign: 'start',
  submitBtnSpace: 120,
  formSchema: [
    {
      inputProps: {
        label: 'Name',
        id: 'firstName',
        name: 'firstName',
        type: 'text',
        minLength: 3,
        required: true,
        maxLength: 200,
        description: '',
        autoFocus: true,
      },
      initialValue: undefined,
    },
    {
      inputProps: {
        label: 'Phone',
        id: 'phone',
        name: 'phone',
        type: 'mask',
        mask: '*****************',
        maskFormat: { '*': /[0-9]/ },
        maskChar: '',
        required: true,
        minLength: 9,
        maxLength: 200,
      },
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
    {accountFormSchema.formSchema.map((field, index) => (
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

class Account extends Component {
  state = {
    accountFormSchema: { ...accountFormSchema },
    isDataLoaded: false,
    userInfo: {},
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
          const newFormSchema = state.accountFormSchema.formSchema.map((fieldInput) => ({
            ...fieldInput,
            initialValue:
              fieldInput.inputProps.name === ACCOUNT_KEY.FIRST_NAME
                ? `${response.data[fieldInput.inputProps.name]} ${response.data[ACCOUNT_KEY.LAST_NAME]}`
                : response.data[fieldInput.inputProps.name],
          }));
          return {
            accountFormSchema: { ...state.accountFormSchema, formSchema: newFormSchema },
            isDataLoaded: true,
            userInfo: response.data,
          };
        });
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _saveAccountInfo = (values, formProps) => {
    const { getToken } = this.context;

    new RestService()
      .setPath('/account')
      .setToken(getToken())
      .put(values)
      .then(() => {
        formProps.setStatus(true);
        this._getDataInfo();
        success('Update account is successfully');
        eventBus.publish(domainEvents.CHANGE_ACCOUNT_NAME_DOMAINEVENT);
      })
      .catch((err) => RestServiceHelper.handleError(err, formProps))
      .finally(() => formProps.setSubmitting(false));
  };

  render() {
    const { accountFormSchema, isDataLoaded, userInfo } = this.state;

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
                <Stack styles={profilePictureStyles}>
                  <Text block styles={labelProfileStyles}>
                    Profile picture
                  </Text>
                  <Persona
                    hidePersonaDetails
                    size={52}
                    initialsColor={theme.palette.greenLight}
                    styles={personaStyles}
                    text={`${userInfo.firstName} ${userInfo.lastName}`}
                  />
                </Stack>
                <AutoForm
                  minWidthLabel={94}
                  formData={accountFormSchema}
                  onSubmit={this._saveAccountInfo}
                  stylesField={stylesField}
                />
              </Shimmer>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
Account.contextType = GlobalContext;
export default Account;
