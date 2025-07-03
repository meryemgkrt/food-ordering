import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { addProductToCart } from "../../redux/cartSlice";

const MenuItem = ({ product }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Debug mode kontrolü
  const DEBUG = process.env.NODE_ENV === "development";

  // Debug logları (sadece development'ta)
  if (DEBUG) {
    console.log("=== CART DEBUG ===");
    console.log("Cart state:", cart);
    console.log("Cart Items:", cart.products);
    console.log("Cart Length:", cart.products?.length || 0);
    console.log("Total Quantity:", cart.quantity);
    console.log("Total Price:", cart.total);
    console.log("==================");
  }

  const handleAddToCart = () => {
    if (DEBUG) {
      console.log("Button clicked!");
      console.log("Product to add:", product);
    }

    // Ürün zaten sepette mi kontrol et
    const existingItem = cart.products?.find(
      (item) => item._id === product._id
    );

    if (existingItem) {
      if (DEBUG) console.log("Product already in cart");
      // İsteğe bağlı: kullanıcıyı bilgilendir veya quantity artır
      // return; // Eğer duplicate istemiyorsanız
    }

    const productToAdd = {
      _id: product._id,
      title: product.title,
      desc: product.desc,
      img: product.img,
      price: product.prices && product.prices[0] ? product.prices[0] : 0,
      quantity: 1,
      selectedSize: null,
      extras: [],
    };

    if (DEBUG) {
      console.log("Dispatching product:", productToAdd);
    }

    dispatch(addProductToCart(productToAdd));

    if (DEBUG) {
      console.log("Dispatch completed");
    }
  };

  // Fiyat güvenlik kontrolü
  const displayPrice =
    product.prices && product.prices[0] ? product.prices[0] : 0;

  return (
    <div className="bg-secondary shadow-md rounded-3xl mt-4 h-full">
      {/* Image Section */}
      <div className="w-full bg-[#e0ecf8] h-[210px] grid place-content-center rounded-bl-[46px] rounded-tl-2xl rounded-tr-2xl">
        <Link href={`/product/${product._id}`}>
          <div className="relative w-36 h-36 hover:scale-110 transition-all">
            <Image
              src={product.img}
              alt={product.title}
              width={144}
              height={144}
              className="w-36 h-36 object-cover"
              priority
              loading="eager"
              sizes="(max-width: 768px) 100vw, 144px"
            />
          </div>
        </Link>
      </div>

      {/* Content Section */}
      <div className="bg-secondary text-white p-5 flex flex-col gap-4">
        <h4 className="font-bold text-lg">{product.title}</h4>
        <p className="text-sm leading-relaxed">{product.desc}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">${displayPrice}</span>
          <button
            onClick={handleAddToCart}
            className="bg-primary text-white p-3 rounded-full hover:opacity-90 transition-all active:scale-95"
            aria-label={`Add ${product.title} to cart`}
          >
            <FaShoppingCart className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
