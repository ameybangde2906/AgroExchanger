// OrderList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch seller orders
  const fetchSellerOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/seller`, { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  // Fetch negotiations for a specific order
  const fetchNegotiations = async (orderId) => {
    setSelectedOrderId(orderId);
    try {
      const response = await axios.get(`http://localhost:5000/api/negotiations/order/${orderId}`, { withCredentials: true });
      setNegotiations(response.data);
    } catch (error) {
      console.error('Error fetching negotiations:', error);
      setError('Failed to fetch negotiations. Please try again.');
    }
  };

  // Handle status change of a negotiation
  const handleStatusChange = async (negotiationId, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/negotiations/${negotiationId}`, { status });
      setNegotiations((prevNegotiations) =>
        prevNegotiations.map((n) => (n._id === negotiationId ? response.data : n))
      );
    } catch (error) {
      console.error('Error updating negotiation status:', error);
      setError('Failed to update negotiation status.');
    }
  };

  return (
    <div className="orders-section bg-white p-6 rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="border-b-2 p-3">Sr No.</th>
              <th className="border-b-2 p-3">Seller Id</th>
              <th className="border-b-2 p-3">Product Name</th>
              <th className="border-b-2 p-3">Category</th>
              <th className="border-b-2 p-3">Price</th>
              <th className="border-b-2 p-3">Quantity</th>
              <th className="border-b-2 p-3">Images</th>
              <th className="border-b-2 p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {orders.map((order, index) => (
              <React.Fragment key={order._id}>
                <tr>
                  <td className="border-b p-3">{index + 1}</td>
                  <td className="border-b p-3">{order.seller}</td>
                  <td className="border-b p-3">{order.productName}</td>
                  <td className="border-b p-3">{order.category}</td>
                  <td className="border-b p-3">₹{order.price}</td>
                  <td className="border-b p-3">{order.quantity}</td>
                  <td className="border-b p-3">click here</td>
                  <td className="border-b p-3">
                    <button
                      onClick={() => fetchNegotiations(order._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      View Bids
                    </button>
                  </td>
                </tr>
                {selectedOrderId === order._id && (
                  <tr>
                    <td colSpan="7" className="p-3">
                      {negotiations.length > 0 ? (
                        <table className="w-full mt-4 border-collapse text-center">
                          <thead>
                            <tr>
                              <th className="border-b-2 p-3">Sr No.</th>
                              <th className="border-b-2 p-3">Bidder ID</th>
                              <th className="border-b-2 p-3">Bidder State</th>
                              <th className="border-b-2 p-3">Bidder District</th>
                              <th className="border-b-2 p-3">Bidder Sub-District</th>
                              <th className="border-b-2 p-3">Bidder's Price</th>
                              <th className="border-b-2 p-3">Bidder's Quantity</th>
                              <th className="border-b-2 p-3">Action</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {negotiations.map((negotiation, index) => (
                              <tr key={negotiation._id}>
                                <td className="border-b p-3">{index + 1}</td>
                                <td className="border-b p-3">{negotiation.bidderId}</td>
                                <td className="border-b p-3">{negotiation.state}</td>
                                <td className="border-b p-3">{negotiation.district}</td>
                                <td className="border-b p-3">{negotiation.subDistrict}</td>
                                <td className="border-b p-3">₹{negotiation.price}</td>
                                <td className="border-b p-3">{negotiation.quantity}</td>
                                <td className="border-b p-3">
                                  <button
                                    onClick={() => handleStatusChange(negotiation._id, 'accepted')}
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(negotiation._id, 'declined')}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                  >
                                    Decline
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="mt-2">No negotiations available.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default OrderList;

