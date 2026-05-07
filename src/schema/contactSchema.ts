import * as Yup from 'yup';

export const contactSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone_number: Yup.string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Too short')
    .required('Phone number is required'),
  message: Yup.string().required('Message is required'),
});

export const feedbackSchema = Yup.object().shape({
  message: Yup.string().required('Message is required'),
});
