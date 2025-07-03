import * as Yup from 'yup';

const adminSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'User name must be at least 3 characters') // Minimum uzunluk kontrolü
    .max(20, 'User name must be at most 20 characters') // Maksimum uzunluk kontrolü
    .matches(/^[a-zA-Z0-9_]+$/, 'User name can only contain letters, numbers, and underscores') // Özel regex kontrolü
    .required('User name is required'), // Zorunlu alan
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters') // Minimum uzunluk kontrolü
   
});

export default adminSchema;
