import { Stack, TextField } from '@fluentui/react';
import { CustomButton, CustomModal } from 'features/shared/components';
import { error, success } from 'features/shared/components/ToastMessage';
import RestService from 'features/shared/services/restService';
import { Form, Formik } from 'formik';
import React, { useContext } from 'react';
import GlobalContext from 'security/GlobalContext';
import PropTypes from 'prop-types';
import billingContactValidation from '../configs/billingContactValidation';

export default function AddBillingContactModal({ isOpen, onToggle, billingContactEmail, onRefresh }) {
  const { getToken } = useContext(GlobalContext);

  const _handleAddBillingContact = (values, formSchema) => {
    formSchema.setSubmitting(true);

    new RestService()
      .setPath('/billing/billing-contact')
      .setToken(getToken())
      .post(values)
      .then(() => {
        success('Add billing contact successful');
        onToggle();

        if (typeof onRefresh === 'function') {
          onRefresh();
        }
      })
      .catch((err) => error(err.message))
      .finally(() => formSchema.setSubmitting(false));
  };

  return (
    <CustomModal title="Add your billing contact" isOpen={isOpen} onDismiss={onToggle}>
      <Formik
        validationSchema={billingContactValidation}
        initialValues={{
          email: billingContactEmail,
        }}
        enableReinitialize
        onSubmit={_handleAddBillingContact}
      >
        {({ values, errors, isValid, isSubmitting, handleSubmit, handleChange }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <TextField
                value={values.email}
                onChange={handleChange}
                name="email"
                label="Email"
                errorMessage={errors.email}
                styles={{ root: { width: 330 } }}
              />
              <Stack horizontal horizontalAlign="end" styles={{ root: { marginTop: 36 } }} tokens={{ childrenGap: 12 }}>
                <CustomButton text="Cancel" onClick={onToggle} size="large" />
                <CustomButton disabled={isSubmitting || !isValid} text="Add" primary type="submit" size="large" />
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </CustomModal>
  );
}

AddBillingContactModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  billingContactEmail: PropTypes.string,
  onRefresh: PropTypes.func,
};

AddBillingContactModal.defaultProps = {
  billingContactEmail: undefined,
  onRefresh: undefined,
};
