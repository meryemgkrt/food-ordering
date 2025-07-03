import React, { useState, useEffect } from "react";

// Mock LoginInput component
const LoginInput = ({ className, ...props }) => (
  <input className={className} {...props} />
);

// Mock components - replace with your actual components
const Title = ({ children, className }) => (
  <h1 className={className}>{children}</h1>
);

// Mock schema - replace with your actual schema
const reservationSchema = {
  validate: (values) => {
    const errors = {};
    if (!values.fullName) errors.fullName = "Name is required";
    if (!values.email) errors.email = "Email is required";
    if (!values.phoneNumber) errors.phoneNumber = "Phone is required";
    if (!values.persons) errors.persons = "Number of persons is required";
    if (!values.date) errors.date = "Date is required";
    return errors;
  },
};

// Simple formik mock
const useFormik = ({ initialValues, onSubmit, validationSchema }) => {
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
    const newErrors = validationSchema.validate(values);
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validationSchema.validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values, { resetForm: () => setValues(initialValues) });
    }
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

const Reservation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values, actions) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    actions.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      persons: "",
      date: "",
    },
    onSubmit,
    validationSchema: reservationSchema,
  });

  const inputs = [
    {
      id: 1,
      name: "fullName",
      type: "text",
      placeholder: "Enter your full name",
      value: formik.values.fullName,
      icon: "👤",
    },
    {
      id: 2,
      name: "phoneNumber",
      type: "tel",
      placeholder: "Enter your phone number",
      value: formik.values.phoneNumber,
      icon: "📞",
    },
    {
      id: 3,
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      value: formik.values.email,
      icon: "✉️",
    },
    {
      id: 4,
      name: "persons",
      type: "number",
      placeholder: "Number of guests",
      value: formik.values.persons,
      icon: "👥",
    },
    {
      id: 5,
      name: "date",
      type: "datetime-local",
      placeholder: "Select date and time",
      value: formik.values.date,
      icon: "📅",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-2 sm:py-4 lg:py-6">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-3 sm:mb-4 lg:mb-6">
          <Title className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Book A Table
          </Title>
          <div className="w-8 sm:w-12 lg:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-1 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 h-auto lg:h-[calc(100vh-200px)] min-h-[500px] lg:min-h-[600px]">
          {/* Form Section */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl border border-gray-100 p-3 sm:p-4 lg:p-6 h-full flex flex-col">
              <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
                Reservation Details
              </h3>

              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col flex-grow"
              >
                <div className="space-y-2 sm:space-y-3 lg:space-y-4 flex-grow">
                  {inputs.map((input) => (
                    <div key={input.id} className="relative group">
                      <div className="relative">
                        <span className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm lg:text-base z-10">
                          {input.icon}
                        </span>
                        <LoginInput
                          {...input}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full h-9 sm:h-10 lg:h-12 pl-7 sm:pl-9 lg:pl-10 pr-3 sm:pr-4 rounded-md sm:rounded-lg border-2 transition-all duration-300 
                            bg-gray-50 focus:bg-white placeholder-gray-400 text-gray-700 text-xs sm:text-sm lg:text-base
                            focus:outline-none focus:ring-0 focus:scale-[1.01] focus:shadow-md
                            ${
                              formik.touched[input.name] &&
                              formik.errors[input.name]
                                ? "border-red-400 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-400 hover:border-gray-300"
                            }`}
                        />
                        {formik.touched[input.name] &&
                          formik.errors[input.name] && (
                            <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                              <span className="text-red-500 text-xs sm:text-sm">
                                ⚠️
                              </span>
                            </div>
                          )}
                      </div>

                      {formik.touched[input.name] &&
                        formik.errors[input.name] && (
                          <div className="flex items-center mt-0.5 sm:mt-1 text-red-500 text-xs animate-pulse">
                            <span className="mr-1">•</span>
                            {formik.errors[input.name]}
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                <div className="pt-3 sm:pt-4 lg:pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full h-9 sm:h-10 lg:h-12 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm lg:text-base text-white transition-all duration-300 
                      ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:scale-[1.02] hover:shadow-lg active:scale-95"
                      } 
                      transform focus:outline-none focus:ring-4 focus:ring-blue-200`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Booking...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                        <span>Book Now</span>
                        <span className="text-xs sm:text-sm">🍽️</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="flex-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl border border-gray-100 p-3 sm:p-4 lg:p-6 h-full flex flex-col">
              <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
                Find Us Here
              </h3>

              <div className="relative overflow-hidden rounded-md sm:rounded-lg shadow-lg flex-grow">
                {/* Mobile: Clickable Map Link */}
                <div className="block sm:hidden h-full">
                  <a
                    href="https://maps.google.com/?q=Aydın,+Efeler"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full min-h-[150px] sm:min-h-[200px] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-md border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md flex flex-col items-center justify-center text-center p-3">
                      <div className="text-xl sm:text-2xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                        🗺️
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5 sm:mb-1">
                        View on Google Maps
                      </h4>
                      <p className="text-xs text-gray-600 mb-1 sm:mb-2">
                        📍 Aydın, Efeler
                      </p>
                      <div className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500 text-white rounded-full text-xs font-medium group-hover:bg-blue-600 transition-colors duration-300">
                        <span>Open Maps</span>
                        <svg
                          className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Tablet/Desktop: Embedded Map */}
                <div className="hidden sm:block h-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50416.757156092805!2d27.847416550000002!3d37.835778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b92b6627dced2f%3A0xcca12f1bcb3b322e!2zQXlkxLFuLCBFZmVsZXIvQXlkxLFu!5e0!3m2!1str!2str!4v1735823288955!5m2!1str!2str"
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      minHeight: "250px",
                    }}
                    className="rounded-lg"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-white bg-opacity-90 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-2 shadow-md">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      📍 Aydın, Efeler
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="mt-2 sm:mt-3 lg:mt-4 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md sm:rounded-lg">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span>🕐</span>
                    <span>Open Daily</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <span>📞</span>
                    <span>Call for Info</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
