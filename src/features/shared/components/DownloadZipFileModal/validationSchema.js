import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required(),
  email: Yup.string().email('Please enter a valid email address').required(),
});

export default validationSchema;
