import * as Yup from "yup";

const registerValidationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Ad en az 2 karakter olmalıdır")
    .max(50, "Ad en fazla 50 karakter olmalıdır")
    .matches(/^[a-zA-ZğüşıöçĞÜŞIÖÇ\s]+$/, "Ad sadece harf içermelidir")
    .required("Ad Soyad gereklidir"),

  email: Yup.string()
    .email("Geçerli bir email adresi girin")
    .required("Email gereklidir"),

  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .matches(/[A-Z]/, "Şifre en az bir büyük harf içermelidir")
    .matches(/[0-9]/, "Şifre en az bir rakam içermelidir")
    .required("Şifre gereklidir"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
    .required("Şifre onayı gereklidir"),
});

export default registerValidationSchema;
