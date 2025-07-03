import { getSession } from "next-auth/react";
import Title from "@/components/ui/Title";
import { useFormik } from "formik";
import registerValidationSchema from "@/schema/registerValidationSchema";
import LoginInput from "@/components/form/LoginInput";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaUserPlus,
  FaCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useState } from "react";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGoogleSignUp = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/profile",
        prompt: "select_account",
      });
    } catch (error) {
      toast.error("Google kayıt işlemi başarısız. Lütfen tekrar deneyin.");
      console.error("Google sign up error:", error);
    }
  };

  const onSubmit = async (values, actions) => {
    setLoading(true);

    try {
      console.log("📝 Attempting registration for:", values.email);
      console.log("📤 Sending data:", {
        fullName: values.fullName,
        email: values.email,
        password: "***",
        confirmPassword: "***",
      });

      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Response headers:", response.headers);

      // Response text'ini önce alalım
      const responseText = await response.text();
      console.log("📥 Raw response:", responseText);

      // JSON parse etmeyi deneyelim
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("❌ JSON Parse Error:", jsonError);
        console.error("❌ Response was:", responseText);

        // HTML error page ise
        if (
          responseText.includes("<!DOCTYPE html>") ||
          responseText.includes("<html")
        ) {
          throw new Error("Sunucu hatası oluştu. API endpoint'i kontrol edin.");
        }

        throw new Error("Geçersiz sunucu yanıtı");
      }

      console.log("📥 Parsed data:", data);

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}: Kayıt işlemi başarısız`
        );
      }

      if (data.success) {
        console.log("✅ Registration successful");
        toast.success("Hesap başarıyla oluşturuldu! Giriş yapabilirsiniz.", {
          position: "top-right",
          autoClose: 3000,
        });

        actions.resetForm();

        // 2 saniye bekleyip login sayfasına yönlendir
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        throw new Error(data.message || "Kayıt işlemi başarısız");
      }
    } catch (error) {
      console.error("❌ Registration error:", error);

      // Spesifik hata mesajlarını göster
      if (error.message.includes("API endpoint")) {
        toast.error(
          "Sunucu bağlantı hatası. /api/users/register endpoint'ini kontrol edin."
        );
      } else if (error.message.includes("Geçersiz sunucu yanıtı")) {
        toast.error("Sunucu geçersiz yanıt döndürdü. Console'u kontrol edin.");
      } else if (
        error.message.includes("email") &&
        error.message.includes("kullanılıyor")
      ) {
        toast.error(
          "Bu email adresi zaten kullanılıyor. Farklı bir email deneyin."
        );
      } else if (
        error.message.includes("şifre") ||
        error.message.includes("password")
      ) {
        toast.error("Şifre gereksinimleri karşılanmıyor.");
      } else if (error.message.includes("eşleşmiyor")) {
        toast.error("Şifreler eşleşmiyor. Kontrol edin.");
      } else {
        toast.error(
          error.message || "Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit,
  });

  const inputs = [
    {
      id: 1,
      name: "fullName",
      type: "text",
      placeholder: "Ad Soyad",
      value: formik.values.fullName,
      errorMessage: formik.errors.fullName,
      touched: formik.touched.fullName,
      icon: FaUser,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Email Adresiniz",
      value: formik.values.email,
      errorMessage: formik.errors.email,
      touched: formik.touched.email,
      icon: FaEnvelope,
    },
    {
      id: 3,
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Şifreniz",
      value: formik.values.password,
      errorMessage: formik.errors.password,
      touched: formik.touched.password,
      icon: FaLock,
      showToggle: true,
    },
    {
      id: 4,
      name: "confirmPassword",
      type: showConfirmPassword ? "text" : "password",
      placeholder: "Şifre Onayı",
      value: formik.values.confirmPassword,
      errorMessage: formik.errors.confirmPassword,
      touched: formik.touched.confirmPassword,
      icon: FaLock,
      showToggle: true,
    },
  ];

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formik.values.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center py-12 px-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Main Register Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 relative overflow-hidden">
          {/* Top gradient border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-all duration-300">
              <FaUserPlus className="text-2xl text-white" />
            </div>

            <h1 className="font-bold text-gray-800 text-4xl mb-2">
              Aramıza Katılın
            </h1>
            <p className="text-gray-600 text-sm">
              Başlamak için hesabınızı oluşturun
            </p>

            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 mx-auto mt-4 rounded-full"></div>
          </div>

          

          {/* Register Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Input Fields */}
            <div className="space-y-4">
              {inputs.map((input) => (
                <div key={input.id} className="relative group">
                  <div className="relative">
                    {/* Icon */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <input.icon
                        className={`text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300 ${
                          formik.touched[input.name] &&
                          !formik.errors[input.name] &&
                          formik.values[input.name]
                            ? "text-orange-500"
                            : ""
                        }`}
                      />
                    </div>

                    {/* Input */}
                    <input
                      type={input.type}
                      name={input.name}
                      placeholder={input.placeholder}
                      value={input.value}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 border-2 rounded-xl transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:bg-white focus:shadow-lg ${
                        formik.touched[input.name] && formik.errors[input.name]
                          ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:shadow-red-200/50"
                          : formik.touched[input.name] &&
                            !formik.errors[input.name] &&
                            formik.values[input.name]
                          ? "border-orange-500 bg-orange-50/50 focus:border-orange-500 focus:shadow-orange-200/50"
                          : "border-gray-200 hover:border-gray-300 focus:border-orange-500 focus:shadow-orange-500/20"
                      }`}
                    />

                    {/* Password Toggle */}
                    {input.showToggle && (
                      <button
                        type="button"
                        onClick={() => {
                          if (input.name === "password") {
                            setShowPassword(!showPassword);
                          } else {
                            setShowConfirmPassword(!showConfirmPassword);
                          }
                        }}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {(
                          input.name === "password"
                            ? showPassword
                            : showConfirmPassword
                        ) ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    )}

                    {/* Success/Error icon */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {formik.touched[input.name] &&
                        formik.errors[input.name] && (
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        )}
                      {formik.touched[input.name] &&
                        !formik.errors[input.name] &&
                        formik.values[input.name] && (
                          <FaCheck className="text-orange-500 text-sm" />
                        )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {formik.touched[input.name] && formik.errors[input.name] && (
                    <div className="mt-2 text-red-500 text-sm font-medium flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{formik.errors[input.name]}</span>
                    </div>
                  )}

                  {/* Success Message */}
                  {formik.touched[input.name] &&
                    !formik.errors[input.name] &&
                    formik.values[input.name] && (
                      <div className="mt-2 text-orange-500 text-sm font-medium flex items-center space-x-1">
                        <FaCheck className="text-xs" />
                        <span>Harika!</span>
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Password Strength Indicator */}
            {formik.values.password && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 font-medium">
                    Şifre Gücü:
                  </p>
                  <span
                    className={`text-xs font-semibold ${
                      passwordStrength <= 1
                        ? "text-red-500"
                        : passwordStrength <= 2
                        ? "text-yellow-500"
                        : passwordStrength <= 3
                        ? "text-blue-500"
                        : "text-green-500"
                    }`}
                  >
                    {passwordStrength <= 1
                      ? "Zayıf"
                      : passwordStrength <= 2
                      ? "Orta"
                      : passwordStrength <= 3
                      ? "İyi"
                      : "Güçlü"}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= level
                          ? level <= 1
                            ? "bg-red-400"
                            : level <= 2
                            ? "bg-yellow-400"
                            : level <= 3
                            ? "bg-blue-400"
                            : "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  <p>
                    💡 Güçlü şifre için: En az 8 karakter, büyük harf, sayı
                    kullanın
                  </p>
                </div>
              </div>
            )}

            {/* Google Sign Up Button */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  Veya şununla devam edin
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full py-4 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 hover:bg-gray-50 active:scale-95 flex items-center justify-center space-x-3 group"
            >
              <FcGoogle className="text-2xl group-hover:scale-110 transition-transform duration-300" />
              <span>Google ile Kayıt Ol</span>
            </button>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || !formik.isValid}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform relative overflow-hidden group mt-4 ${
                loading || !formik.isValid
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-yellow-400 hover:to-orange-500 text-white hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95"
              }`}
            >
              {!loading && formik.isValid && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}

              <div className="relative z-10 flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Hesap Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <span>Hesap Oluştur</span>
                    <FaUserPlus className="text-sm ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/auth/login"
                  className="text-orange-500 hover:text-yellow-500 font-semibold cursor-pointer transition-colors duration-300 hover:underline"
                >
                  Giriş Yapın
                </Link>
              </p>
            </div>
          </form>

          {/* Terms & Conditions */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100">
            <p className="text-xs text-gray-600 text-center">
              Hesap oluşturarak{" "}
              <a
                href="#"
                className="text-orange-500 hover:underline font-medium"
              >
                Kullanım Şartları
              </a>{" "}
              ve{" "}
              <a
                href="#"
                className="text-orange-500 hover:underline font-medium"
              >
                Gizlilik Politikası
              </a>
              'nı kabul etmiş olursunuz
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-yellow-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -top-20 -left-20 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
        </div>

        {/* Bottom Info Card */}
        <div className="mt-6 bg-white/60 backdrop-blur-lg rounded-2xl p-4 border border-white/30 text-center">
          <p className="text-gray-600 text-xs flex items-center justify-center space-x-2">
            <span>🛡️</span>
            <span>Güvenli kayıt sistemi ve şifrelenmiş veri</span>
          </p>
        </div>

        {/* Security Features */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="text-2xl mb-1">🔐</div>
            <p className="text-xs text-gray-600 font-medium">256-bit SSL</p>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs text-gray-600 font-medium">Anında Aktif</p>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-xs text-gray-600 font-medium">Spam Free</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  // Eğer kullanıcı zaten giriş yapmışsa profile'a yönlendir
  if (session?.user?.email) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default Register;
