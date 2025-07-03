import React, { useEffect, useState } from "react";
import Title from "../ui/Title";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, FieldArray } from "formik";
import productValidationSchema from "../../schema/productValidationSchema";
import {
  FaEye,
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaShoppingBag,
  FaMoneyBillWave,
  FaTag,
  FaStar,
  FaClock,
  FaInfoCircle,
  FaUpload,
  FaImage,
} from "react-icons/fa";

const Product = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add Product Modal States
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      setProducts(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
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

  // Navigate to Add Product page
  const handleAddProductClick = () => {
    setShowAddModal(true);
  };

  // Add Product Submit Handler
  const handleAddProduct = async (values, { setSubmitting, resetForm }) => {
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
      setShowAddModal(false);

      // Refresh products list
      getProducts();
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

  const productClear = async (id) => {
    try {
      if (confirm("Are you sure you want to delete this product?")) {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
        );

        if (res.status === 200) {
          toast.success("Product deleted successfully!");
          getProducts();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting product");
    }
  };

  const handleProductDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setImageSrc(null);
    setFile(null);
  };

  useEffect(() => {
    getProducts();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-purple-500 rounded-2xl mx-auto mb-4 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-64 mx-auto animate-pulse"></div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-purple-500 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-all duration-300">
              <FaShoppingBag className="text-2xl text-white" />
            </div>

            <Title className="text-4xl md:text-5xl text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text font-bold font-dancing mb-4">
              Product Management
            </Title>

            <p className="text-gray-600 text-lg">
              Manage your restaurant menu and products
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Add Product Button */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={handleAddProductClick}
              className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative z-10 flex items-center space-x-2">
                <FaPlus className="text-lg" />
                <span>Add New Product</span>
              </div>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 p-6">
              <h3 className="text-white font-bold text-2xl flex items-center">
                <FaShoppingBag className="mr-3" />
                Products ({products.length})
              </h3>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-bold uppercase tracking-wide">
                      Image
                    </th>
                    <th className="py-4 px-6 text-left font-bold uppercase tracking-wide">
                      Product ID
                    </th>
                    <th className="py-4 px-6 text-left font-bold uppercase tracking-wide">
                      Title
                    </th>
                    <th className="py-4 px-6 text-left font-bold uppercase tracking-wide">
                      Price
                    </th>
                    <th className="py-4 px-6 text-center font-bold uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <FaShoppingBag className="text-6xl text-gray-300 mb-4" />
                          <p className="text-xl font-semibold">
                            No products found
                          </p>
                          <p className="text-sm">
                            Add your first product to get started.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((product, index) => (
                      <tr
                        key={product._id}
                        className={`transition-all duration-300 border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-lg group ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        {/* Product Image */}
                        <td className="py-6 px-6">
                          <div className="flex justify-center">
                            <div className="relative group/img">
                              <Image
                                src={product.img}
                                width={60}
                                height={60}
                                alt={product.title}
                                className="rounded-2xl object-cover shadow-lg group-hover/img:scale-110 transition-transform duration-300 border-2 border-white"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          </div>
                        </td>

                        {/* Product ID */}
                        <td className="py-6 px-6">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-primary rounded-full mr-3 group-hover:animate-pulse"></div>
                            <span className="font-mono text-gray-700 group-hover:text-primary transition-colors font-semibold">
                              #{product._id.substring(0, 8).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Product Title */}
                        <td className="py-6 px-6">
                          <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors">
                            <FaTag className="text-purple-500 mr-2" />
                            <span className="font-bold text-lg truncate max-w-xs">
                              {product.title}
                            </span>
                          </div>
                        </td>

                        {/* Product Price */}
                        <td className="py-6 px-6">
                          <div className="flex items-center">
                            <FaMoneyBillWave className="text-green-500 mr-2" />
                            <div className="flex flex-col">
                              {Array.isArray(product.prices) ? (
                                <div className="space-y-1">
                                  {product.prices.map((price, idx) => (
                                    <span
                                      key={idx}
                                      className="block font-bold text-green-600"
                                    >
                                      ${price.toFixed(2)}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="font-bold text-xl text-green-600">
                                  ${product.prices?.toFixed(2) || "0.00"}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-6 px-6">
                          <div className="flex items-center justify-center space-x-3">
                            {/* View Details Button */}
                            <button
                              onClick={() => handleProductDetails(product)}
                              className="group/btn relative p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                              title="View Product Details"
                            >
                              <FaEye className="text-lg group-hover/btn:scale-110 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                            </button>

                            {/* Edit Button */}
                            <button
                              className="group/btn relative p-3 bg-gradient-to-r from-primary to-yellow-500 text-white rounded-xl hover:from-yellow-500 hover:to-primary transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                              title="Edit Product"
                            >
                              <FaEdit className="text-lg group-hover/btn:scale-110 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => productClear(product._id)}
                              className="group/btn relative p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-pink-500 hover:to-red-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                              title="Delete Product"
                            >
                              <FaTrash className="text-lg group-hover/btn:scale-110 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <FaPlus className="mr-3" />
                    Add New Product
                  </h3>
                  <p className="text-white/80 mt-1">
                    Create a new product for your menu
                  </p>
                </div>
                <button
                  onClick={closeAddModal}
                  className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
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
                onSubmit={handleAddProduct}
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
                          <div className="text-gray-500 py-3">
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
                            {errors.prices?.[size] &&
                              touched.prices?.[size] && (
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
                                    push({
                                      text: extraText,
                                      price: extraPrice,
                                    });
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
                        onClick={closeAddModal}
                        className="px-6 py-3 bg-gray-500 text-white rounded-2xl font-bold transition-all duration-300 hover:bg-gray-600 transform hover:scale-105"
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
      )}

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <FaEye className="mr-3" />
                    Product Details
                  </h3>
                  <p className="text-white/80 mt-1">
                    Product ID: #
                    {selectedProduct._id.substring(0, 8).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="space-y-6">
                  <div className="relative group">
                    <Image
                      src={selectedProduct.img}
                      width={400}
                      height={300}
                      alt={selectedProduct.title}
                      className="w-full h-80 object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200/50">
                      <div className="flex items-center space-x-3">
                        <FaStar className="text-yellow-500 text-xl" />
                        <div>
                          <p className="text-sm text-gray-600">Rating</p>
                          <p className="font-bold text-gray-800">4.8/5</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200/50">
                      <div className="flex items-center space-x-3">
                        <FaClock className="text-green-500 text-xl" />
                        <div>
                          <p className="text-sm text-gray-600">Prep Time</p>
                          <p className="font-bold text-gray-800">15-20 min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                  {/* Title and Category */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200/50">
                    <h4 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                      <FaTag className="text-purple-500 mr-3" />
                      {selectedProduct.title}
                    </h4>
                    {selectedProduct.category && (
                      <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedProduct.category}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {selectedProduct.desc && (
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200/50">
                      <h5 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <FaInfoCircle className="text-blue-500 mr-2" />
                        Description
                      </h5>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedProduct.desc}
                      </p>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50">
                    <h5 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaMoneyBillWave className="text-green-500 mr-2" />
                      Pricing
                    </h5>
                    <div className="space-y-3">
                      {Array.isArray(selectedProduct.prices) ? (
                        selectedProduct.prices.map((price, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white p-3 rounded-xl"
                          >
                            <span className="text-gray-600">
                              {index === 0
                                ? "Small"
                                : index === 1
                                ? "Medium"
                                : "Large"}
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                              ${price.toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl">
                          <span className="text-gray-600 text-lg">
                            Regular Price
                          </span>
                          <span className="text-3xl font-bold text-green-600">
                            ${selectedProduct.prices?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Extra Options */}
                  {selectedProduct.extras &&
                    selectedProduct.extras.length > 0 && (
                      <div className="bg-gradient-to-br from-primary/5 to-yellow-50 p-6 rounded-2xl border border-primary/20">
                        <h5 className="text-lg font-bold text-gray-800 mb-4">
                          Extra Options
                        </h5>
                        <div className="space-y-2">
                          {selectedProduct.extras.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white p-3 rounded-xl"
                            >
                              <span className="text-gray-700">
                                {option.text}
                              </span>
                              <span className="font-bold text-primary">
                                +${option.prices?.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <button className="group relative px-8 py-3 bg-gradient-to-r from-primary to-yellow-500 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="relative z-10 flex items-center space-x-2">
                    <FaEdit className="text-lg" />
                    <span>Edit Product</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    closeModal();
                    productClear(selectedProduct._id);
                  }}
                  className="group relative px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="relative z-10 flex items-center space-x-2">
                    <FaTrash className="text-lg" />
                    <span>Delete Product</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
