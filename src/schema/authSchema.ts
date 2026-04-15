import * as Yup from 'yup';

export const signUpSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone_no: Yup.string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Too short')
    .required('Phone number is required'),
});

export const loginSchema = Yup.object().shape({
  phone_no: Yup.string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Too short')
    .required('Phone number is required'),
});
