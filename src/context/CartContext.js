import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  items: [],
  total: 0,
  orders: [
    {
      id: 'DEMO-1234',
      date: new Date().toISOString(),
      status: 'shipped',
      items: [
        {
          id: 1,
          title: 'Quantum Processor X9000',
          price: 299.99,
          quantity: 1,
          subtotal: 299.99,
          image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
      ],
      shipping: 15.00,
      tax: 24.00,
      total: 338.99,
      shippingAddress: {
        name: 'Demo User',
        street: '1234 Future Avenue',
        city: 'Tech City',
        zipcode: '10101',
        country: 'US'
      },
      origin: 'SG'
    }
  ],
};

// Action types
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const UPDATE_QUANTITY = "UPDATE_QUANTITY";
const CLEAR_CART = "CLEAR_CART";
const CHECKOUT = "CHECKOUT";
const ADD_ORDER = "ADD_ORDER";

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
      return {
        ...state,
        items: [],
      };

    case CHECKOUT:
      const newOrder = {
        id: Date.now(),
        items: state.items,
        total: state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
        trackingNumber: generateTrackingNumber(),
        status: 'Order Placed',
        date: new Date().toISOString(),
      };
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      return {
        ...state,
        items: [],
        orders: [...state.orders, newOrder],
      };

    case ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

const generateTrackingNumber = () => {
  return 'TRK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.orders]);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: "CLEAR_CART" });
      parsedCart.items.forEach((item) => {
        dispatch({ type: ADD_TO_CART, payload: item });
      });
    }
  }, []);

  return React.createElement(
    CartContext.Provider,
    { value: { state, dispatch } },
    children
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
