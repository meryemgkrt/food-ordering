import React, { useEffect, useState } from "react";
import Title from "../ui/Title";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
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
  FaInfoCircle
} from "react-icons/fa";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getProducts();
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
                  <div key={i} className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
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
            <button className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden">
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
                      <td colSpan="5" className="py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <FaShoppingBag className="text-6xl text-gray-300 mb-4" />
                          <p className="text-xl font-semibold">No products found</p>
                          <p className="text-sm">Add your first product to get started.</p>
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
                                    <span key={idx} className="block font-bold text-green-600">
                                      ${price.toFixed(2)}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="font-bold text-xl text-green-600">
                                  ${product.prices?.toFixed(2) || '0.00'}
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
                              className="group/btn relative p-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
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
                    Product ID: #{selectedProduct._id.substring(0, 8).toUpperCase()}
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
                          <div key={index} className="flex items-center justify-between bg-white p-3 rounded-xl">
                            <span className="text-gray-600">
                              {selectedProduct.extraOptions && selectedProduct.extraOptions[index] 
                                ? selectedProduct.extraOptions[index].text 
                                : `Size ${index + 1}`}
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                              ${price.toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl">
                          <span className="text-gray-600 text-lg">Regular Price</span>
                          <span className="text-3xl font-bold text-green-600">
                            ${selectedProduct.prices?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Extra Options */}
                  {selectedProduct.extraOptions && selectedProduct.extraOptions.length > 0 && (
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-200/50">
                      <h5 className="text-lg font-bold text-gray-800 mb-4">Extra Options</h5>
                      <div className="space-y-2">
                        {selectedProduct.extraOptions.map((option, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-3 rounded-xl">
                            <span className="text-gray-700">{option.text}</span>
                            <span className="font-bold text-orange-600">+${option.price?.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <button className="group relative px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden">
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