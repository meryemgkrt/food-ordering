import React, { useEffect } from "react";
import Title from "../ui/Title";
import LoginInput from "../form/LoginInput";
import { useFormik } from "formik";
import accountSchema from "@/schema/accountSchema";
import axios from "axios";
import { toast } from "react-toastify";

const Acount = ({ user }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: user?.address || "",
      job: user?.job || "",
      bio: user?.bio || "",
    },
    validationSchema: accountSchema,
    onSubmit: async (values, actions) => {
      if (!user || !user._id) {
        toast.error("User bilgisi alınamadı, lütfen tekrar deneyin.");
        return;
      }

      try {
        console.log("Gönderilen değerler:", values); // Gönderilen değerleri kontrol et

        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`,
          values
        );

        console.log("API yanıtı:", res.data); // API yanıtını kontrol et

        if (res.data) {
          // API'den gelen tüm veriyi kullanarak form değerlerini güncelle
          // Eğer user doğrudan res.data'da ise
          const userData = res.data.user || res.data;

          actions.setValues({
            fullName: userData.fullName || "",
            phone: userData.phone || "",
            email: userData.email || "",
            address: userData.address || "",
            job: userData.job || "",
            bio: userData.bio || "",
          });

          toast.success("Profile updated successfully!");
        }
      } catch (err) {
        console.error("Hata detayı:", err);
        toast.error("Profile update failed!");
      }
    },
  });

  // useEffect ile localStorage'dan değerleri yükle
  useEffect(() => {
    const savedValues = localStorage.getItem("profileFormValues");
    if (savedValues) {
      try {
        const parsedValues = JSON.parse(savedValues);
        // Formik değerlerini güncelle
        formik.setValues({
          ...formik.values,
          ...parsedValues,
        });
      } catch (error) {
        console.error("localStorage verisi parse edilemedi:", error);
      }
    }
  }, []);

  // Form değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("profileFormValues", JSON.stringify(formik.values));
  }, [formik.values]);

  const inputs = [
    {
      id: 1,
      name: "fullName",
      type: "text",
      placeholder: "Your Full Name",
      value: formik.values.fullName,
      errorMessage: formik.touched.fullName && formik.errors.fullName,
      touched: formik.touched.fullName,
    },
    {
      id: 2,
      name: "phone",
      type: "tel",
      placeholder: "Your Phone Number",
      value: formik.values.phone,
      errorMessage: formik.touched.phone && formik.errors.phone,
      touched: formik.touched.phone,
    },
    {
      id: 3,
      name: "email",
      type: "email",
      placeholder: "Your Email",
      value: formik.values.email,
      errorMessage: formik.touched.email && formik.errors.email,
      touched: formik.touched.email,
    },
    {
      id: 4,
      name: "address",
      type: "text",
      placeholder: "Your Address",
      value: formik.values.address,
      errorMessage: formik.touched.address && formik.errors.address,
      touched: formik.touched.address,
    },
    {
      id: 5,
      name: "job",
      type: "text",
      placeholder: "Your Job",
      value: formik.values.job,
      errorMessage: formik.touched.job && formik.errors.job,
      touched: formik.touched.job,
    },
    {
      id: 6,
      name: "bio",
      type: "text",
      placeholder: "Your Bio",
      value: formik.values.bio,
      errorMessage: formik.touched.bio && formik.errors.bio,
      touched: formik.touched.bio,
    },
  ];

  // Form değerlerini izleme
  console.log("Mevcut form değerleri:", formik.values);

  return (
    <form className="flex-1" onSubmit={formik.handleSubmit}>
      <div className="p-8">
        <Title className="text-[32px] md:text-[40px] text-primary font-bold font-dancing">
          Account Information
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {inputs.map((input) => (
            <LoginInput
              key={input.id}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={input.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={input.errorMessage}
              touched={input.touched}
            />
          ))}
        </div>
        <div className="flex justify-start mt-6">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-all w-full md:w-auto"
          >
            Update
          </button>
        </div>
      </div>
    </form>
  );
};

export default Acount;
