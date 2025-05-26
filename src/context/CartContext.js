import React, { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
  items: [],
  total: 0,
};

// Action types
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const UPDATE_QUANTITY = "UPDATE_QUANTITY";
const CLEAR_CART = "CLEAR_CART";

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      };
    }

    case REMOVE_FROM_CART: {
      const item = state.items.find((item) => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        total: state.total - item.price * item.quantity,
      };
    }

    case UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      const quantityDiff = quantity - item.quantity;

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
        total: state.total + item.price * quantityDiff,
      };
    }

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  // Load from localStorage on initial render
  React.useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: "CLEAR_CART" });
      parsedCart.items.forEach((item) => {
        dispatch({ type: ADD_TO_CART, payload: item });
      });
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
