import { Stack, TextField } from '@fluentui/react';
import { CustomButton, CustomModal } from 'features/shared/components';
import { Form, Formik } from 'formik';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import { error, success } from 'features/shared/components/ToastMessage';
import billingInfoValidation from '../configs/billingInfoValidation';

export default function InvoiceBillingInfoModal({
  isOpen,
  onToggle,
  billingInfoCity,
  billingInfoName,
  billingInfoState,
  billingInfoStreet,
  billingInfoTaxId,
  billingInfoZipCode,
  onRefresh,
}) {
  const { getToken } = useContext(GlobalContext);

  const _handleAddBillingInfo = (values, formSchema) => {
    formSchema.setSubmitting(true);

    new RestService()
      .setPath('/billing/invoice-billing-info')
      .setToken(getToken())
      .post(values)
      .then(() => {
        success('Invoice billing info successful');
        onToggle();

        if (typeof onRefresh === 'function') {
          onRefresh();
        }
      })
      .catch((err) => error(err.message))
      .finally(() => formSchema.setSubmitting(false));
  };

  return (
    <CustomModal title="Add your billing info" isOpen={isOpen} onDismiss={onToggle}>
      <Formik
        validationSchema={billingInfoValidation}
        initialValues={{
          billingInfoCity,
          billingInfoName,
          billingInfoState,
          billingInfoStreet,
          billingInfoTaxId,
          billingInfoZipCode,
        }}
        enableReinitialize
        onSubmit={_handleAddBillingInfo}
      >
        {({ values, errors, isValid, isSubmitting, handleSubmit, handleChange }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Stack tokens={{ childrenGap: 12 }}>
                <TextField
                  value={values.billingInfoName}
                  onChange={handleChange}
                  name="billingInfoName"
                  label="Name"
                  errorMessage={errors.billingInfoName}
                  styles={{ root: { width: 330 } }}
                />
                <TextField
                  value={values.billingInfoStreet}
                  onChange={handleChange}
                  name="billingInfoStreet"
                  label="Street"
                  errorMessage={errors.billingInfoStreet}
                  styles={{ root: { width: 330 } }}
                />
                <TextField
                  value={values.billingInfoCity}
                  onChange={handleChange}
                  name="billingInfoCity"
                  label="City"
                  errorMessage={errors.billingInfoCity}
                  styles={{ root: { width: 330 } }}
                />
                <TextField
                  value={values.billingInfoState}
                  onChange={handleChange}
                  name="billingInfoState"
                  label="State"
                  errorMessage={errors.billingInfoState}
                  styles={{ root: { width: 330 } }}
                />
                <TextField
                  value={values.billingInfoZipCode}
                  onChange={handleChange}
                  name="billingInfoZipCode"
                  label="Zip"
                  errorMessage={errors.billingInfoZipCode}
                  styles={{ root: { width: 330 } }}
                />
                <TextField
                  value={values.billingInfoTaxId}
                  onChange={handleChange}
                  name="billingInfoTaxId"
                  label="Tax ID"
                  errorMessage={errors.billingInfoTaxId}
                  styles={{ root: { width: 330 } }}
                />
              </Stack>
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

InvoiceBillingInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
  billingInfoCity: PropTypes.string,
  billingInfoName: PropTypes.string,
  billingInfoState: PropTypes.string,
  billingInfoStreet: PropTypes.string,
  billingInfoTaxId: PropTypes.string,
  billingInfoZipCode: PropTypes.string,
};

InvoiceBillingInfoModal.defaultProps = {
  billingInfoCity: null,
  billingInfoName: null,
  billingInfoState: null,
  billingInfoStreet: null,
  billingInfoTaxId: null,
  billingInfoZipCode: null,
  onRefresh: undefined,
};
