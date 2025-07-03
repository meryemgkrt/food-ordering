import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import productValidationSchema from "../../schema/productValidationSchema";
import Title from "../ui/Title";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaTimes,
  FaTag,
  FaInfoCircle,
  FaMoneyBillWave,
  FaUpload,
  FaImage,
} from "react-icons/fa";

const AddProduct = ({ setIsProductModal }) => {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );

        const categoryTitles = res?.data.map((category) => category.title);
        setCategories(categoryTitles || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        const defaultCategories = ["pizza", "burger", "salad", "drink"];
        setCategories(defaultCategories);
        toast.error("Categories could not be loaded!");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // File Change Handler
  const handleFileChange = (e, setFieldValue) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setFile(selectedFile);
        setFieldValue("file", selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Cloudinary Upload
  const handleUploadToCloudinary = async (file) => {
    if (!file) {
      throw new Error("Please select an image");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "food-files");
    formData.append("cloud_name", "duibvimj5");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duibvimj5/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  // Submit Handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setIsLoading(true);
      setSubmitting(true);

      // Upload image to Cloudinary
      const imageUrl = await handleUploadToCloudinary(values.file);

      // Prepare product data
      const newProduct = {
        title: values.title,
        desc: values.description,
        prices: [
          parseFloat(values.prices.small),
          parseFloat(values.prices.medium),
          parseFloat(values.prices.large),
        ],
        category: values.category.toLowerCase(),
        img: imageUrl,
        extras: values.extras.map((extra) => ({
          text: extra.text,
          prices: parseFloat(extra.price),
        })),
      };

      // Send data to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        newProduct
      );

      // Success notification
      toast.success("Product added successfully!");

      // Reset form and close modal
      resetForm();
      setImageSrc(null);
      setFile(null);
      setIsProductModal(false);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        `Product creation failed: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 p-6 rounded-t-3xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <Title className="text-2xl font-bold text-white flex items-center mb-2 font-dancing">
                <FaPlus className="mr-3" />
                Add New Product
              </Title>
              <p className="text-white/80">
                Create a new product for your menu
              </p>
            </div>
            <button
              onClick={() => setIsProductModal(false)}
              className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          <Formik
            initialValues={{
              title: "",
              description: "",
              category:
                categories.length > 0 ? categories[0].toLowerCase() : "",
              prices: {
                small: "",
                medium: "",
                large: "",
              },
              extras: [],
              extraText: "",
              extraPrice: "",
              file: null,
            }}
            validationSchema={productValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Image Upload */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200/50">
                  <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaImage className="text-purple-500 mr-2" />
                    Product Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="relative group cursor-pointer">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                        className="hidden"
                        accept="image/*"
                      />
                      <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                        <FaUpload className="text-lg" />
                        <span>Choose Image</span>
                      </div>
                    </label>
                    {imageSrc && (
                      <div className="relative group">
                        <img
                          src={imageSrc}
                          alt="Preview"
                          className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                  </div>
                  {errors.file && touched.file && (
                    <div className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.file}
                    </div>
                  )}
                </div>

                {/* Title and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200/50">
                    <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <FaTag className="text-blue-500 mr-2" />
                      Product Title
                    </label>
                    <Field
                      type="text"
                      name="title"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter product title"
                    />
                    {errors.title && touched.title && (
                      <div className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.title}
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200/50">
                    <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <FaInfoCircle className="text-purple-500 mr-2" />
                      Category
                    </label>
                    {isLoadingCategories ? (
                      <div className="text-gray-500 py-3 flex items-center">
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading categories...
                      </div>
                    ) : (
                      <Field
                        as="select"
                        name="category"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat.toLowerCase()}>
                            {cat}
                          </option>
                        ))}
                      </Field>
                    )}
                    {errors.category && touched.category && (
                      <div className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.category}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50">
                  <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <FaInfoCircle className="text-green-500 mr-2" />
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows="4"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:border-green-500 focus:outline-none transition-colors resize-none"
                    placeholder="Enter product description"
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.description}
                    </div>
                  )}
                </div>

                {/* Prices */}
                <div className="bg-gradient-to-br from-yellow-50 to-primary/10 p-6 rounded-2xl border border-yellow-200/50">
                  <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaMoneyBillWave className="text-yellow-500 mr-2" />
                    Pricing (Small, Medium, Large)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["small", "medium", "large"].map((size) => (
                      <div key={size}>
                        <label className="block text-sm font-semibold text-gray-600 mb-2 capitalize">
                          {size}
                        </label>
                        <Field
                          type="number"
                          name={`prices.${size}`}
                          min="0"
                          step="0.01"
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:border-yellow-500 focus:outline-none transition-colors"
                          placeholder={`${size} price`}
                        />
                        {errors.prices?.[size] && touched.prices?.[size] && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.prices[size]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-200/50">
                  <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaPlus className="text-indigo-500 mr-2" />
                    Extra Options
                  </label>

                  <FieldArray name="extras">
                    {({ push, remove }) => (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <Field
                            type="text"
                            name="extraText"
                            placeholder="Extra name (e.g., Extra Cheese)"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none transition-colors"
                          />
                          <Field
                            type="number"
                            name="extraPrice"
                            min="0"
                            step="0.01"
                            placeholder="Additional price"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const extraText = values.extraText;
                              const extraPrice = values.extraPrice;
                              if (extraText && extraPrice) {
                                push({ text: extraText, price: extraPrice });
                                setFieldValue("extraText", "");
                                setFieldValue("extraPrice", "");
                              }
                            }}
                            className="group relative bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative z-10 flex items-center justify-center py-3">
                              <FaPlus className="mr-2" />
                              Add Extra
                            </div>
                          </button>
                        </div>

                        {/* Added Extras Display */}
                        {values.extras.length > 0 && (
                          <div className="space-y-2">
                            <h6 className="font-semibold text-gray-700">
                              Added Extras:
                            </h6>
                            <div className="flex flex-wrap gap-2">
                              {values.extras.map((extra, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="group flex items-center space-x-2 bg-white border-2 border-red-200 text-gray-700 px-4 py-2 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all duration-300"
                                >
                                  <span className="font-medium">
                                    {extra.text}
                                  </span>
                                  <span className="text-green-600 font-bold">
                                    +${parseFloat(extra.price).toFixed(2)}
                                  </span>
                                  <FaTimes className="text-red-500 group-hover:scale-110 transition-transform duration-300" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </FieldArray>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsProductModal(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-2xl font-bold transition-all duration-300 hover:bg-gray-600 transform hover:scale-105 shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="group relative px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center space-x-2">
                      {isSubmitting || isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <FaPlus className="text-lg" />
                          <span>Create Product</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
