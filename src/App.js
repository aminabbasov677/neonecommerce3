import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import DeliveryTracker from "./components/delivery/DeliveryTracker";
import "./App.css";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const isFetching = useIsFetching();

  const particleOptions = {
    particles: {
      number: { value: 60 },
      color: { value: ["#00f3ff", "#9d00ff", "#39ff14", "#ff00ff"] },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 4 }, random: true },
      move: {
        enable: true,
        speed: { min: 0.3, max: 0.8 },
        direction: "none",
        random: true,
        outModes: { default: "out" },
      },
      opacity: { value: { min: 0.3, max: 0.6 }, random: true },
      links: {
        enable: true,
        distance: 150,
        color: "#00f3ff",
        opacity: 0.3,
        width: 1,
      },
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 200, links: { opacity: 0.5 } },
        push: { quantity: 4 },
      },
    },
    background: { color: "transparent" },
    retina_detect: true,
  };

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return React.createElement('div', { className: 'app-container' },
    React.createElement(Particles, {
      id: 'tsparticles',
      init: particlesInit,
      options: particleOptions
    }),
    React.createElement(Navbar),
    React.createElement('main', { className: 'main-content' },
      isFetching ? React.createElement(Loading) : null,
      React.createElement(ErrorBoundary, null,
        React.createElement(Routes, null,
          React.createElement(Route, { path: '/', element: React.createElement(Home) }),
          React.createElement(Route, { path: '/about', element: React.createElement(About) }),
          React.createElement(Route, { path: '/cart', element: React.createElement(Cart) }),
          React.createElement(Route, { path: '/contact', element: React.createElement(Contact) }),
          React.createElement(Route, { path: '/profile', element: React.createElement(Profile) }),
          React.createElement(Route, { path: '/signup', element: React.createElement(SignUp) }),
          React.createElement(Route, { path: '/signin', element: React.createElement(SignIn) }),
          React.createElement(Route, { path: '/product/:id', element: React.createElement(ProductDetail) }),
          React.createElement(Route, { path: '/search', element: React.createElement(Search) }),
          React.createElement(Route, { path: '/tracking', element: React.createElement(DeliveryTracker) }),
          React.createElement(Route, { path: '/tracking/:trackingNumber', element: React.createElement(DeliveryTracker) })
        )
      )
    ),
    React.createElement(Footer),
    React.createElement(Toaster)
  );
}

function App() {
  return React.createElement(QueryClientProvider, { client: queryClient },
    React.createElement(ThemeProvider, null,
      React.createElement(CartProvider, null,
        React.createElement(AuthProvider, null,
          React.createElement(Router, null,
            React.createElement(ScrollToTop),
            React.createElement(AppContent)
          )
        )
      )
    )
  );
}

export default App; 