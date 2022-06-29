import * as Yup from 'yup';

const billingContactValidation = Yup.object().shape({
  email: Yup.string().email().required(),
});

export default billingContactValidation;
