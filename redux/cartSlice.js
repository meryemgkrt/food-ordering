// redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProductToCart: (state, action) => {
      const newProduct = action.payload;

      // Aynı ürün var mı kontrol et (id, size, extras ile)
      const existingProductIndex = state.products.findIndex(
        (product) =>
          product._id === newProduct._id &&
          JSON.stringify(product.selectedSize) ===
            JSON.stringify(newProduct.selectedSize) &&
          JSON.stringify(product.extras) === JSON.stringify(newProduct.extras)
      );

      if (existingProductIndex !== -1) {
        // Mevcut ürün varsa sadece miktarını artır
        state.products[existingProductIndex].quantity += newProduct.quantity;
        state.products[existingProductIndex].totalPrice +=
          newProduct.price * newProduct.quantity;
        state.total += newProduct.price * newProduct.quantity;
      } else {
        // Yeni ürün ekle
        state.products.push({
          ...newProduct,
          // Toplam fiyatı hesapla (ürün fiyatı * miktar)
          totalPrice: newProduct.price * newProduct.quantity,
        });
        state.total += newProduct.price * newProduct.quantity;
      }

      // Toplam quantity'yi güncelle
      state.quantity += newProduct.quantity;
    },

    // Ürünü sepetten kaldırma
    removeProductFromCart: (state, action) => {
      const productIndex = action.payload;
      const product = state.products[productIndex];

      if (product) {
        state.total -= product.totalPrice;
        state.quantity -= product.quantity;
        state.products.splice(productIndex, 1);
      }
    },

    // Ürün miktarını artırma
    increaseQuantity: (state, action) => {
      const productIndex = action.payload;
      const product = state.products[productIndex];

      if (product) {
        product.quantity += 1;
        product.totalPrice += product.price;
        state.quantity += 1;
        state.total += product.price;
      }
    },

    // Ürün miktarını azaltma
    decreaseQuantity: (state, action) => {
      const productIndex = action.payload;
      const product = state.products[productIndex];

      if (product && product.quantity > 1) {
        product.quantity -= 1;
        product.totalPrice -= product.price;
        state.quantity -= 1;
        state.total -= product.price;
      }
    },

    // Sepeti sıfırlama
    reset: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

// Action'ları dışa aktar
export const {
  addProductToCart,
  removeProductFromCart,
  increaseQuantity,
  decreaseQuantity,
  reset,
} = cartSlice.actions;

// Reducer'ı dışa aktar
export default cartSlice.reducer;
