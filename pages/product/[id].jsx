import Title from "@/components/ui/Title";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { addProductToCart } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Index = ({ food }) => {
  const [size, setSize] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  console.log("food", food);

  // Kategoriye göre extra seçenekleri
  const getExtraOptions = (category) => {
    switch (category) {
      case "pizza":
        return [
          { id: 1, name: "Extra Cheese", price: 2.5 },
          { id: 2, name: "Pepperoni", price: 3.0 },
          { id: 3, name: "Mushrooms", price: 2.0 },
          { id: 4, name: "Bell Peppers", price: 1.5 },
          { id: 5, name: "Olives", price: 2.0 },
          { id: 6, name: "Chicken", price: 4.0 },
          { id: 7, name: "Bacon", price: 3.5 },
        ];
      case "drink":
        return [
          { id: 8, name: "Extra Ice", price: 0.5 },
          { id: 9, name: "Lemon Slice", price: 0.5 },
          { id: 10, name: "Mint Leaves", price: 1.0 },
          { id: 11, name: "Extra Large Size", price: 2.0 },
          { id: 12, name: "Syrup (Vanilla)", price: 1.0 },
          { id: 13, name: "Syrup (Caramel)", price: 1.0 },
        ];
      case "pasta":
        return [
          { id: 14, name: "Extra Parmesan", price: 2.0 },
          { id: 15, name: "Grilled Chicken", price: 4.5 },
          { id: 16, name: "Garlic Bread", price: 3.0 },
          { id: 17, name: "Extra Sauce", price: 1.5 },
          { id: 18, name: "Meatballs", price: 4.0 },
          { id: 19, name: "Mushrooms", price: 2.5 },
          { id: 20, name: "Sun-dried Tomatoes", price: 2.0 },
        ];
      case "salad":
        return [
          { id: 21, name: "Grilled Chicken", price: 4.0 },
          { id: 22, name: "Avocado", price: 3.0 },
          { id: 23, name: "Feta Cheese", price: 2.5 },
          { id: 24, name: "Nuts (Walnuts)", price: 2.0 },
          { id: 25, name: "Croutons", price: 1.5 },
          { id: 26, name: "Extra Dressing", price: 1.0 },
          { id: 27, name: "Boiled Egg", price: 2.0 },
        ];
      case "kebab":
        return [
          { id: 28, name: "Extra Meat", price: 5.0 },
          { id: 29, name: "French Fries", price: 3.0 },
          { id: 30, name: "Grilled Vegetables", price: 2.5 },
          { id: 31, name: "Extra Sauce (Garlic)", price: 1.0 },
          { id: 32, name: "Extra Sauce (Spicy)", price: 1.0 },
          { id: 33, name: "Pickles", price: 1.5 },
          { id: 34, name: "Rice", price: 2.0 },
        ];
      case "kofte":
        return [
          { id: 35, name: "Extra Meatballs", price: 4.5 },
          { id: 36, name: "Yogurt Sauce", price: 2.0 },
          { id: 37, name: "Grilled Tomatoes", price: 2.0 },
          { id: 38, name: "Bulgur Rice", price: 2.5 },
          { id: 39, name: "Mixed Salad", price: 3.0 },
          { id: 40, name: "Bread", price: 1.5 },
          { id: 41, name: "Hot Pepper", price: 1.0 },
        ];
      default:
        return [];
    }
  };

  // Food yüklenmediğinde loading göster
  if (!food) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Product not found or loading...</div>
      </div>
    );
  }

  // Size değişikliği
  const handleSizeChange = (sizeIndex) => {
    setSize(sizeIndex);
  };

  // Extra seçimi
  const handleExtraChange = (extra, isChecked) => {
    if (isChecked) {
      setSelectedExtras((prev) => [...prev, extra]);
    } else {
      setSelectedExtras((prev) =>
        prev.filter((selected) => selected.id !== extra.id)
      );
    }
  };

  // Miktar değişikliği
  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Toplam fiyat hesaplama
  const calculateTotalPrice = () => {
    const basePrice = food.prices?.[size] || food.prices?.[0] || 0;
    const extrasPrice = selectedExtras.reduce(
      (acc, extra) => acc + extra.price,
      0
    );
    return basePrice + extrasPrice;
  };

  // Sepete ekleme
  const handleClick = () => {
    if (!food) {
      console.error("Product data not available");
      return;
    }

    const totalPrice = calculateTotalPrice();

    dispatch(
      addProductToCart({
        _id: food._id, // API'den gelen gerçek ID
        title: food.title,
        img: food.img,
        price: totalPrice,
        quantity: quantity,
        extras: selectedExtras,
        selectedSize: {
          index: size,
          name:
            food.category === "pizza"
              ? size === 0
                ? "Small"
                : size === 1
                ? "Medium"
                : "Large"
              : "Regular",
        },
        category: food.category,
      })
    );

    // Başarılı ekleme sonrası state'leri sıfırla (isteğe bağlı)
    // setSelectedExtras([]);
    // setQuantity(1);
    // setSize(0);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center gap-10 p-5">
      {/* Ürün Resmi */}
      <div className="relative flex-1 w-full md:w-[50%] h-[300px] md:h-[500px]">
        <Image
          src={food.img || "/image/f1.png"}
          alt={food.title || "Product Image"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Ürün Detayları */}
      <div className="flex-1 w-full flex flex-col items-center justify-center text-center gap-6">
        <Title className="font-dancing text-4xl md:text-6xl font-bold my-3">
          {food.title}
        </Title>

        {/* Fiyat Gösterimi */}
        <span className="text-2xl font-bold text-primary underline">
          ${calculateTotalPrice().toFixed(2)}
        </span>

        <p className="text-sm md:text-base text-dark leading-relax">
          {food.desc}
        </p>

        {/* Boyut Seçimi (Sadece Pizza için) */}
        {food.category === "pizza" && food.prices && food.prices.length > 1 && (
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-xl font-bold">Choose the size</h4>
            <div className="flex justify-center items-center gap-4">
              {food.prices.map((price, index) => (
                <label
                  key={index}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="size"
                    checked={size === index}
                    onChange={() => handleSizeChange(index)}
                    className="form-radio text-primary accent-primary"
                  />
                  <span className="text-sm font-semibold">
                    {index === 0 ? "Small" : index === 1 ? "Medium" : "Large"}
                  </span>
                  <span className="text-xs text-gray-500">${price}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Extra Seçenekler */}
        {getExtraOptions(food.category).length > 0 && (
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-xl font-bold">Extra Options</h4>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {getExtraOptions(food.category).map((extra) => (
                <label
                  key={extra.id}
                  className="flex items-center justify-center gap-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedExtras.some((e) => e.id === extra.id)}
                    onChange={(e) => handleExtraChange(extra, e.target.checked)}
                    className="form-checkbox text-primary checked:bg-primary accent-primary"
                  />
                  <span className="text-sm font-semibold">
                    {extra.name} (+${extra.price})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Miktar Seçimi */}
        <div className="flex items-center gap-4">
          <h4 className="text-xl font-bold">Quantity:</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange("decrease")}
              disabled={quantity <= 1}
              className="bg-primary text-white w-8 h-8 rounded-full hover:opacity-90 transition disabled:opacity-50"
            >
              -
            </button>
            <span className="text-xl font-bold mx-4">{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increase")}
              className="bg-primary text-white w-8 h-8 rounded-full hover:opacity-90 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Sepete Ekleme Butonu */}
        <button
          onClick={handleClick}
          className="bg-primary text-white px-9 py-2 rounded-full hover:opacity-90 transition"
        >
          Add to Cart - ${(calculateTotalPrice() * quantity).toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`
    );

    return {
      props: {
        food: res.data || null,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      props: {
        food: null,
      },
    };
  }
};

export default Index;
