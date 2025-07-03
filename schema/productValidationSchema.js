import * as Yup from "yup";

const productValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Başlık alanı zorunludur")
    .min(2, "Başlık en az 2 karakter olmalıdır")
    .max(50, "Başlık en fazla 50 karakter olabilir"),

  description: Yup.string()
    .trim()
    .required("Açıklama alanı zorunludur")
    .min(10, "Açıklama en az 10 karakter olmalıdır")
    .max(200, "Açıklama en fazla 200 karakter olabilir"),

  category: Yup.string().required("Kategori seçimi zorunludur"),

  prices: Yup.object().shape({
    small: Yup.number()
      .required("Küçük boy fiyatı zorunludur")
      .positive("Fiyat 0'dan büyük olmalıdır")
      .min(0.01, "Fiyat en az 0.01 olmalıdır")
      .max(9999, "Fiyat çok yüksek"),

    medium: Yup.number()
      .required("Orta boy fiyatı zorunludur")
      .positive("Fiyat 0'dan büyük olmalıdır")
      .min(0.01, "Fiyat en az 0.01 olmalıdır")
      .max(9999, "Fiyat çok yüksek"),

    large: Yup.number()
      .required("Büyük boy fiyatı zorunludur")
      .positive("Fiyat 0'dan büyük olmalıdır")
      .min(0.01, "Fiyat en az 0.01 olmalıdır")
      .max(9999, "Fiyat çok yüksek"),
  }),

  file: Yup.mixed()
    .required("Resim seçimi zorunludur")
    .test(
      "fileSize",
      "Dosya boyutu çok büyük (max 5MB)",
      (value) => !value || (value && value.size <= 5242880)
    )
    .test(
      "fileFormat",
      "Desteklenmeyen dosya formatı (sadece JPG, PNG, GIF)",
      (value) =>
        !value ||
        (value && ["image/jpeg", "image/png", "image/gif"].includes(value.type))
    ),

  extras: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required("Extra adı zorunludur"),
      price: Yup.number()
        .required("Extra fiyatı zorunludur")
        .positive("Extra fiyatı 0'dan büyük olmalıdır")
        .min(0.01, "Extra fiyatı en az 0.01 olmalıdır"),
    })
  ),
});

export default productValidationSchema;
