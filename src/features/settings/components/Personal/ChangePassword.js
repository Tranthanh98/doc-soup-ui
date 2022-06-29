import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import AutoForm from 'features/shared/components/ModalForm/AutoForm';
import { Stack, ThemeContext } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { success } from 'features/shared/components/ToastMessage';

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
  errorMessage: {
    backgroundColor: 'black !important',
  },
};
const stylesField = (isCorrectCurrentPass) => ({
  root: {
    [BREAKPOINTS_RESPONSIVE.lgUp]: {
      div: {
        display: 'flex',
        width: '100%',
        minWidth: 270,
      },
      label: {
        minWidth: 180,
      },
    },
  },
  description: {
    color: LIGHT_THEME.palette.neutralSecondaryAlt,
    display: isCorrectCurrentPass ? 'block' : 'none',
    fontFamily: 'SourceHanSansKR',
    fontSize: 13,
    textAlign: 'left',
    [BREAKPOINTS_RESPONSIVE.lgUp]: {
      marginLeft: 180,
      letterSpacing: -0.5,
    },
  },
  errorMessage: {
    marginLeft: 0,
    [BREAKPOINTS_RESPONSIVE.lgUp]: {
      marginLeft: 180,
    },
  },
});
const linkStyles = {
  root: {
    color: LIGHT_THEME.palette.orangeLight,
  },
};

const formSchemaNewPass = [
  {
    inputProps: {
      label: 'New password',
      id: 'newPass',
      name: 'newPass',
      placeholder: 'New password',
      required: true,
      type: 'password',
      minLength: 3,
      maxLength: 200,
      description: '',
    },
  },
  {
    inputProps: {
      label: 'Password confirm',
      id: 'confirmNewPass',
      name: 'confirmNewPass',
      placeholder: 'New Password Confirm',
      type: 'password',
      required: true,
      matchPasswordRef: 'newPass',
      minLength: 3,
      maxLength: 200,
      description: 'Please enter a new password.',
    },
  },
];
const changePassFormSchema = (handleForgotPassword) => ({
  formTitle: 'Verify Pass',
  submitBtnName: 'Change Password',
  submitBtnSpace: 180,
  submitBtnAlign: 'start',
  formSchema: [
    {
      inputProps: {
        label: 'Current password',
        id: 'currentPass',
        name: 'currentPass',
        type: 'password',
        required: true,
        placeholder: 'Current password',
        minLength: 3,
        maxLength: 200,
        description: 'If you want to change the password, please enter the password you’re using.',
        autoFocus: true,
      },
    },
    {
      inputProps: {
        label: 'Forgot password?',
        href: '#',
        id: 'forgotPassword',
        target: '_blank',
        type: 'link',
        styles: linkStyles,
        underline: true,
        onClick: (event) => {
          event.preventDefault();
          if (typeof handleForgotPassword === 'function') {
            handleForgotPassword();
          }
        },
      },
    },
  ],
});

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCorrectCurrentPass: true,
      currentPassword: '',
      formSchema: changePassFormSchema(this._handleForgotPassword),
    };
  }

  _changePassword = async (values, formProps) => {
    const { getToken } = this.context;
    const { currentPassword } = this.state;

    new RestService()
      .setPath('/account/password')
      .setToken(getToken())
      .post({ ...values, ...{ currentPass: currentPassword } })
      .then(() => {
        formProps.setStatus(true);
        success('Password updated successfully');
      })
      .catch((err) => RestServiceHelper.handleError(err, formProps))
      .finally(() => formProps.setSubmitting(false));
  };

  _verifyOldPass = async (values, formProps) => {
    const schema = { ...changePassFormSchema(this.context) };
    const { currentPass } = values;
    const isCorrectCurrentPass = await this._isCorrectCurrentPassword(currentPass);
    this.setState({ isCorrectCurrentPass });
    if (isCorrectCurrentPass) {
      schema.formTitle = 'Change Pass';
      schema.formSchema = formSchemaNewPass;
      this.setState({ formSchema: schema });
      this.setState({ currentPassword: currentPass });
    }
    formProps.setSubmitting(false);
  };

  _isCorrectCurrentPassword = async (password) => {
    const { authContext } = this.context;
    const url = `${authContext.authServerUrl}realms/${authContext.realm}/protocol/openid-connect/token`;
    const request = {
      client_id: authContext.clientId,
      username: authContext.userInfo.preferred_username,
      password,
      grant_type: 'password',
    };

    try {
      const response = await new RestService()
        .setPath(url)
        .setHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        .post(new URLSearchParams(request));

      if (response.status === 200 && response.data) {
        return true;
      }
    } catch (err) {
      return false;
    }

    return false;
  };

  _handleForgotPassword = () => {
    const { getToken } = this.context;
    const formDataSchema = { ...changePassFormSchema() };

    const formItem = formDataSchema.formSchema.find((i) => i.inputProps.id === 'forgotPassword');

    formItem.isSendEmail = true;
    this.setState({ formSchema: formDataSchema });
    new RestService()
      .setPath('/account/forgot-password')
      .setToken(getToken())
      .get()
      .then(() => {
        if (formItem) {
          formItem.inputProps.label = 'Password reset email sent';
          formItem.isSendEmail = false;
          formItem.inputProps.disabled = true;
          formItem.inputProps.underline = false;
          success('Password reset email sent');
        }
      })
      .catch((err) => {
        formItem.inputProps.onClick = this._handleForgotPassword;
        RestServiceHelper.handleError(err);
      })
      .finally(() => {
        this.setState({ formSchema: formDataSchema });
      });
  };

  render() {
    const { isCorrectCurrentPass, formSchema } = this.state;
    return (
      <ThemeContext.Consumer>
        {(theme) => {
          return (
            <Stack styles={stackItemStyles(theme)}>
              <Stack.Item styles={wrapperForm}>
                <AutoForm
                  formData={formSchema}
                  onSubmit={formSchema.formTitle === 'Change Pass' ? this._changePassword : this._verifyOldPass}
                  isCorrectCurrentPass={isCorrectCurrentPass}
                  validateOnChange
                  stylesField={stylesField(isCorrectCurrentPass)}
                />
              </Stack.Item>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
ChangePassword.contextType = GlobalContext;

export default ChangePassword;
