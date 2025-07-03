import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";

const Order = ({ order: initialOrder }) => {
  // Sipariş durumunu state olarak yönet
  const [order, setOrder] = useState(initialOrder);
  // İşlem durumunu takip et
  const [isProcessing, setIsProcessing] = useState(false);
  // Kullanıcı bilgisini state olarak tut
  const [customer, setCustomer] = useState(null);

  // Statü seçenekleri
  const status = ["Payment", "Preparing", "On the way", "Delivered"];

  // Kullanıcı bilgisini çekme
  useEffect(() => {
    const fetchCustomer = async () => {
      if (order?.user) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${order.user}`
          );
          setCustomer(res.data);
        } catch (error) {
          console.error("Kullanıcı bilgisi getirme hatası:", error);
        }
      }
    };

    fetchCustomer();
  }, [order?.user]);

  // Durum sınıflandırma fonksiyonu
  const statusClass = (index) => {
    const currentStatus = order?.status ?? -1;
    if (index - currentStatus < 1) return "opacity-100";
    if (index - currentStatus === 1) return "animate-pulse";
    if (index - currentStatus > 1) return "opacity-50";
    return "";
  };

  // Statüyü güncelleme fonksiyonu
  const handleStatusUpdate = async () => {
    // Mevcut statü maksimum statüden küçükse
    if (order && order.status < 3) {
      setIsProcessing(true);
      try {
        // Optimistik güncelleme
        const newStatus = (order.status ?? -1) + 1;
        setOrder((prev) => ({ ...prev, status: newStatus }));

        // API çağrısı
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}`,
          { status: newStatus }
        );

        setIsProcessing(false);
      } catch (error) {
        // Hata durumunda geri al
        console.error("Statü güncelleme hatası:", error);
        // Eğer API çağrısı başarısız olursa, önceki duruma geri dön
        setOrder(initialOrder);
        setIsProcessing(false);
        alert("Statü güncellemesi başarısız oldu!");
      }
    }
  };

  // Eğer order yoksa yükleme veya hata durumu göster
  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Sipariş bulunamadı veya yüklenemedi.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-h-[calc(100vh_-_433px)] flex justify-center items-center flex-col p-10 min-w-[1000px]">
        {/* Sipariş bilgileri tablosu */}
        <div className="flex items-center flex-1 w-full max-h-28">
          <table className="w-full text-sm text-center text-gray-500">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="py-3 px-6">
                  ORDER ID
                </th>
                <th scope="col" className="py-3 px-6">
                  CUSTOMER
                </th>
                <th scope="col" className="py-3 px-6">
                  ADDRESS
                </th>
                <th scope="col" className="py-3 px-6">
                  TOTAL
                </th>
                <th scope="col" className="py-3 px-6">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="transition-all bg-secondary border-gray-700 hover:bg-primary">
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center gap-x-1 justify-center">
                  {order?._id.substring(0, 5)}...
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {customer
                    ? `${customer.name} ${customer.surname}`
                    : order?.customer}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {order?.address}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  ${order?.total}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  <button
                    onClick={handleStatusUpdate}
                    disabled={order.status >= 3 || isProcessing}
                    className={`px-4 py-2 rounded 
                      bg-green-500 hover:bg-green-600
                      text-white 
                      disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  >
                    {isProcessing ? "Processing..." : "Next Stage"}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sipariş durumu gösterimi */}
        <div className="flex justify-between w-full p-10 bg-primary mt-6">
          {/* Ödeme durumu */}
          <div
            className={`relative flex flex-col items-center ${statusClass(0)}`}
          >
            <Image
              src="/image/paid.png"
              alt="Payment"
              width={40}
              height={40}
              className="mb-2"
              objectFit="contain"
            />
            <span>{status[0]}</span>
          </div>

          {/* Hazırlanma durumu */}
          <div
            className={`relative flex flex-col items-center ${statusClass(1)}`}
          >
            <Image
              src="/image/bake.png"
              alt="Preparing"
              width={40}
              height={40}
              className="mb-2"
              objectFit="contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <span>{status[1]}</span>
          </div>

          {/* Yolda durumu */}
          <div
            className={`relative flex flex-col items-center ${statusClass(2)}`}
          >
            <Image
              src="/image/bike.png"
              alt="On the way"
              width={40}
              height={40}
              className="mb-2"
              objectFit="contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <span>{status[2]}</span>
          </div>

          {/* Teslim edildi durumu */}
          <div
            className={`relative flex flex-col items-center ${statusClass(3)}`}
          >
            <Image
              src="/image/delivered.png"
              alt="Delivered"
              width={40}
              height={40}
              className="mb-2"
              objectFit="contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <span>{status[3]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`
    );

    return {
      props: {
        order: res.data ? res.data : null,
      },
    };
  } catch (error) {
    console.error("Sipariş getirme hatası:", error);
    return {
      props: {
        order: null,
      },
    };
  }
};

export default Order;
