import React, { useState } from "react";

// Mock Title component
const Title = ({ children, className }) => (
  <h1 className={className}>{children}</h1>
);

// Mock Formik hook
const useFormik = ({
  initialValues,
  onSubmit,
  validationSchema,
  enableReinitialize,
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Simple validation
    const newErrors = {};
    if (name === "password" && !values.password) {
      newErrors.password = "Şifre gereklidir";
    } else if (name === "password" && values.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }

    if (
      name === "confirmPassword" &&
      values.confirmPassword !== values.password
    ) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values, { resetForm: () => setValues(initialValues) });
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};

// Mock toast
const toast = {
  success: (message) => console.log("Success:", message),
  error: (message) => console.log("Error:", message),
};

const Password = ({ user = { _id: "mock-user-id" } }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (values, actions) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Şifreler eşleşmiyor!");
      return;
    }

    if (values.password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır!");
      return;
    }

    setLoading(true);

    try {
      // Gerçek API çağrısı burada olacak
      // const response = await fetch(`/api/users/${user._id}/password`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password: values.password })
      // });

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Şifre başarıyla güncellendi!");
      actions.resetForm();
    } catch (error) {
      console.error("Şifre güncelleme hatası:", error);
      toast.error("Şifre güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit,
    enableReinitialize: true,
  });

  const inputs = [
    {
      id: 1,
      type: showPassword ? "text" : "password",
      name: "password",
      placeholder: "Yeni şifrenizi girin",
      value: formik.values.password,
      error: formik.touched.password && formik.errors.password,
      label: "Yeni Şifre",
      icon: "🔒",
      toggleShow: () => setShowPassword(!showPassword),
      showToggle: showPassword,
    },
    {
      id: 2,
      type: showConfirmPassword ? "text" : "password",
      name: "confirmPassword",
      placeholder: "Yeni şifrenizi tekrar girin",
      value: formik.values.confirmPassword,
      error: formik.touched.confirmPassword && formik.errors.confirmPassword,
      label: "Şifre Onayı",
      icon: "🔒",
      toggleShow: () => setShowConfirmPassword(!showConfirmPassword),
      showToggle: showConfirmPassword,
    },
  ];

  const isFormValid =
    formik.values.password &&
    formik.values.confirmPassword &&
    formik.values.password === formik.values.confirmPassword &&
    formik.values.password.length >= 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl text-white">🔐</span>
          </div>
          <Title className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Şifre Yönetimi
          </Title>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hesabınızın güvenliği için güçlü bir şifre belirleyin. Şifreniz en
            az 6 karakter uzunluğunda olmalıdır.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>

          <div className="p-8 md:p-12">
            {/* Password Strength Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <h3 className="flex items-center gap-2 font-semibold text-blue-800 mb-2">
                <span>💡</span>
                Güçlü Şifre Önerileri
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• En az 6 karakter uzunluğunda olmalı</li>
                <li>• Büyük ve küçük harfler içermeli</li>
                <li>• Sayılar ve özel karakterler kullanmalı</li>
                <li>• Kişisel bilgilerinizi içermemeli</li>
              </ul>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {inputs.map((input) => (
                <div key={input.id} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <span>{input.icon}</span>
                    {input.label}
                  </label>

                  <div className="relative group">
                    <input
                      type={input.type}
                      name={input.name}
                      placeholder={input.placeholder}
                      value={input.value}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`
                        w-full p-4 pr-12 border-2 rounded-xl transition-all duration-300 
                        focus:outline-none focus:ring-4 focus:ring-blue-100
                        ${
                          input.error
                            ? "border-red-400 bg-red-50 focus:border-red-500"
                            : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
                        }
                        group-hover:border-gray-300
                      `}
                    />

                    {/* Show/Hide Toggle */}
                    <button
                      type="button"
                      onClick={input.toggleShow}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {input.showToggle ? (
                        <span className="text-lg">👁️</span>
                      ) : (
                        <span className="text-lg">🙈</span>
                      )}
                    </button>
                  </div>

                  {/* Error Message */}
                  {input.error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-200">
                      <span>⚠️</span>
                      {input.error}
                    </div>
                  )}

                  {/* Password Strength Indicator */}
                  {input.name === "password" && input.value && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Şifre Gücü</span>
                        <span
                          className={`font-medium ${
                            input.value.length >= 8
                              ? "text-green-600"
                              : input.value.length >= 6
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {input.value.length >= 8
                            ? "Güçlü"
                            : input.value.length >= 6
                            ? "Orta"
                            : "Zayıf"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            input.value.length >= 8
                              ? "w-full bg-green-500"
                              : input.value.length >= 6
                              ? "w-2/3 bg-yellow-500"
                              : "w-1/3 bg-red-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Match Indicator */}
                  {input.name === "confirmPassword" && input.value && (
                    <div
                      className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                        formik.values.password === formik.values.confirmPassword
                          ? "text-green-600 bg-green-50 border border-green-200"
                          : "text-red-600 bg-red-50 border border-red-200"
                      }`}
                    >
                      <span>
                        {formik.values.password ===
                        formik.values.confirmPassword
                          ? "✅"
                          : "❌"}
                      </span>
                      {formik.values.password === formik.values.confirmPassword
                        ? "Şifreler eşleşiyor"
                        : "Şifreler eşleşmiyor"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => formik.resetForm()}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Temizle
              </button>

              <button
                type="button"
                onClick={(e) => formik.handleSubmit(e)}
                disabled={loading || !isFormValid}
                className={`
                  px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform
                  ${
                    loading || !isFormValid
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                    Güncelleniyor...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>🔒</span>
                    Şifreyi Güncelle
                  </div>
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-amber-600 text-lg mt-0.5">🔐</span>
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Güvenlik Bildirimi</p>
                  <p>
                    Şifrenizi düzenli olarak değiştirin ve kimseyle paylaşmayın.
                    Güçlü şifreler hesabınızın güvenliğini artırır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Password;
