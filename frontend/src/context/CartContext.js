import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'kshirva_cart';

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const saveCart = (items) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
};

const calcTotal = (items) =>
  items.reduce((sum, item) => sum + (item.product?.price?.amount || 0) * item.quantity, 0);

const cartReducer = (state, action) => {
  let updated;
  switch (action.type) {
    case 'ADD_TO_CART': {
      const exists = state.find(i => i.product._id === action.payload.product._id);
      updated = exists
        ? state.map(i => i.product._id === action.payload.product._id
            ? { ...i, quantity: i.quantity + action.payload.quantity }
            : i)
        : [...state, action.payload];
      break;
    }
    case 'REMOVE_FROM_CART':
      updated = state.filter(i => i.product._id !== action.payload);
      break;
    case 'UPDATE_QUANTITY':
      updated = action.payload.quantity <= 0
        ? state.filter(i => i.product._id !== action.payload.productId)
        : state.map(i => i.product._id === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i);
      break;
    case 'CLEAR_CART':
      updated = [];
      break;
    default:
      return state;
  }
  saveCart(updated);
  return updated;
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], loadCart);

  const addToCart     = (product, quantity = 1) => dispatch({ type: 'ADD_TO_CART',     payload: { product, quantity } });
  const removeFromCart= (productId)             => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  const updateQuantity= (productId, quantity)   => dispatch({ type: 'UPDATE_QUANTITY',  payload: { productId, quantity } });
  const clearCart     = ()                       => dispatch({ type: 'CLEAR_CART' });
  const getCartTotal  = ()                       => calcTotal(cartItems);
  const isInCart      = (productId)             => cartItems.some(i => i.product._id === productId);
  const getItemQty    = (productId)             => cartItems.find(i => i.product._id === productId)?.quantity || 0;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, isInCart, getItemQty, total: calcTotal(cartItems) }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
