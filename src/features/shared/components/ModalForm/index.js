import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { getTheme, Stack, Text, DefaultButton, PrimaryButton, Spinner } from '@fluentui/react';
import CustomModal from '../CustomModal';
import InputComponent from './InputComponent';

const theme = getTheme();
const stackFooterStyles = {
  root: {
    marginTop: theme.spacing.m,
  },
};
const errorTextStyles = {
  root: {
    color: theme.palette.red,
  },
};
const largeButtonStyles = {
  root: {
    height: 40,
  },
  label: {
    fontSize: theme.fonts.medium.fontSize,
  },
};

export default function ModalForm(props) {
  const { isOpen, onToggle, isCancel, formData, onSubmit, noSame } = props;

  const _toggleHideModal = () => {
    onToggle('');
  };

  let initialValues = {};
  let validationSchema = {};

  const _initFormValue = (formSchema) => {
    const _initialValues = {};
    formSchema.forEach((field) => {
      if (field.inputProps !== undefined) {
        _initialValues[field.inputProps.name] = field.initialValue ?? '';
      }
    });
    return _initialValues;
  };

  const _initValidationSchema = (formSchema) => {
    const _validationSchema = {};
    formSchema.forEach((field) => {
      const { validationSchema: fieldValidationSchema } = field;
      const { type, name, required, maxLength, minLength } = field.inputProps;
      switch (type) {
        case 'text':
          _validationSchema[name] = Yup.string();
          if (minLength) {
            _validationSchema[name] = _validationSchema[name].min(minLength);
          }
          if (maxLength) {
            _validationSchema[name] = _validationSchema[name].max(maxLength);
          }
          break;
        case 'email':
          _validationSchema[name] = maxLength ? Yup.string().email().max(maxLength) : Yup.string().email();
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
          _validationSchema[name] = Yup.string();
          break;
      }
      if (_validationSchema[name] && required) {
        _validationSchema[name] = _validationSchema[name].required();
      }
      if (fieldValidationSchema) {
        _validationSchema[name] = fieldValidationSchema;
      }
    });
    return Yup.object().shape({ ..._validationSchema });
  };

  const _handleSubmit = (values, formProps) => {
    formProps.setSubmitting(true);
    onSubmit(values, formProps);
  };

  const { formSchema } = formData;
  if (formSchema && formSchema.length) {
    initialValues = _initFormValue(formSchema);
    validationSchema = _initValidationSchema(formSchema);
  }

  return (
    <CustomModal title={formData?.formTitle} isOpen={isOpen} onDismiss={_toggleHideModal}>
      <Formik
        enableReinitialize
        validateOnChange={!!formData?.validateOnChange}
        validateOnBlur={!!formData?.validateOnBlur}
        initialValues={initialValues}
        onSubmit={_handleSubmit}
        validationSchema={validationSchema}
      >
        {(formProps) => {
          const { dirty, errors, touched, isSubmitting } = formProps;
          const isError = (field) => touched[field] && Boolean(errors[field]);
          return (
            <Form>
              <Stack tokens={{ childrenGap: 16 }}>
                {formData?.formSchema?.map((field, index) => {
                  const { inputProps, onRenderTop, onRenderBottom } = field;
                  return (
                    <Stack.Item key={index}>
                      {onRenderTop && onRenderTop(formProps)}
                      <Field
                        component={InputComponent}
                        {...inputProps}
                        invalid={isError(inputProps.name)}
                        errorMessage={errors[inputProps.name]}
                      />
                      {onRenderBottom && onRenderBottom(formProps)}
                    </Stack.Item>
                  );
                })}
                <Text block variant="small" styles={errorTextStyles}>
                  {errors?._summary_}
                </Text>
                <Stack.Item>
                  <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 8 }} styles={stackFooterStyles}>
                    {isSubmitting && <Spinner label="Saving..." ariaLive="assertive" labelPosition="left" />}
                    {isCancel && (
                      <DefaultButton text={formData?.cancleBtnName} onClick={onToggle} styles={largeButtonStyles} />
                    )}
                    <PrimaryButton
                      text={formData?.submitBtnName}
                      type="submit"
                      disabled={(noSame && !dirty) || isSubmitting}
                      styles={largeButtonStyles}
                    />
                  </Stack>
                </Stack.Item>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </CustomModal>
  );
}

ModalForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  noSame: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  isCancel: PropTypes.bool,
  formData: PropTypes.shape({
    formSchema: PropTypes.arrayOf(PropTypes.shape({})),
    formTitle: PropTypes.string,
    submitBtnName: PropTypes.string,
    cancleBtnName: PropTypes.string,
    footerContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    validateOnBlur: PropTypes.bool,
    validateOnChange: PropTypes.bool,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

ModalForm.defaultProps = {
  isCancel: false,
  noSame: true,
};
