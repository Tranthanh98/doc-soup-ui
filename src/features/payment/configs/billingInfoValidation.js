import * as Yup from 'yup';

const billingInfoValidation = Yup.object().shape({
  billingInfoCity: Yup.string().nullable(),
  billingInfoName: Yup.string().label('Name').nullable().required(),
  billingInfoState: Yup.string().nullable(),
  billingInfoStreet: Yup.string().nullable(),
  billingInfoTaxId: Yup.string().nullable(),
  billingInfoZipCode: Yup.string().nullable(),
});

export default billingInfoValidation;
