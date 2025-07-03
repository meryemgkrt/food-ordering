import React, { useEffect, useState } from "react";

const Title = ({ children, className }) => (
  <h1 className={className}>{children}</h1>
);

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data - gerçek uygulamada API'den gelecek
  const mockOrders = [
    {
      _id: "64f8b2a3c4d5e6f7g8h9i0j1",
      address: "123 Main St, Istanbul",
      createdAt: "2024-01-15T10:30:00Z",
      total: 45.5,
      status: "Delivered",
      items: [
        { name: "Margherita Pizza", size: "Large", price: 18.5, quantity: 1 },
        { name: "Coca Cola", size: "500ml", price: 3.5, quantity: 2 },
      ],
    },
    {
      _id: "64f8b2a3c4d5e6f7g8h9i0j2",
      address: "456 Oak Ave, Ankara",
      createdAt: "2024-01-14T14:20:00Z",
      total: 32.75,
      status: "In Progress",
      items: [
        { name: "Pepperoni Pizza", size: "Medium", price: 15.5, quantity: 1 },
        { name: "Garlic Bread", size: "Regular", price: 5.25, quantity: 1 },
      ],
    },
    {
      _id: "64f8b2a3c4d5e6f7g8h9i0j3",
      address: "789 Pine Rd, Izmir",
      createdAt: "2024-01-13T09:15:00Z",
      total: 28.9,
      status: "Pending",
      items: [
        { name: "Vegetarian Pizza", size: "Small", price: 12.5, quantity: 1 },
        { name: "Caesar Salad", size: "Large", price: 8.9, quantity: 1 },
      ],
    },
  ];

  useEffect(() => {
    // Gerçek API çağrısını simüle et
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // API çağrısı burada olacak
        // const response = await fetch('/api/orders');
        // const data = await response.json();

        // Mock data için timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: "✅",
        bgColor: "bg-emerald-50",
      },
      "in progress": {
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: "🚚",
        bgColor: "bg-amber-50",
      },
      pending: {
        color: "bg-rose-100 text-rose-700 border-rose-200",
        icon: "⏳",
        bgColor: "bg-rose-50",
      },
    };
    return configs[status.toLowerCase()] || configs.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("tr-TR"),
      time: date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-amber-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Siparişler yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 to-amber-50/50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <Title className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 font-bold mb-2">
            Sipariş Geçmişi
          </Title>
          <p className="text-gray-600">
            Geçmiş siparişlerinizi görüntüleyin ve tekrar sipariş verin
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-8xl mb-6">🍕</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Henüz sipariş yok
              </h3>
              <p className="text-gray-500 mb-6">
                İlk siparişinizi vermek için menüyü inceleyin!
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105">
                Menüye Git
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              const dateTime = formatDate(order.createdAt);

              return (
                <div
                  key={order._id}
                  onClick={() => handleOrderClick(order)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Sol taraf - Sipariş bilgileri */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-orange-600 font-bold text-lg">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}
                            >
                              <span>{statusConfig.icon}</span>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-lg">📍</span>
                            <span className="truncate">{order.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-lg">📅</span>
                            <div>
                              <span>{dateTime.date}</span>
                              <span className="text-gray-400 ml-1">
                                {dateTime.time}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">💰</span>
                            <span className="font-bold text-green-600 text-lg">
                              ₺{order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sağ taraf - Aksiyon butonu */}
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm text-gray-500 hidden sm:block">
                          <p>Detay için tıklayın</p>
                          <p className="text-xs">👆 Tekrar sipariş</p>
                        </div>
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-bold">›</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alt çizgi animasyonu */}
                  <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-400 transform scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sipariş Detay Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 relative">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      Sipariş Detayları
                    </h2>
                    <p className="text-orange-100 font-mono">
                      #{selectedOrder._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                  >
                    <span className="text-white text-xl font-bold">×</span>
                  </button>
                </div>
                <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-orange-600 to-amber-600"></div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Durum ve Temel Bilgiler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">📍</span>
                      <h4 className="font-semibold text-gray-800">
                        Teslimat Adresi
                      </h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedOrder.address}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">📅</span>
                      <h4 className="font-semibold text-gray-800">
                        Sipariş Tarihi
                      </h4>
                    </div>
                    <p className="text-gray-700">
                      {formatDate(selectedOrder.createdAt).date}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedOrder.createdAt).time}
                    </p>
                  </div>
                </div>

                {/* Sipariş Durumu */}
                <div className="mb-6">
                  <div
                    className={`rounded-xl p-4 border ${
                      getStatusConfig(selectedOrder.status).bgColor
                    } ${getStatusConfig(selectedOrder.status)
                      .color.replace("text-", "border-")
                      .replace("bg-", "border-")}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getStatusConfig(selectedOrder.status).icon}
                        </span>
                        <div>
                          <h4 className="font-semibold">Sipariş Durumu</h4>
                          <p className="text-sm opacity-80">
                            Güncel durum bilgisi
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full font-semibold ${
                          getStatusConfig(selectedOrder.status).color
                        } border`}
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sipariş İçeriği */}
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 text-lg">
                    🍕 Sipariş İçeriği
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.size} • Adet: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₺{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₺{item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Fiyat Özeti */}
                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ara Toplam:</span>
                        <span className="font-medium">
                          ₺{calculateSubtotal(selectedOrder.items).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Teslimat Ücreti:</span>
                        <span className="font-medium">
                          ₺
                          {(
                            selectedOrder.total -
                            calculateSubtotal(selectedOrder.items)
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                        <span>Toplam:</span>
                        <span className="text-green-600">
                          ₺{selectedOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Kapat
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg">
                    Tekrar Sipariş Ver
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
