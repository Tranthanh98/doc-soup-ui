import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import * as Yup from 'yup';
import { getTheme, Stack, Text, Spinner, Link } from '@fluentui/react';
import InputComponent from './InputComponent';
import CustomButton from '../CustomButton';

const theme = getTheme();
const stackFooterStyles = (props) => {
  return {
    root: {
      marginTop: theme.spacing.m,
      // marginLeft: 24,
      [BREAKPOINTS_RESPONSIVE.lgUp]: {
        marginLeft: props.formData?.submitBtnSpace,
        marginTop: 0,
      },
    },
  };
};

const errorTextStyles = {
  root: {
    color: theme.palette.red,
  },
};

const textFieldStyles = (styles, error) => {
  const textField = {
    fieldGroup: {
      width: '100%',
      height: 40,
    },
    subComponentStyles: {
      label: {
        root: {
          color: LIGHT_THEME.palette.neutralPrimary,
          fontSize: 14,
          fontWeight: 'normal',
          textAlign: 'left',
        },
      },
    },
    errorMessage: {
      paddingTop: 4,
      paddingBottom: error ? 12 : 0,
    },
  };
  return { ...textField, ...styles };
};

export default function AutoForm(props) {
  const { formData, validateOnChange, onSubmit, isCorrectCurrentPass, stylesField } = props;
  let initialValues = {};
  let validationSchema = {};

  const _initFormValue = (formSchema) => {
    const _initialValues = {};
    formSchema.forEach((field) => {
      _initialValues[field.inputProps.name] = field.initialValue ?? '';
    });
    return _initialValues;
  };

  const _initValidationSchema = (formSchema) => {
    const _validationSchema = {};
    formSchema.forEach((field) => {
      const { type, name, required, maxLength, minLength, matchPasswordRef, label, matches, matchError } =
        field.inputProps;
      switch (type) {
        case 'text':
        case 'password':
          _validationSchema[name] = Yup.string().label(label || name);
          if (minLength) {
            _validationSchema[name] = _validationSchema[name].min(minLength);
          }
          if (maxLength) {
            _validationSchema[name] = _validationSchema[name].max(maxLength);
          }
          if (matches) {
            _validationSchema[name] = _validationSchema[name].matches(matches, matchError);
          }
          if (matchPasswordRef) {
            _validationSchema[name] = _validationSchema[name].oneOf(
              [Yup.ref(matchPasswordRef)],
              'Password does not match!'
            );
          }
          break;
        case 'email':
          _validationSchema[name] = maxLength ? Yup.string().email().max(maxLength) : Yup.string().email();
          break;
        case 'checkbox':
          _validationSchema[name] = required ? Yup.boolean().oneOf([true], 'You must check') : Yup.boolean();
          break;
        case 'file':
          _validationSchema[name] = Yup.mixed().test('fileSize', 'File size is too large', () => {
            const { files } = document.getElementById(field.inputProps.id);
            if (files) {
              if (files[0]?.size > 2097152) {
                return false;
              }
            }
            return true;
          });
          break;
        default:
          _validationSchema[name] = Yup.string().label(label || name);
          break;
      }
      if (_validationSchema[name] && required) {
        _validationSchema[name] = _validationSchema[name].label(label || name).required();
      }
    });
    return Yup.object().shape({ ..._validationSchema });
  };

  const _handleSubmit = (values, formProps) => {
    formProps.setSubmitting(true);
    formProps.setStatus(undefined);
    onSubmit(values, formProps);
  };

  const { formSchema } = formData;
  if (formSchema && formSchema.length) {
    initialValues = _initFormValue(formSchema);
    validationSchema = _initValidationSchema(formSchema);
  }

  return (
    <Formik
      enableReinitialize
      validateOnChange={validateOnChange}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={_handleSubmit}
      validationSchema={validationSchema}
    >
      {(formProps) => {
        const { dirty, errors, touched, isSubmitting, status } = formProps;
        const isError = (field) => touched[field] && Boolean(errors[field]);
        return (
          <Form>
            <Stack vertical tokens={{ childrenGap: 16 }}>
              {formData?.formSchema?.map((field, index) => {
                const { inputWrapperProps, inputProps, onRenderPrefix, onRenderSuffixes, isSendEmail } = field;
                if (inputProps.type === 'link') {
                  return (
                    <Stack
                      horizontal
                      horizontalAlign={formData.submitBtnAlign || 'end'}
                      tokens={{ childrenGap: 8 }}
                      styles={stackFooterStyles(props)}
                      key={index}
                    >
                      {isSendEmail && <Spinner label="Sending..." ariaLive="assertive" labelPosition="left" />}
                      <Link {...inputProps}>{inputProps?.label}</Link>
                    </Stack>
                  );
                }

                if (inputProps.name === 'currentPass') {
                  return (
                    <Field
                      key={index}
                      component={InputComponent}
                      {...inputProps}
                      styles={textFieldStyles(stylesField)}
                      invalid={isError(inputProps.name)}
                      errorMessage={
                        !isCorrectCurrentPass
                          ? 'The current password is incorrect.'
                          : errors[inputProps.name] || undefined
                      }
                    />
                  );
                }
                const fieldInput = (
                  <Field
                    component={InputComponent}
                    {...inputProps}
                    styles={textFieldStyles(stylesField, errors.passcode)}
                    invalid={isError(inputProps.name)}
                    errorMessage={errors[inputProps.name] || undefined}
                  />
                );
                if (onRenderPrefix || onRenderSuffixes) {
                  return (
                    <Stack
                      styles={inputProps.inputStyleCheckBox}
                      key={index}
                      horizontalAlign="space-between"
                      verticalAlign="center"
                      {...inputWrapperProps}
                    >
                      {onRenderPrefix && onRenderPrefix(formProps, errors)}
                      {fieldInput}
                      {onRenderSuffixes && onRenderSuffixes(formProps, errors)}
                    </Stack>
                  );
                }
                return <Stack.Item key={index}>{fieldInput}</Stack.Item>;
              })}
              <Text block variant="small" styles={errorTextStyles}>
                {errors?._summary_}
              </Text>
              <Stack.Item style={{ paddingTop: 16 }}>
                <Stack
                  horizontal
                  horizontalAlign={formData.submitBtnAlign || 'end'}
                  tokens={{ childrenGap: 8 }}
                  styles={stackFooterStyles(props)}
                >
                  {isSubmitting && <Spinner label="Submitting..." ariaLive="assertive" labelPosition="left" />}
                  <CustomButton
                    primary
                    size="medium"
                    text={formData?.submitBtnName}
                    type="submit"
                    disabled={!dirty || isSubmitting}
                    iconProps={{ iconName: status ? 'Completed' : undefined }}
                  />
                </Stack>
              </Stack.Item>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
}

AutoForm.propTypes = {
  isCancel: PropTypes.bool,
  formData: PropTypes.shape({
    formSchema: PropTypes.arrayOf(
      PropTypes.shape({
        inputProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
      })
    ),
    formTitle: PropTypes.string,
    submitBtnName: PropTypes.string,
    submitBtnAlign: PropTypes.string,
    cancleBtnName: PropTypes.string,
    footerContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  validateOnChange: PropTypes.bool,
  isCorrectCurrentPass: PropTypes.bool,
  stylesField: PropTypes.oneOfType([PropTypes.object]),
};

AutoForm.defaultProps = {
  isCancel: false,
  validateOnChange: false,
  isCorrectCurrentPass: true,
  stylesField: undefined,
};
