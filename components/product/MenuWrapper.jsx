import { useEffect, useState } from "react";
import Title from "../ui/Title";
import MenuItem from "./MenuItem";

const MenuWrapper = ({ categoryList, productList }) => {
  console.log(categoryList);
  const [activeMenu, setActiveMenu] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayCount, setDisplayCount] = useState(6); // Başlangıçta gösterilecek ürün sayısı
  const [showLimited, setShowLimited] = useState(false); // View Menu butonu için state

  // Filter products based on active category
  useEffect(() => {
    if (activeMenu === 0) {
      setFilteredProducts(productList || []);
    } else {
      const filtered = (productList || []).filter(
        (product) => product.category === activeMenu
      );
      setFilteredProducts(filtered);
    }
    // Kategori değiştiğinde display count'u resetle
    setDisplayCount(6);
    setShowLimited(false); // Kategori değişince limited view'i kapat
  }, [activeMenu, productList]);

  // Load more products
  const loadMoreProducts = () => {
    setDisplayCount((prev) => prev + 6);
  };

  // View Menu button handler
  const handleViewMenu = () => {
    setShowLimited(true);
    setDisplayCount(3); // Sadece 3 ürün göster
  };

  // Show All button handler
  const handleShowAll = () => {
    setShowLimited(false);
    setDisplayCount(6);
  };

  // Displayed products (slice based on displayCount)
  const displayedProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="container mx-auto mb-16">
      <div className="flex flex-col items-center w-full">
        {/* Title */}
        <Title className="text-center font-dancing text-4xl font-bold text-primary mb-8">
          Our Menu
        </Title>

        {/* Category Buttons */}
        <div className="flex justify-center gap-3 w-full mt-14 flex-wrap">
          {/* All Products Button */}
          <button
            className={`${
              activeMenu === 0
                ? "bg-yellow-500 text-white"
                : "bg-secondary text-white"
            } px-4 py-2 rounded-full hover:opacity-90 transition`}
            onClick={() => setActiveMenu(0)}
          >
            All
          </button>

          {/* Category Buttons */}
          {categoryList &&
            categoryList.map((category) => (
              <button
                key={category._id}
                className={`${
                  activeMenu === category.title
                    ? "bg-yellow-500 text-white"
                    : "bg-secondary text-white"
                } px-4 py-2 rounded-full hover:opacity-90 transition`}
                onClick={() => setActiveMenu(category.title)}
              >
                {category.title}
              </button>
            ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-8">
        {filteredProducts.length > 0 ? (
          <>
            {/* Product Grid */}
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {displayedProducts.map((product) => (
                <MenuItem
                  product={product}
                  key={product._id}
                  img={product.img}
                  title={product.title}
                  description={product.desc}
                  prices={product.prices}
                />
              ))}
            </div>

            {/* Load More Button - Sadece limited view değilse göster */}
            {filteredProducts.length > displayCount && !showLimited && (
              <div className="flex justify-center mt-10">
                <button
                  className="bg-primary text-white px-9 py-2 rounded-full hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/30"
                  onClick={loadMoreProducts}
                >
                  Load More ({filteredProducts.length - displayCount} more)
                </button>
              </div>
            )}

            {/* Products Count Info */}
            <div className="text-center mt-6 text-gray-500">
              Showing {displayedProducts.length} of {filteredProducts.length}{" "}
              products
            </div>

            {/* View Menu / Show All Buttons */}
            <div className="flex justify-center mt-8 gap-4">
              {!showLimited ? (
                <button
                  onClick={handleViewMenu}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/30 flex items-center gap-2"
                >
                  <i className="fas fa-utensils"></i>
                  View Menu (Top 3)
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleShowAll}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
                  >
                    <i className="fas fa-expand"></i>
                    Show All Products
                  </button>
                  {filteredProducts.length > 3 && (
                    <button
                      onClick={loadMoreProducts}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30 flex items-center gap-2"
                    >
                      <i className="fas fa-plus"></i>
                      Load More
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* No Products Found */
          <div className="text-center py-16">
            <div className="text-6xl text-gray-300 mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              {activeMenu === 0
                ? "No products available at the moment"
                : `No products found in this category`}
            </p>
            {activeMenu !== 0 && (
              <button
                className="mt-4 text-primary hover:underline"
                onClick={() => setActiveMenu(0)}
              >
                View all products
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuWrapper;
