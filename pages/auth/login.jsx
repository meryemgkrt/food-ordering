import { getSession } from "next-auth/react";
import Title from "@/components/ui/Title";
import { useFormik } from "formik";
import validationSchema from "@/schema/validationSchema";
import LoginInput from "@/components/form/LoginInput";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaSignInAlt,
  FaCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSuccessfulLogin = useCallback(
    async (email) => {
      if (redirecting) return;

      setRedirecting(true);
      try {
        console.log("🔍 Searching for user:", email);

        // API URL'ini dinamik olarak oluştur
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";
        const apiURL = `${baseURL}/users?email=${encodeURIComponent(email)}`;

        console.log("📡 API URL:", apiURL);

        const response = await fetch(apiURL);

        console.log("📥 Response status:", response.status);
        console.log("📥 Response ok:", response.ok);

        if (!response.ok) {
          if (response.status === 404) {
            console.error("❌ API endpoint not found:", apiURL);
            throw new Error(
              "API endpoint bulunamadı. /api/users endpoint'ini kontrol edin."
            );
          }
          throw new Error(`HTTP ${response.status}: API çağrısı başarısız`);
        }

        const data = await response.json();
        console.log("📥 API Response:", data);

        // API response formatını kontrol et
        let user = null;
        if (data.success && data.user) {
          // Email search response (güncellenmiş API)
          user = data.user;
          console.log("✅ User found via email search:", user);
        } else if (Array.isArray(data)) {
          // Fallback: tüm kullanıcılar listesi (eski API)
          user = data.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase()
          );
          console.log("✅ User found via array search:", user);
        } else {
          console.log("⚠️ Unexpected API response format:", data);
        }

        if (user?._id) {
          console.log("🔀 Redirecting to profile:", `/profile/${user._id}`);
          await router.push(`/profile/${user._id}`);
        } else {
          console.log("🔀 User not found, redirecting to default profile");
          await router.push("/profile");
        }
      } catch (error) {
        console.error("❌ Error finding user:", error);

        // Spesifik hata mesajları
        if (error.message.includes("API endpoint bulunamadı")) {
          toast.error("API bağlantı hatası. Lütfen sunucuyu kontrol edin.");
        } else if (error.message.includes("Failed to fetch")) {
          toast.error(
            "Ağ bağlantı hatası. İnternet bağlantınızı kontrol edin."
          );
        } else {
          toast.error(
            "Profil yükleme hatası. Varsayılan sayfaya yönlendiriliyorsunuz."
          );
        }

        await router.push("/profile");
      } finally {
        setRedirecting(false);
      }
    },
    [router, redirecting]
  );

  // Handle automatic redirect when already authenticated
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.email &&
      !loading &&
      !redirecting
    ) {
      console.log("🚀 User already authenticated, redirecting...");
      handleSuccessfulLogin(session.user.email);
    }
  }, [session, status, loading, redirecting, handleSuccessfulLogin]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/profile",
        prompt: "select_account",
      });
    } catch (error) {
      toast.error("Google giriş işlemi başarısız. Lütfen tekrar deneyin.");
      console.error("Google sign in error:", error);
    }
  };

  const onSubmit = async (values, actions) => {
    const { email, password } = values;

    if (!email.trim() || !password.trim()) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    const options = { redirect: false, email: email.trim(), password };
    setLoading(true);

    try {
      console.log("🔐 Attempting login for:", email.trim());
      const res = await signIn("credentials", options);

      if (res?.error) {
        console.error("❌ Login failed:", res.error);
        if (res.error === "CredentialsSignin") {
          toast.error("Geçersiz email veya şifre", {
            position: "top-right",
          });
        } else {
          toast.error("Giriş başarısız. Lütfen tekrar deneyin.", {
            position: "top-right",
          });
        }
      } else if (res?.ok) {
        console.log("✅ Login successful, waiting for session update...");
        toast.success("Giriş başarılı!", {
          position: "top-right",
        });

        actions.resetForm();

        // Wait for session update, then redirect
        setTimeout(async () => {
          try {
            await handleSuccessfulLogin(email.trim());
          } catch (error) {
            console.error("❌ Error in post-login redirect:", error);
            // Fallback: reload page to trigger session update
            window.location.href = "/profile";
          }
        }, 1000);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit,
    validationSchema,
  });

  const inputs = [
    {
      id: 1,
      type: "email",
      name: "email",
      placeholder: "Email adresinizi girin",
      value: formik.values.email,
      errorMessage: formik.errors.email,
      touched: formik.touched.email,
      icon: FaEnvelope,
    },
    {
      id: 2,
      type: showPassword ? "text" : "password",
      name: "password",
      placeholder: "Şifrenizi girin",
      value: formik.values.password,
      errorMessage: formik.errors.password,
      touched: formik.touched.password,
      icon: FaLock,
      showToggle: true,
    },
  ];

  // Loading state
  if (status === "loading" || redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">
              {redirecting
                ? "Profile sayfasına yönlendiriliyor..."
                : "Kimlik doğrulaması kontrol ediliyor..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center py-12 px-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Main Login Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 relative overflow-hidden">
          {/* Top gradient border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-all duration-300">
              <FaSignInAlt className="text-2xl text-white" />
            </div>

            <h1 className="font-bold text-gray-800 text-4xl mb-2">
              Tekrar Hoşgeldiniz
            </h1>
            <p className="text-gray-600 text-sm">Hesabınıza giriş yapın</p>

            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>

        

          {/* Login Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Input Fields */}
            <div className="space-y-4">
              {inputs.map((input) => (
                <div key={input.id} className="relative group">
                  <div className="relative">
                    {/* Icon */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <input.icon
                        className={`text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300 ${
                          formik.touched[input.name] &&
                          !formik.errors[input.name] &&
                          formik.values[input.name]
                            ? "text-blue-500"
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
                          ? "border-blue-500 bg-blue-50/50 focus:border-blue-500 focus:shadow-blue-200/50"
                          : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:shadow-blue-500/20"
                      }`}
                    />

                    {/* Password Toggle */}
                    {input.showToggle && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
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
                          <FaCheck className="text-blue-500 text-sm" />
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
                      <div className="mt-2 text-blue-500 text-sm font-medium flex items-center space-x-1">
                        <FaCheck className="text-xs" />
                        <span>Harika!</span>
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-blue-500 hover:text-purple-500 text-sm font-medium transition-colors duration-300 hover:underline"
              >
                Şifrenizi mi unuttunuz?
              </Link>
            </div>

            {/* Google Sign In Button */}
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
              onClick={handleGoogleSignIn}
              className="w-full py-4 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 hover:bg-gray-50 active:scale-95 flex items-center justify-center space-x-3 group"
            >
              <FcGoogle className="text-2xl group-hover:scale-110 transition-transform duration-300" />
              <span>Google ile Giriş Yap</span>
            </button>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !formik.isValid || redirecting}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform relative overflow-hidden group mt-4 ${
                loading || !formik.isValid || redirecting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
              }`}
            >
              {!loading && !redirecting && formik.isValid && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}

              <div className="relative z-10 flex items-center justify-center space-x-2">
                {loading || redirecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {redirecting
                        ? "Yönlendiriliyor..."
                        : "Giriş yapılıyor..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>Giriş Yap</span>
                    <FaSignInAlt className="text-sm ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                Hesabınız yok mu?{" "}
                <Link
                  href="/auth/register"
                  className="text-blue-500 hover:text-purple-500 font-semibold cursor-pointer transition-colors duration-300 hover:underline"
                >
                  Hesap Oluşturun
                </Link>
              </p>
            </div>
          </form>

          {/* Terms & Conditions */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100">
            <p className="text-xs text-gray-600 text-center">
              Giriş yaparak{" "}
              <a href="#" className="text-blue-500 hover:underline font-medium">
                Kullanım Şartları
              </a>{" "}
              ve{" "}
              <a href="#" className="text-blue-500 hover:underline font-medium">
                Gizlilik Politikası
              </a>
              'nı kabul etmiş olursunuz
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -top-20 -left-20 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-xl"></div>
        </div>

        {/* Bottom Info Card */}
        <div className="mt-6 bg-white/60 backdrop-blur-lg rounded-2xl p-4 border border-white/30 text-center">
          <p className="text-gray-600 text-xs flex items-center justify-center space-x-2">
            <span>🔒</span>
            <span>Güvenli giriş sistemi ve şifrelenmiş bağlantı</span>
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
            <p className="text-xs text-gray-600 font-medium">Hızlı Giriş</p>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="text-2xl mb-1">🛡️</div>
            <p className="text-xs text-gray-600 font-medium">Güvenli</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (session?.user?.email) {
    try {
      console.log("🔍 GSSP: Checking user for:", session.user.email);

      // Environment variable ile API URL oluştur
      const baseURL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const apiURL = `${baseURL}/users?email=${encodeURIComponent(
        session.user.email
      )}`;

      console.log("📡 GSSP API URL:", apiURL);

      const res = await axios.get(apiURL);

      let user = null;

      if (res.data?.success && res.data?.user) {
        // Email search response
        user = res.data.user;
      } else if (Array.isArray(res.data)) {
        // Fallback: tüm kullanıcılar listesi
        user = res.data.find(
          (u) => u.email?.toLowerCase() === session.user.email.toLowerCase()
        );
      }

      if (user?._id) {
        console.log("🔀 GSSP: Redirecting to:", `/profile/${user._id}`);
        return {
          redirect: {
            destination: `/profile/${user._id}`,
            permanent: false,
          },
        };
      } else {
        console.log("🔀 GSSP: Redirecting to default profile");
        return {
          redirect: {
            destination: `/profile`,
            permanent: false,
          },
        };
      }
    } catch (error) {
      console.error("❌ GSSP Error:", error.message);

      // 404 hatası için özel handling
      if (error.response?.status === 404) {
        console.error("❌ GSSP: API endpoint not found");
      }

      return {
        redirect: {
          destination: `/profile`,
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}

export default Login;
