import Image from "next/image";
import React, { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import Title from "../ui/Title";
import { GiCancel } from "react-icons/gi";
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
                    filtered.map((product) => (
                      <li
                        onClick={() => handleProductClick(product?._id)}
                        key={product._id}
                        className="cursor-pointer flex items-center justify-between p-4 border-b hover:bg-primary hover:text-white transition-all"
                      >
                        <div className="flex items-center gap-x-3">
                          <Image
                            src={product?.img || "/image/f1.png"}
                            alt={product?.title}
                            width={48}
                            height={48}
                            className="rounded"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <span className="font-bold text-[16px]">
                          {product?.title}
                        </span>
                        <span className="font-bold text-[16px]">
                          ${product.prices[0]}
                        </span>
                      </li>
                    ))
                  ) : searchTerm.length >= 2 && !searchLoading ? (
                    <div className="text-center text-gray-500 p-4">
                      "No products found"
                    </div>
                  ) : null}
                </>
              )}
            </ul>
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default SearchModal;
