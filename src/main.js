import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Browser compatibility check
const isBrowserCompatible = () => {
  const features = {
    es6: typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
  };

  return Object.values(features).every(feature => feature === true);
};

// Error boundary for the entire app
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', { className: 'error-container' },
        React.createElement('h1', null, 'Something went wrong.'),
        React.createElement('p', null, 'Please try refreshing the page.'),
        React.createElement('button', {
          onClick: () => window.location.reload(),
          className: 'retry-button'
        }, 'Retry')
      );
    }

    return this.props.children;
  }
}

// Render the app with error handling
const renderApp = () => {
  try {
    if (!isBrowserCompatible()) {
      throw new Error('Your browser is not compatible with this application. Please use a modern browser.');
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      React.createElement(ErrorBoundary, null,
        React.createElement(React.StrictMode, null,
          React.createElement(App, null)
        )
      )
    );
  } catch (error) {
    console.error('Failed to render application:', error);
    document.getElementById('root').innerHTML = `
      <div class="error-container">
        <h1>Failed to load application</h1>
        <p>${error.message}</p>
        <button onclick="window.location.reload()" class="retry-button">Retry</button>
      </div>
    `;
  }
};

// Start the application
renderApp(); 