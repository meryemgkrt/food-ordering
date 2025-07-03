import { useState, useEffect } from "react";
import Input from "../../components/form/LoginInput";
import Title from "../../components/ui/Title";
import { useFormik } from "formik";
import footerSchema from "../../schema/footerSchema";
import { toast } from "react-toastify";
import LoginInput from "../form/LoginInput";
import axios from "axios";

const Footer = () => {
  const [iconName, setIconName] = useState("fa fa-");
  const [linkAddress, setLinkAddress] = useState("https://");
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Footer verilerini yükle
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/footer`
        );
        if (response.data && response.data[0]) {
          setFooter(response.data[0]);
          setSocialMediaLinks(response.data[0].socialMedia || []);
        }
      } catch (err) {
        console.error("Footer fetch error:", err);
        setError(err.message || "Failed to load footer data");
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Footer güncelleme fonksiyonu
  const updateFooter = async (footerId, updatedData) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/footer/${footerId}`,
        updatedData
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Footer update error:", err);
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Update failed",
      };
    }
  };

  // Sosyal medya güncelleme fonksiyonu
  const updateSocialMedia = async (updatedSocialMedia) => {
    try {
      if (!footer?._id) {
        return { success: false, error: "Footer ID not found" };
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/footer/${footer._id}`,
        {
          ...footer,
          socialMedia: updatedSocialMedia,
        }
      );

      // Local state'i güncelle
      setFooter((prev) => ({
        ...prev,
        socialMedia: updatedSocialMedia,
      }));

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Social media update error:", err);
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Update failed",
      };
    }
  };

  // Form submit
  const onSubmit = async (values, actions) => {
    try {
      if (!footer?._id) {
        toast.error("Footer ID not found");
        return;
      }

      const updatedData = {
        location: values.location,
        email: values.email,
        phoneNumber: values.phoneNumber,
        desc: values.desc,
        openingHours: {
          day: values.day,
          hour: values.time,
        },
        socialMedia:
          socialMediaLinks.length > 0 ? socialMediaLinks : footer.socialMedia,
      };

      const result = await updateFooter(footer._id, updatedData);

      if (result.success) {
        toast.success("Footer updated successfully");
        setFooter((prev) => ({ ...prev, ...updatedData }));
      } else {
        toast.error(result.error || "Update failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while updating");
    }
  };

  // Formik
  const { values, errors, touched, handleSubmit, handleChange, handleBlur } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        location: footer?.location || "",
        email: footer?.email || "",
        phoneNumber: footer?.phoneNumber || "",
        desc: footer?.desc || "",
        day: footer?.openingHours?.day || "",
        time: footer?.openingHours?.hour || "",
      },
      onSubmit,
      validationSchema: footerSchema,
    });

  // Form inputs
  const inputs = [
    {
      id: 1,
      name: "location",
      type: "text",
      placeholder: "Your Location",
      value: values.location,
      errorMessage: errors.location,
      touched: touched.location,
    },
    {
      id: 2,
      name: "email",
      type: "text",
      placeholder: "Your Email",
      value: values.email,
      errorMessage: errors.email,
      touched: touched.email,
    },
    {
      id: 3,
      name: "phoneNumber",
      type: "number",
      placeholder: "Your Phone Number",
      value: values.phoneNumber,
      errorMessage: errors.phoneNumber,
      touched: touched.phoneNumber,
    },
    {
      id: 4,
      name: "desc",
      type: "text",
      placeholder: "Your Description",
      value: values.desc,
      errorMessage: errors.desc,
      touched: touched.desc,
    },
    {
      id: 5,
      name: "day",
      type: "text",
      placeholder: "Update Day",
      value: values.day,
      errorMessage: errors.day,
      touched: touched.day,
    },
    {
      id: 6,
      name: "time",
      type: "text",
      placeholder: "Update Time",
      value: values.time,
      errorMessage: errors.time,
      touched: touched.time,
    },
  ];

  // Sosyal medya ekleme
  const handleCreate = async (e) => {
    e.preventDefault();

    if (
      !iconName.trim() ||
      iconName === "fa fa-" ||
      !linkAddress.trim() ||
      linkAddress === "https://"
    ) {
      toast.warning("Please fill in both icon name and link address");
      return;
    }

    const newLink = {
      icon: iconName.trim(),
      link: linkAddress.trim(),
    };

    const currentSocialMedia = footer?.socialMedia || [];
    const updatedSocialMedia = [...currentSocialMedia, newLink];

    const result = await updateSocialMedia(updatedSocialMedia);

    if (result.success) {
      toast.success("Social media link added successfully");
      setSocialMediaLinks(updatedSocialMedia);
      setLinkAddress("https://");
      setIconName("fa fa-");
    } else {
      toast.error(result.error || "Failed to add social media link");
    }
  };

  // Sosyal medya silme
  const handleDeleteSocialMedia = async (indexToDelete) => {
    const currentSocialMedia = footer?.socialMedia || [];
    const updatedSocialMedia = currentSocialMedia.filter(
      (_, index) => index !== indexToDelete
    );

    const result = await updateSocialMedia(updatedSocialMedia);

    if (result.success) {
      toast.success("Social media link removed successfully");
      setSocialMediaLinks(updatedSocialMedia);
    } else {
      toast.error(result.error || "Failed to remove social media link");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-200 p-4 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading footer data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-200 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            Error loading footer data
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-200 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100 p-6 md:p-8 relative overflow-hidden">
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>

        {/* Title */}
        <div className="text-center mb-8">
          <Title className="font-bold text-3xl font-dancing text-center text-yellow-500 mb-6">
            Footer Settings
          </Title>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto mt-4 rounded-full shadow-lg"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-gray-200 relative">
              Basic Information
              <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-700"></div>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {inputs.map((input) => (
                <div
                  key={input.id}
                  className="transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <LoginInput
                    {...input}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-gray-200 relative">
              Social Media Links
              <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-700"></div>
            </h3>

            {/* Add Link Section */}
            <div className="bg-white/70 rounded-xl p-6 mb-6 border border-gray-200 shadow-inner">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-1 min-w-0">
                  <LoginInput
                    placeholder="Link Address (https://...)"
                    onChange={(e) => setLinkAddress(e.target.value)}
                    value={linkAddress}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <LoginInput
                    placeholder="Icon Name (fab fa-facebook-f)"
                    onChange={(e) => setIconName(e.target.value)}
                    value={iconName}
                  />
                </div>
                <button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex items-center gap-2 min-w-fit"
                  type="button"
                  onClick={handleCreate}
                >
                  <i className="fa fa-plus text-sm"></i>
                  Add Link
                </button>
              </div>
            </div>

            {/* Current Social Links Display */}
            {footer?.socialMedia && footer.socialMedia.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                  <i className="fa fa-link text-blue-500"></i>
                  Current Links ({footer.socialMedia.length})
                </h4>
                <div className="flex flex-wrap gap-3">
                  {footer.socialMedia.map((item, index) => (
                    <div
                      key={index}
                      className="group bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                      <div className="flex items-center justify-between gap-3">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-12 h-12 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        >
                          <i
                            className={`${item.icon} text-xl text-blue-500 hover:text-blue-600 transition-colors duration-200`}
                          ></i>
                        </a>
                        <button
                          onClick={() => handleDeleteSocialMedia(index)}
                          className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                          <i className="fa fa-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fa fa-share-alt text-2xl text-gray-400"></i>
                </div>
                <p className="text-lg font-medium text-gray-600 mb-2">
                  No social media links added yet
                </p>
                <p className="text-sm text-gray-500">
                  Add your first social media link above
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 relative overflow-hidden group"
              type="submit"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              <div className="relative flex items-center gap-3">
                <i className="fa fa-save"></i>
                Update Footer Settings
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Footer;
