import { makeStyles, PrimaryButton, Stack, Text } from '@fluentui/react';
import { CustomText } from 'features/shared/components';
import InputComponent from 'features/shared/components/ModalForm/InputComponent';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LIGHT_THEME } from 'core/constants/Theme';

const validationSchema = Yup.object().shape({
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password must match')
    .required(),
});

const fieldStyles = {
  root: {
    marginBottom: 16,
    width: '100%',
  },
  fieldGroup: {
    height: 56,
  },

  revealButton: {
    marginTop: 12,
    marginRight: 6,
  },
  subComponentStyles: {
    label: {
      root: {
        display: 'none',
      },
    },
  },
};

const useStyles = makeStyles((theme) => ({
  textLogin: {
    color: theme.palette.themePrimary,
    cursor: 'pointer',
  },
}));

const iconStyles = {
  root: {
    pointerEvents: 'auto',
    cursor: 'pointer',
    width: 24,
    height: 24,
    bottom: 14,
    right: 12,
    selectors: {
      '.styles-path': {
        fill: LIGHT_THEME.palette.neutralQuaternaryAlt,
      },
    },
  },
};

const useInputPassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return [showPassword, onShowPassword];
};

function ResetPasswordForm({ onSubmit, onLogin }) {
  const classes = useStyles();

  const [showPassword, onShowPassword] = useInputPassword();

  const [showConfirmPassword, onShowConfirmPassword] = useInputPassword();

  return (
    <Formik
      enableReinitialize
      validateOnBlur={false}
      initialValues={{ password: '', confirmPassword: '' }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(formProps) => {
        const { errors, touched, isSubmitting, handleSubmit } = formProps;
        const isError = (field) => touched[field] && Boolean(errors[field]);

        return (
          <Form style={{ width: '100%', marginTop: 30 }} autoComplete="off" onSubmit={handleSubmit}>
            <Field
              type={showPassword ? 'text' : 'password'}
              component={InputComponent}
              errorMessage={errors.password || undefined}
              invalid={isError('password')}
              name="password"
              styles={fieldStyles}
              label="New Password"
              placeholder="New Password"
              iconProps={{
                iconName: showPassword ? 'eye-hidden' : 'eye-open-svg',
                onClick: onShowPassword,
                styles: iconStyles,
              }}
            />
            <Field
              type={showConfirmPassword ? 'text' : 'password'}
              component={InputComponent}
              errorMessage={errors.confirmPassword || undefined}
              invalid={isError('confirmPassword')}
              name="confirmPassword"
              styles={fieldStyles}
              label="New Password Confirm"
              placeholder="New Password Confirm"
              iconProps={{
                iconName: showConfirmPassword ? 'eye-hidden' : 'eye-open-svg',
                onClick: onShowConfirmPassword,
                styles: iconStyles,
              }}
            />
            <PrimaryButton
              disabled={isSubmitting}
              styles={{ root: { width: '100%', marginTop: 4 } }}
              type="submit"
              text="Reset Password"
            />
            <Stack styles={{ root: { marginTop: 30 } }} horizontal verticalAlign="center" horizontalAlign="center">
              <CustomText color="textSecondary" style={{ marginRight: 2 }}>
                Or go back to
              </CustomText>
              <Text onClick={onLogin} className={classes.textLogin}>
                Login
              </Text>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
}

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onLogin: PropTypes.func,
};
ResetPasswordForm.defaultProps = {
  onLogin: undefined,
};
export default ResetPasswordForm;
