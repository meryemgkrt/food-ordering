import { useState, useEffect } from "react";
import Logo from "../ui/Logo";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCloseCircle } from "react-icons/io";
import SearchModal from "../ui/SearchModal";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";

const Header = () => {
  const [isSearchModal, setIsSearchModal] = useState(false); // ✅ Değiştirildi
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // MenuWrapper'dan cart bilgisini al
  const menuWrapperCart = useSelector((state) => state?.menuWrapper?.cart);
  const isCartLoading = useSelector(
    (state) => state?.menuWrapper?.cart?.isLoading
  );

  // Fallback olarak eski cart state'ini de kontrol et
  const fallbackCart = useSelector((state) => state?.cart);

  // Ana cart verisini belirle
  const cart = menuWrapperCart ||
    fallbackCart || { products: [], totalItems: 0 };

  const router = useRouter();

  // Scroll effect - Sadece boyut değişimi için
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cart item count hesaplama
  const getCartItemCount = () => {
    if (cart.totalItems !== undefined) {
      return cart.totalItems;
    } else if (cart.products && Array.isArray(cart.products)) {
      return cart.products.reduce((total, product) => {
        return total + (product.quantity || 1);
      }, 0);
    }
    return 0;
  };

  // Cart total price hesaplama
  const getCartTotalPrice = () => {
    if (cart.totalPrice !== undefined) {
      return cart.totalPrice.toFixed(2);
    } else if (cart.products && Array.isArray(cart.products)) {
      const total = cart.products.reduce((sum, product) => {
        return sum + product.price * (product.quantity || 1);
      }, 0);
      return total.toFixed(2);
    }
    return "0.00";
  };

  // Active link kontrolü için helper function
  const isActiveLink = (path) => {
    if (path === "/auth/login") {
      return (
        router.asPath.includes("/auth") ||
        router.asPath.includes("/login") ||
        router.asPath.includes("/profile")
      );
    }
    return router.asPath === path;
  };

  // Navigation link'i için ortak class'lar - Always Dark
  const getLinkClasses = (path) => {
    const baseClasses =
      "relative text-sm md:text-base font-semibold uppercase tracking-wide transition-all duration-500 ease-out px-4 py-2 rounded-full group overflow-hidden";
    const activeClasses =
      "text-primary shadow-lg shadow-primary/25 transform scale-105";
    const inactiveClasses = "text-white/90 hover:text-white hover:scale-110";

    return `${baseClasses} ${
      isActiveLink(path) ? activeClasses : inactiveClasses
    }`;
  };

  // Mobile navigation link'i için ortak class'lar - Always Dark Mobile
  const getMobileLinkClasses = (path) => {
    const baseClasses =
      "text-lg font-semibold uppercase tracking-wider transition-all duration-500 ease-out relative overflow-hidden group";
    const activeClasses =
      "text-primary font-bold border-l-4 border-primary pl-6 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent shadow-lg shadow-primary/10";
    const inactiveClasses =
      "text-white hover:text-primary hover:pl-6 hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent hover:shadow-md";

    return `${baseClasses} ${
      isActiveLink(path) ? activeClasses : inactiveClasses
    }`;
  };

  // Icon button'ları için ortak class'lar - Always Dark
  const getIconButtonClasses = (path, isSpecialActive = false) => {
    const baseClasses =
      "relative flex items-center justify-center p-3 rounded-2xl transition-all duration-500 ease-out group hover:scale-110 backdrop-blur-md border border-white/10";
    const activeClasses =
      "text-primary bg-gradient-to-br from-primary/25 via-primary/15 to-primary/10 shadow-xl shadow-primary/30 ring-2 ring-primary/40 transform scale-110";
    const inactiveClasses =
      "text-white/90 hover:text-primary hover:bg-gradient-to-br hover:from-white/15 hover:via-white/10 hover:to-white/5 hover:shadow-xl hover:shadow-white/20";

    const isActive = isSpecialActive || isActiveLink(path);
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="relative">
      {/* Header - Always Dark Theme */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          scrolled ? "h-[72px] shadow-2xl shadow-black/30" : "h-[88px]"
        }`}
      >
        <div
          className={`h-full relative px-4 md:px-6 flex items-center backdrop-blur-xl border-b transition-all duration-700 ${
            router.asPath === "/"
              ? "bg-black/40 border-white/20"
              : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-white/10"
          }`}
        >
          {/* Enhanced Dark Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-32 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-24 bg-gradient-to-l from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse delay-500"></div>
          </div>

          <div className="container mx-auto text-white flex justify-between items-center h-full relative z-10">
            {/* Left Section - Dark Burger Menu */}
            <div className="flex items-center gap-x-6">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`sm:hidden p-3 rounded-2xl transition-all duration-500 ease-out group border border-white/10 backdrop-blur-md ${
                  isMenuOpen
                    ? "bg-gradient-to-br from-primary/25 to-primary/15 text-primary shadow-xl shadow-primary/30 rotate-180 scale-110"
                    : "text-white/90 hover:text-primary hover:bg-gradient-to-br hover:from-white/15 hover:to-white/10 hover:shadow-xl"
                }`}
              >
                <GiHamburgerMenu className="text-xl transition-all duration-500 group-hover:scale-110" />
              </button>
            </div>

            {/* Logo Section - Enhanced */}
            <div className="flex items-center md:gap-x-8 lg:-ml-12">
              <Logo className="hover:scale-110 transition-all duration-500 ease-out drop-shadow-lg" />
            </div>

            {/* Navigation - Always Dark */}
            <nav className="hidden sm:block">
              <ul className="flex items-center gap-x-1 text-center">
                {[
                  { href: "/", label: "Home", emoji: "🏠" },
                  { href: "/menu", label: "Menu", emoji: "🍽️" },
                  { href: "/about", label: "About", emoji: "ℹ️" },
                  { href: "/bookTable", label: "Reserve", emoji: "📅" },
                ].map((item) => (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className={getLinkClasses(item.href)}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span className="text-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                          {item.emoji}
                        </span>
                        {item.label}
                      </span>

                      {/* Advanced Dark Hover Effects */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-full scale-0 group-hover:scale-100 transition-all duration-500 ease-out blur-sm"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-full scale-0 group-hover:scale-90 transition-all duration-300 delay-100"></div>

                      {/* Enhanced Active Indicator */}
                      {isActiveLink(item.href) && (
                        <>
                          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full animate-pulse delay-200"></div>
                        </>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Section - Always Dark */}
            <div className="flex items-center gap-x-2 md:gap-x-3">
              {/* User Icon - Dark Theme */}
              <Link
                href="/auth/login"
                className={getIconButtonClasses("/auth/login")}
                title="Login / Register"
              >
                <FaUser
                  className={`transition-all duration-500 text-lg ${
                    isActiveLink("/auth/login")
                      ? "text-primary"
                      : "text-white/90"
                  }`}
                />

                {/* Enhanced Active Indicator */}
                {isActiveLink("/auth/login") && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-primary to-blue-500 rounded-full animate-pulse"></div>
                )}

                {/* Advanced Hover Effects */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-blue-500/30 scale-0 group-hover:scale-100 transition-all duration-500 blur-md"></div>
              </Link>

              {/* Cart Icon - Dark Theme */}
              <Link
                href="/cart"
                className={getIconButtonClasses("/cart")}
                title={`Shopping Cart - $${getCartTotalPrice()}`}
              >
                <FaShoppingCart
                  className={`transition-all duration-500 text-lg ${
                    isActiveLink("/cart") ? "text-primary" : "text-white/90"
                  }`}
                />

                {/* Ultra Enhanced Cart Badge - Dark Compatible */}
                <span
                  className={`min-w-[22px] h-6 text-xs flex items-center justify-center rounded-full absolute -top-2 -right-2 font-bold transition-all duration-500 shadow-xl border-2 ${
                    isCartLoading
                      ? "bg-gray-500 text-white animate-pulse px-1 border-gray-400"
                      : getCartItemCount() > 0
                      ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white animate-bounce scale-110 px-1 border-white shadow-green-500/50"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 text-white scale-90 px-1 border-gray-500"
                  }`}
                >
                  {isCartLoading ? "..." : getCartItemCount()}
                </span>

                {/* Enhanced Cart Value Tooltip - Dark Theme */}
                {getCartItemCount() > 0 && !isCartLoading && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-xs px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap z-50 shadow-2xl border border-white/20 backdrop-blur-md">
                    <div className="text-center">
                      <div className="font-bold text-primary">
                        ${getCartTotalPrice()}
                      </div>
                      <div className="text-gray-300">
                        {getCartItemCount()} item
                        {getCartItemCount() !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45 border-l border-t border-white/20"></div>
                  </div>
                )}

                {/* Enhanced Active Indicator */}
                {isActiveLink("/cart") && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-primary to-green-500 rounded-full animate-pulse"></div>
                )}

                {/* Advanced Hover Effects */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-green-500/30 scale-0 group-hover:scale-100 transition-all duration-500 blur-md"></div>
              </Link>

              {/* Search Button - Dark Theme */}
              <button
                onClick={() => setIsSearchModal(true)} // ✅ Değiştirildi
                className={getIconButtonClasses("", isSearchModal)} // ✅ Değiştirildi
                title="Search Menu"
              >
                <FaSearch
                  className={`transition-all duration-700 text-lg ${
                    isSearchModal // ✅ Değiştirildi
                      ? "text-primary rotate-180 scale-125"
                      : "text-white/90"
                  }`}
                />

                {/* Enhanced Active Indicator */}
                {isSearchModal && ( // ✅ Değiştirildi
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-ping"></div>
                )}

                {/* Advanced Hover Effects */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 scale-0 group-hover:scale-100 transition-all duration-500 blur-md"></div>
              </button>

              {/* Order Button - Dark Theme */}
              <Link href="/order" className="inline-block">
                <button
                  className={`relative overflow-hidden font-bold px-6 md:px-8 py-3 text-sm md:text-base rounded-2xl transition-all duration-500 transform hover:scale-105 group shadow-2xl border-2 ${
                    isActiveLink("/order")
                      ? "bg-white text-primary border-primary shadow-primary/30 animate-pulse"
                      : getCartItemCount() > 0
                      ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white border-green-400 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-green-500/30"
                      : "bg-gradient-to-r from-primary via-orange-500 to-red-500 text-white border-orange-400 hover:from-orange-500 hover:via-red-500 hover:to-pink-500 shadow-primary/30"
                  }`}
                  title={
                    getCartItemCount() > 0
                      ? `Complete Order - ${getCartItemCount()} items`
                      : "Start Your Order"
                  }
                >
                  {/* Enhanced Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-200"></div>

                  <span className="relative z-10 flex items-center gap-2">
                    {getCartItemCount() > 0 ? (
                      <>
                        <span>Complete Order</span>
                        <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/20">
                          {getCartItemCount()}
                        </span>
                      </>
                    ) : (
                      "Order Online"
                    )}
                  </span>

                  {/* Enhanced Pulse Effect */}
                  {isActiveLink("/order") && (
                    <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-25"></div>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div
        className={`${
          scrolled ? "h-[72px]" : "h-[88px]"
        } transition-all duration-700`}
      ></div>

      {/* Dark Burger Menu Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-[72px] left-0 w-[350px] bg-gray-900/95 backdrop-blur-xl shadow-2xl border-r border-gray-700/50 h-full overflow-y-auto">
            {/* Dark Gradient Header */}
            <div className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="flex justify-between items-center relative z-10">
                <h3 className="text-white font-bold text-xl">Navigation</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-red-200 transition-all duration-500 hover:rotate-180 text-3xl p-2 rounded-full hover:bg-white/20 backdrop-blur-sm"
                >
                  <IoIosCloseCircle />
                </button>
              </div>
            </div>

            {/* Dark Cart Summary */}
            {getCartItemCount() > 0 && (
              <div className="p-6 bg-gradient-to-r from-green-900/50 via-emerald-900/40 to-teal-900/50 border-b border-green-700/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-lg font-bold text-green-400 flex items-center gap-2">
                      🛒 Cart Summary
                    </p>
                    <p className="text-sm text-green-300">
                      {getCartItemCount()} items • ${getCartTotalPrice()}
                    </p>
                  </div>
                  <Link
                    href="/cart"
                    className="text-sm bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3 rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-500 transform hover:scale-105 shadow-xl font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}

            {/* Dark Navigation Links */}
            <ul className="flex flex-col p-6 space-y-3">
              {[
                { href: "/", label: "Home", emoji: "🏠" },
                { href: "/menu", label: "Menu", emoji: "🍽️" },
                { href: "/about", label: "About", emoji: "ℹ️" },
                { href: "/bookTable", label: "Reserve", emoji: "📅" },
                { href: "/order", label: "Order Online", emoji: "🛒" },
                { href: "/auth/login", label: "Login / Register", emoji: "👤" },
              ].map((item) => (
                <li key={item.href} className="w-full">
                  <Link
                    href={item.href}
                    className={`block w-full py-5 px-6 rounded-2xl transition-all duration-500 ${getMobileLinkClasses(
                      item.href
                    )} relative overflow-hidden`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex items-center gap-4">
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="font-semibold">{item.label}</span>
                      </span>
                      {item.href === "/order" && getCartItemCount() > 0 && (
                        <span className="bg-gradient-to-r from-primary to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          {getCartItemCount()}
                        </span>
                      )}
                    </span>

                    {/* Enhanced Dark Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent scale-0 group-hover:scale-100 transition-all duration-500 rounded-2xl"></div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Dark Mobile Menu Footer */}
            <div className="p-6 text-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-gray-700/50">
              <p className="text-sm text-gray-300 font-semibold">
                🍕 Delicious food delivered fast
              </p>
              <div className="mt-3 flex justify-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-400"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Search Modal */}
      {isSearchModal && ( // ✅ Değiştirildi
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="animate-in fade-in zoom-in duration-500 slide-in-from-top-4">
            <SearchModal setIsSearchModal={setIsSearchModal} />{" "}
            {/* ✅ Değiştirildi */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
