import React from 'react';
import styles from './Tracking.module.css';

const Tracking = () => {
  return (
    <div className={styles.container}>
      <h1>Track Your Delivery</h1>
      <div className={styles.trackingForm}>
        <input 
          type="text" 
          placeholder="Enter your tracking number"
          className={styles.input}
        />
        <button className={styles.button}>
          Track
        </button>
      </div>
    </div>
  );
};

export default Tracking; 