// src/components/BuyerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderList from '../../components/OrderList'; // Import the OrderList component
import '../../styles/Dashboard.css'; // Import the CSS file
import FilterSlider from '../../sliders/FilterSlider';

const BuyCrops = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders'); // Replace with your actual endpoint
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="buyer-dashboard">
      <FilterSlider/>
      <section className="orders-section">
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <OrderList orders={orders.orders} />
        )}
      </section>
    </div>
  );
};

export default BuyCrops;