import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './DeliveryTracking.css';

const DeliveryTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  const validateTrackingNumber = (number) => {
    // Check if it's a 10-digit number
    if (!/^\d{10}$/.test(number)) {
      return false;
    }

    // Extract segments
    const category = parseInt(number.substring(0, 2));
    const shippingMethod = parseInt(number.substring(2, 4));
    const region = parseInt(number.substring(4, 6));
    const orderNumber = parseInt(number.substring(6));

    // Validate ranges
    return (
      category >= 1 && category <= 99 &&
      shippingMethod >= 1 && shippingMethod <= 99 &&
      region >= 1 && region <= 99 &&
      orderNumber >= 1 && orderNumber <= 9999
    );
  };

  const handleTrack = (e) => {
    e.preventDefault();
    setError('');
    setTrackingInfo(null);

    if (!trackingNumber) {
      setError('Please enter a tracking number');
      return;
    }

    if (!validateTrackingNumber(trackingNumber)) {
      setError('Invalid tracking number format. Please enter a valid 10-digit number.');
      return;
    }

    // Simulate tracking information
    setTrackingInfo({
      status: 'In Transit',
      estimatedDelivery: '2024-03-15',
      currentLocation: 'Distribution Center',
      history: [
        {
          date: '2024-03-10',
          status: 'Order Placed',
          location: 'Online Store'
        },
        {
          date: '2024-03-11',
          status: 'Processing',
          location: 'Warehouse'
        },
        {
          date: '2024-03-12',
          status: 'Shipped',
          location: 'Shipping Center'
        },
        {
          date: '2024-03-13',
          status: 'In Transit',
          location: 'Distribution Center'
        }
      ]
    });
  };

  return (
    <div className="delivery-tracking">
      <motion.div
        className="tracking-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Track Your Delivery</h1>
        <p className="subtitle">Enter your tracking number to see the status of your order</p>

        <form onSubmit={handleTrack} className="tracking-form">
          <div className="input-group">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="tracking-input"
            />
            <button type="submit" className="track-button">
              Track
            </button>
          </div>
        </form>

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {trackingInfo && (
          <motion.div
            className="tracking-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="status-card">
              <h2>Current Status</h2>
              <div className="status-details">
                <p className="status">{trackingInfo.status}</p>
                <p className="location">{trackingInfo.currentLocation}</p>
                <p className="delivery">
                  Estimated Delivery: {trackingInfo.estimatedDelivery}
                </p>
              </div>
            </div>

            <div className="history-card">
              <h2>Tracking History</h2>
              <div className="history-timeline">
                {trackingInfo.history.map((item, index) => (
                  <motion.div
                    key={index}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="history-date">{item.date}</div>
                    <div className="history-status">{item.status}</div>
                    <div className="history-location">{item.location}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DeliveryTracking; 