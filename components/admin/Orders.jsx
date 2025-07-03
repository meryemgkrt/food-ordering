import React, { useEffect, useState } from "react";
import Title from "../ui/Title";
import axios from "axios";
import {
  FaEye,
  FaTruck,
  FaCheck,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTimes,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`
        );
        setOrders(res.data);
        console.log("Fetched orders:", res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatus = async (id) => {
    try {
      const item = orders.find((order) => order._id === id);

      if (!item) {
        console.error("Order not found");
        return;
      }

      // Status güncelleme mantığı
      const newStatus = item.status + 1 > 2 ? 2 : item.status + 1;

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
        { status: newStatus }
      );

      // Lokal state'i güncelle
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );

      console.log("Order status updated:", res.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case 1:
        return "bg-gradient-to-r from-blue-500 to-purple-500 text-white";
      case 2:
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 0:
        return <FaClock className="mr-2" />;
      case 1:
        return <FaTruck className="mr-2" />;
      case 2:
        return <FaCheck className="mr-2" />;
      default:
        return <FaClock className="mr-2" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Preparing";
      case 1:
        return "On the way";
      case 2:
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-blue-500 rounded-2xl mx-auto mb-4 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-64 mx-auto animate-pulse"></div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"
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
    <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-all duration-300">
              <FaShoppingBag className="text-2xl text-white" />
            </div>

            <Title className="text-4xl md:text-5xl text-transparent bg-gradient-to-r from-primary to-blue-500 bg-clip-text font-bold font-dancing mb-4">
              Order Management
            </Title>

            <p className="text-gray-600 text-lg">
              Track and manage your orders efficiently
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Orders Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 p-6">
              <h3 className="text-white font-bold text-2xl flex items-center">
                <FaUser className="mr-3" />
                Recent Orders ({orders.length})
              </h3>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-bold uppercase tracking-wide">
                      Order ID
                    </th>
                    <th className="py-4 px-6 text-left font-bold uppercase tracking-wide">
                      Image
                    </th>
                    <th className="py-4 px-6 text-left font-bold uppercase tracking-wide">
                      Address
                    </th>
                    <th className="py-4 px-6 text-left font-bold uppercase tracking-wide">
                      Date
                    </th>
                    <th className="py-4 px-6 text-left font-bold uppercase tracking-wide">
                      Total
                    </th>
                    <th className="py-4 px-6 text-left font-bold uppercase tracking-wide">
                      Status
                    </th>
                    <th className="py-4 px-6 text-center font-bold uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <FaShoppingBag className="text-6xl text-gray-300 mb-4" />
                          <p className="text-xl font-semibold">
                            No orders found
                          </p>
                          <p className="text-sm">
                            Your orders will appear here once you place them.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr
                        key={order._id}
                        className={`transition-all duration-300 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-lg group ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="py-6 px-6">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-primary rounded-full mr-3 group-hover:animate-pulse"></div>
                            <span className="font-mono text-gray-700 group-hover:text-primary transition-colors font-semibold">
                              #{order._id.substring(0, 8).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Order Image */}
                        <td className="py-6 px-6">
                          <div className="flex items-center space-x-2">
                            {order.products && order.products.length > 0 ? (
                              <>
                                {/* First product image */}
                                <div className="relative group/img">
                                  <img
                                    src={
                                      order.products[0].img ||
                                      "/default-food.jpg"
                                    }
                                    alt={order.products[0].name || "Order item"}
                                    className="w-12 h-12 object-cover rounded-lg border-2 border-white shadow-lg group-hover:scale-110 transition-all duration-300"
                                    onError={(e) => {
                                      e.target.src = "/default-food.jpg";
                                    }}
                                  />
                                  {/* Badge for multiple items */}
                                  {order.products.length > 1 && (
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                      +{order.products.length - 1}
                                    </div>
                                  )}
                                </div>

                                {/* Additional images (max 3 total visible) */}
                                {order.products.length > 1 && (
                                  <div className="flex -space-x-2">
                                    {order.products
                                      .slice(1, 3)
                                      .map((product, idx) => (
                                        <img
                                          key={idx}
                                          src={
                                            product.img || "/default-food.jpg"
                                          }
                                          alt={product.name || "Order item"}
                                          className="w-8 h-8 object-cover rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-all duration-300"
                                          onError={(e) => {
                                            e.target.src = "/default-food.jpg";
                                          }}
                                        />
                                      ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                <FaShoppingBag className="text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-6 px-6">
                          <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors">
                            <FaMapMarkerAlt className="text-primary mr-2" />
                            <span className="font-medium truncate max-w-xs">
                              {order.address}
                            </span>
                          </div>
                        </td>

                        <td className="py-6 px-6">
                          <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors">
                            <FaCalendarAlt className="text-blue-500 mr-2" />
                            <span className="font-medium">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </td>

                        <td className="py-6 px-6">
                          <div className="flex items-center">
                            <FaMoneyBillWave className="text-green-500 mr-2" />
                            <span className="font-bold text-xl text-green-600">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </td>

                        <td className="py-6 px-6">
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </span>
                        </td>

                        <td className="py-6 px-6">
                          <div className="flex items-center justify-center space-x-3">
                            {/* View Details Button */}
                            <button
                              onClick={() => handleOrderDetails(order)}
                              className="group/btn relative p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                              title="View Order Details"
                            >
                              <FaEye className="text-lg group-hover/btn:scale-110 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                            </button>

                            {/* Status Update Button */}
                            <button
                              onClick={() => handleStatus(order._id)}
                              disabled={order.status === 2}
                              className={`group/btn relative px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                order.status === 2
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-emerald-500 hover:to-green-500 hover:shadow-xl"
                              }`}
                            >
                              {order.status === 2 ? (
                                <span className="flex items-center">
                                  <FaCheck className="mr-2" />
                                  Completed
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <FaTruck className="mr-2" />
                                  Next Stage
                                </span>
                              )}

                              {order.status !== 2 && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 rounded-xl"></div>
                              )}
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

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <FaEye className="mr-3" />
                    Order Details
                  </h3>
                  <p className="text-white/80 mt-1">
                    Order ID: #{selectedOrder._id.substring(0, 8).toUpperCase()}
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
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200/50">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaMapMarkerAlt className="text-primary mr-2" />
                      Delivery Address
                    </h4>
                    <p className="text-gray-700 font-medium">
                      {selectedOrder.address}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaMoneyBillWave className="text-green-500 mr-2" />
                      Order Total
                    </h4>
                    <p className="text-3xl font-bold text-green-600">
                      ${selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200/50">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaCalendarAlt className="text-yellow-500 mr-2" />
                      Order Date
                    </h4>
                    <p className="text-gray-700 font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200/50">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      {getStatusIcon(selectedOrder.status)}
                      Current Status
                    </h4>
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.products && selectedOrder.products.length > 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200/50">
                  <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaShoppingBag className="text-primary mr-2" />
                    Order Items ({selectedOrder.products.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedOrder.products.map((product, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="flex flex-col space-y-4">
                          {/* Product Image */}
                          <div className="relative overflow-hidden rounded-xl bg-gray-100">
                            <img
                              src={product.img || "/default-food.jpg"}
                              alt={product.name || product.title}
                              className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = "/default-food.jpg";
                              }}
                            />
                            {/* Quantity Badge */}
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                              {product.quantity || 1}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="space-y-2">
                            <h5 className="font-bold text-gray-800 group-hover:text-primary transition-colors text-lg leading-tight">
                              {product.name || product.title}
                            </h5>

                            {/* Size/Extra info if available */}
                            {product.size && (
                              <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                                Size: {product.size}
                              </p>
                            )}

                            {/* Extras if available */}
                            {product.extras && product.extras.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {product.extras.map((extra, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                                  >
                                    +{extra.text}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between pt-2">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Qty: </span>
                                <span className="font-bold text-primary">
                                  {product.quantity || 1}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                  ${(product.price || 0).toFixed(2)}
                                </p>
                                {product.quantity > 1 && (
                                  <p className="text-xs text-gray-500">
                                    $
                                    {(
                                      (product.price || 0) /
                                      (product.quantity || 1)
                                    ).toFixed(2)}{" "}
                                    each
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          Order Summary
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.products.length} item
                          {selectedOrder.products.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${selectedOrder.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Total Amount</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Info */}
              {selectedOrder.customer && (
                <div className="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-200/50">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaUser className="text-indigo-500 mr-2" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-800">
                        {selectedOrder.customer.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-800">
                        {selectedOrder.customer.phoneNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
