import Image from "next/image";
import React, { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { useSelector } from "react-redux";
import Title from "../ui/Title";
import { GiCancel } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import LoginInput from "../form/LoginInput";
import { useRouter } from "next/router";
import PacmanLoader from "react-spinners/PacmanLoader";

const SearchModal = ({ setIsSearchModal }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Redux cart state'ini al
  const cart = useSelector((state) => state.cart);
  const router = useRouter();

  // Güvenli kapatma fonksiyonu
  const handleCloseModal = () => {
    if (typeof setIsSearchModal === "function") {
      setIsSearchModal(false);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        setProducts(res.data);
        setFiltered(res.data.slice(0, 5));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      getProducts();
    }, 1000);
  }, []);

  // Arama terimi değiştiğinde loading göster
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setSearchLoading(true);

      // Debounce effect - 1000ms (1 saniye) bekle
      const timeoutId = setTimeout(() => {
        setSearchLoading(false);
      }, 1000);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchLoading(false);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const searchFilter = products
      .filter((product) =>
        product.title.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5);
    setFiltered(searchFilter);
  };

  // Ürün tıklandığında sayfaya git ve search modalı kapat
  const handleProductClick = (productId) => {
    handleCloseModal();
    router.push(`/product/${productId}`);
  };

  // Sepetteki ürün sayısını getir
  const getCartItemCount = (productId) => {
    const cartItem = cart.products?.find((item) => item._id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <OutsideClickHandler onOutsideClick={handleCloseModal}>
        <div className="bg-white text-black p-6 rounded-xl shadow-lg w-[600px] h-[600px] max-w-md">
          {/* Close Button */}
          <div className="flex justify-end">
            <GiCancel
              className="text-primary hover:text-red-600 transition-all cursor-pointer"
              size={26}
              onClick={handleCloseModal}
            />
          </div>

          {/* Title */}
          <Title addClass="text-[40px] text-center mb-6">Search</Title>

          {/* Cart Summary */}
          {cart.products && cart.products.length > 0 && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20 text-center">
              <div className="flex items-center justify-center gap-2 text-primary">
                <FaShoppingCart />
                <span className="font-semibold text-sm">
                  Cart: {cart.quantity} items ($
                  {cart.total?.toFixed(2) || "0.00"})
                </span>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex flex-col items-center">
            <LoginInput
              placeholder={searchTerm ? "" : "Type to search..."}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full border border-primary p-2 rounded mb-6 focus:border-primary focus:ring-primary focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all"
            />

            {/* List */}
            <ul className="w-full mt-4 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="text-center p-4">
                  <PacmanLoader color="#fca311" size={20} />
                </div>
              ) : searchLoading && searchTerm.length >= 2 ? (
                <div className="text-center flex justify-center items-center text-gray-500 p-4">
                  <PacmanLoader color="#fca311" size={20} />
                </div>
              ) : (
                <>
                  {filtered.length > 0 ? (
                    filtered.map((product) => {
                      const cartCount = getCartItemCount(product._id);
                      return (
                        <li
                          onClick={() => handleProductClick(product?._id)}
                          key={product._id}
                          className="cursor-pointer flex items-center justify-between p-4 border-b hover:bg-primary hover:text-white transition-all relative"
                        >
                          <div className="flex items-center gap-x-3">
                            <div className="relative">
                              <Image
                                src={product?.img || "/image/f1.png"}
                                alt={product?.title}
                                width={48}
                                height={48}
                                className="rounded"
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              {/* Cart Badge */}
                              {cartCount > 0 && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                  {cartCount}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-bold text-[16px]">
                              {product?.title}
                            </span>

                            {/* Cart Status */}
                            {cartCount > 0 && (
                              <div className="flex items-center gap-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                <FaShoppingCart className="text-xs" />
                                <span>{cartCount}</span>
                              </div>
                            )}

                            <span className="font-bold text-[16px]">
                              ${product.prices[0]}
                            </span>
                          </div>
                        </li>
                      );
                    })
                  ) : searchTerm.length >= 2 && !searchLoading ? (
                    <div className="text-center text-gray-500 p-4">
                      "No products found"
                    </div>
                  ) : null}
                </>
              )}
            </ul>
          </div>

          {/* Cart Products Section - Sepetteki ürünleri göster */}
          {cart.products && cart.products.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-3 text-center text-primary">
                Items in Cart
              </h3>
              <div className="max-h-32 overflow-y-auto">
                {cart.products.map((cartItem) => (
                  <div
                    key={cartItem._id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={cartItem.img || "/image/f1.png"}
                        alt={cartItem.title}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">
                        {cartItem.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="bg-primary text-white px-2 py-1 rounded">
                        {cartItem.quantity}
                      </span>
                      <span className="font-bold">${cartItem.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default SearchModal;
