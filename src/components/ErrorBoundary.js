import React, { Component } from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary glass-effect">
          <h2 className="gradient-text">Something went wrong.</h2>
          <p>Please try refreshing the page.</p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
