import * as Yup from 'yup';

export const signUpSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
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
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const changePasswordSchema = Yup.object().shape({
  current_password: Yup.string().required('Current password is required'),
  new_password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required')
    .notOneOf(
      [Yup.ref('current_password')],
      'New password must be different from current password',
    ),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password')], 'Passwords must match')
    .required('Confirm password is required'),
});
