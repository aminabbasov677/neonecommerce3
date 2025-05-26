import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, Map } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './DeliveryTrackingPage.css';

import DeliveryTracker from '../components/delivery/DeliveryTracker';

const DeliveryTrackingPage = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const { state } = useCart();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Find order in cart context
    const foundOrder = state.orders.find(o => o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
      setIsLoading(false);
    } else {
      // If not found in cart, simulate API call
      setTimeout(() => {
        setOrder({
          id: orderId || 'DEMO-1234',
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
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [orderId, state.orders]);
  
  if (isLoading) {
    return React.createElement('div', { className: 'min-h-screen pt-20 px-4' },
      React.createElement('div', { className: 'container mx-auto py-8' },
        React.createElement('div', { className: 'glass p-8 rounded-xl animate-pulse' },
          React.createElement('div', { className: 'h-[60vh] bg-dark-100 rounded-lg mb-6' }),
          React.createElement('div', { className: 'h-8 bg-dark-100 rounded mb-4 w-1/3' }),
          React.createElement('div', { className: 'h-4 bg-dark-100 rounded mb-2 w-1/4' }),
          React.createElement('div', { className: 'h-4 bg-dark-100 rounded mb-2 w-1/2' }),
          React.createElement('div', { className: 'h-4 bg-dark-100 rounded w-1/3' })
        )
      )
    );
  }
  
  return React.createElement('div', { className: 'min-h-screen pt-20 px-4' },
    React.createElement('div', { className: 'container mx-auto py-8' },
      React.createElement('div', { className: 'mb-6' },
        React.createElement(Link, {
          to: orderId === 'demo' ? '/' : '/profile',
          className: 'inline-flex items-center text-gray-400 hover:text-neon-cyan transition-colors'
        },
          React.createElement(ArrowLeft, { className: 'w-4 h-4 mr-1' }),
          orderId === 'demo' ? 'Back to Home' : 'Back to Orders'
        )
      ),
      
      React.createElement(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      },
        React.createElement('h1', { className: 'text-3xl font-display font-bold neon-text-cyan mb-6' },
          t('delivery.title')
        ),
        
        React.createElement('div', { className: 'glass p-4 rounded-xl mb-8' },
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-center' },
            React.createElement('div', { className: 'p-4' },
              React.createElement('p', { className: 'text-gray-400 mb-1' }, t('delivery.orderId')),
              React.createElement('p', { className: 'font-bold text-neon-cyan' }, order.id)
            ),
            React.createElement('div', { className: 'p-4' },
              React.createElement('p', { className: 'text-gray-400 mb-1' }, t('delivery.origin')),
              React.createElement('p', { className: 'font-bold' },
                React.createElement('span', { className: 'inline-flex items-center' },
                  React.createElement(Map, { className: 'w-4 h-4 mr-1' }),
                  `${order.origin || 'SG'} (Singapore)`
                )
              )
            ),
            React.createElement('div', { className: 'p-4' },
              React.createElement('p', { className: 'text-gray-400 mb-1' }, t('delivery.destination')),
              React.createElement('p', { className: 'font-bold' },
                React.createElement('span', { className: 'inline-flex items-center' },
                  React.createElement(Map, { className: 'w-4 h-4 mr-1' }),
                  `${order.shippingAddress.country} (${order.shippingAddress.city})`
                )
              )
            )
          )
        ),
        
        React.createElement('div', { className: 'mb-8' },
          React.createElement(DeliveryTracker, {
            orderId: order.id,
            originCountry: order.origin || 'SG',
            destinationCountry: order.shippingAddress.country
          })
        ),
        
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-8' },
          React.createElement('div', { className: 'lg:col-span-2' },
            React.createElement('h2', { className: 'text-xl font-display font-bold mb-4' },
              'Order Items'
            ),
            
            React.createElement('div', { className: 'glass rounded-xl overflow-hidden' },
              order.items.map((item, index) => 
                React.createElement('div', {
                  key: index,
                  className: `p-4 flex items-center ${
                    index < order.items.length - 1 ? 'border-b border-dark-100' : ''
                  }`
                },
                  React.createElement('div', { className: 'w-16 h-16 rounded overflow-hidden mr-4 flex-shrink-0' },
                    React.createElement('img', {
                      src: item.image || `https://picsum.photos/seed/${item.id}/200/200`,
                      alt: item.title,
                      className: 'w-full h-full object-cover'
                    })
                  ),
                  React.createElement('div', { className: 'flex-grow' },
                    React.createElement('h3', { className: 'font-medium' }, item.title),
                    React.createElement('div', { className: 'flex justify-between text-sm text-gray-400 mt-1' },
                      React.createElement('p', null, `Qty: ${item.quantity}`),
                      React.createElement('p', null, `$${item.price.toFixed(2)}`)
                    )
                  )
                )
              )
            )
          ),
          
          React.createElement('div', null,
            React.createElement('h2', { className: 'text-xl font-display font-bold mb-4' },
              'Shipping Details'
            ),
            
            React.createElement('div', { className: 'glass rounded-xl overflow-hidden p-4 mb-6' },
              React.createElement('div', { className: 'flex items-start mb-4' },
                React.createElement(Package, { className: 'w-5 h-5 text-neon-cyan mr-2 mt-0.5' }),
                React.createElement('div', null,
                  React.createElement('p', { className: 'font-bold' }, order.shippingAddress.name),
                  React.createElement('p', { className: 'text-gray-400 text-sm' }, order.shippingAddress.street),
                  React.createElement('p', { className: 'text-gray-400 text-sm' },
                    `${order.shippingAddress.city}, ${order.shippingAddress.zipcode}`
                  ),
                  React.createElement('p', { className: 'text-gray-400 text-sm' }, order.shippingAddress.country)
                )
              ),
              
              React.createElement('div', { className: 'border-t border-dark-100 pt-4' },
                React.createElement('p', { className: 'text-sm text-gray-400 mb-1' }, 'Estimated Delivery'),
                React.createElement('p', { className: 'font-bold' }, '3-5 Business Days')
              )
            ),
            
            React.createElement('h2', { className: 'text-xl font-display font-bold mb-4' },
              'Order Summary'
            ),
            
            React.createElement('div', { className: 'glass rounded-xl overflow-hidden p-4' },
              React.createElement('div', { className: 'flex justify-between mb-2' },
                React.createElement('p', { className: 'text-gray-400' }, 'Subtotal'),
                React.createElement('p', null, `$${(order.total - order.shipping - order.tax).toFixed(2)}`)
              ),
              React.createElement('div', { className: 'flex justify-between mb-2' },
                React.createElement('p', { className: 'text-gray-400' }, 'Shipping'),
                React.createElement('p', null, `$${order.shipping.toFixed(2)}`)
              ),
              React.createElement('div', { className: 'flex justify-between mb-4' },
                React.createElement('p', { className: 'text-gray-400' }, 'Tax'),
                React.createElement('p', null, `$${order.tax.toFixed(2)}`)
              ),
              React.createElement('div', { className: 'flex justify-between border-t border-dark-100 pt-3 font-bold' },
                React.createElement('p', null, 'Total'),
                React.createElement('p', { className: 'text-neon-cyan' }, `$${order.total.toFixed(2)}`)
              )
            )
          )
        )
      )
    )
  );
};

export default DeliveryTrackingPage;