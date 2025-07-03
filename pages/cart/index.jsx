import Title from "@/components/ui/Title";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../redux/cartSlice";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Cart = ({ userList }) => {
  const { data: session } = useSession();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const user = userList.find((user) => user.email === session?.user?.email);

  const createOrder = async () => {
    // Sepet boş ise kontrol
    if (cart.products.length === 0) {
      toast.error("Your cart is empty", {
        autoClose: 1000,
      });
      return;
    }

    // Oturum kontrolü
    if (!session) {
      toast.error("Please login first", {
        autoClose: 1000,
      });
      return;
    }

    try {
      // Sipariş nesnesi oluşturma
      const newOrder = {
        customer: user?.fullName || session.user.name,
        email: session.user.email,
        address: user?.address || "No address provided",
        total: cart.total,
        status: 0, // Durum için 0 ekledim
        method: 0, // Ödeme metodu için 0 ekledim
        products: cart.products.map((product) => ({
          title: product.title,
          price: product.price,
          quantity: product.quantity,
          extras: product.extras || [],
          img: product.img,
        })),
      };

      // Sipariş onayı
      if (confirm("Are you sure you want to place this order?")) {
        // Detaylı log ekledim
        console.log("Gönderilen Sipariş Verisi:", newOrder);

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          newOrder,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 201) {
          // Başarılı sipariş sonrası işlemler
          router.push(`/order/${res.data._id}`);
          dispatch(reset());
          toast.success("Order created successfully", {
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      // Detaylı hata loglaması
      console.error("Order creation error:", {
        response: error.response?.data,
        message: error.message,
        stack: error.stack,
      });

      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the order",
        { autoClose: 1000 }
      );
    }
  };

  // Toplam fiyat hesaplama
  const calculateTotal = () => {
    return (cart.total || 0).toFixed(2);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      {/* Ürünler Tablosu */}
      <div className="md:min-h-[calc(100vh_-_433px)] flex items-center flex-1 p-10 overflow-x-auto w-full">
        <table className="w-full text-sm text-center text-gray-500 min-w-[1000px]">
          <thead className="text-xs text-white uppercase bg-gray-700">
            <tr>
              <th className="py-3 px-6">PRODUCT</th>
              <th className="py-3 px-6">EXTRAS</th>
              <th className="py-3 px-6">SIZE</th>
              <th className="py-3 px-6">PRICE</th>
              <th className="py-3 px-6">QUANTITY</th>
            </tr>
          </thead>
          <tbody>
            {cart.products?.map((product, index) => (
              <tr
                key={index}
                className="transition-all bg-secondary border-gray-700 hover:bg-primary"
              >
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center gap-x-2 justify-center">
                  <Image
                    src={product.img || "/image/f1.png"}
                    alt={product.title || "Product Image"}
                    width={50}
                    height={50}
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <span>{product.title}</span>
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {product.extras?.length > 0 ? (
                    product.extras.map((item) => (
                      <span
                        key={item.id}
                        className="block text-xs text-gray-400"
                      >
                        {item.name || item.text}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No extras</span>
                  )}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {product.selectedSize
                    ? product.selectedSize.name
                    : product.category === "pizza"
                    ? "Small"
                    : "N/A"}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  ${product.price.toFixed(2)}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {product.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sepet Özeti */}
      <div className="bg-secondary min-h-[calc(100vh_-_433px)] flex flex-col justify-center text-white p-12 md:w-auto w-full md:text-start text-center">
        <Title className="text-[40px] font-dancing text-primary font-bold">
          CART TOTAL
        </Title>

        <div className="mt-6">
          <div className="flex justify-between">
            <b>Subtotal: </b>
            <span>${calculateTotal()}</span>
          </div>
          <div className="flex justify-between mt-2">
            <b>Discount: </b>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between mt-2 font-bold">
            <b>Total: </b>
            <span>${calculateTotal()}</span>
          </div>
        </div>

        <button
          onClick={createOrder}
          disabled={!session || cart.products.length === 0}
          className={`bg-primary text-white px-6 py-2 rounded-full mt-4 hover:opacity-90 transition ${
            !session || cart.products.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {!session
            ? "Please Login to Order"
            : cart.products.length === 0
            ? "Cart is Empty"
            : "CHECKOUT NOW!"}
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    return {
      props: {
        userList: res.data || [],
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      props: {
        userList: [],
      },
    };
  }
};

export default Cart;
