import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const SellerDashboard = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    category: '',
    productName: '',
    productVariety: '',
    price: '',
    quantity: '',
    productImage:[]
  });

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const fetchNegotiations = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/negotiations/order/${orderId}`, { withCredentials: true });
      setNegotiations(response.data);
    } catch (error) {
      console.error('Error fetching negotiations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];

    if (file) {
      const updatedImages = [...newOrder.images];
      updatedImages[index] = file; // Update the specific image slot
      setNewOrder({ ...newOrder, images: updatedImages });
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...newOrder.images];
    updatedImages[index] = null; // Remove the image from the selected slot
    setNewOrder({ ...newOrder, images: updatedImages });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (newOrder.price <= 0 || newOrder.quantity <= 0) {
      setError('Price and Quantity must be greater than zero.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/orders/', newOrder, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      setOrders([...orders, response.data]);
      setNewOrder({
        category: '',
        productName: '',
        productVariety: '',
        price: '',
        quantity: '',
      });
      setError('');
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (negotiationId, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/negotiations/${negotiationId}`, {
        status,
      });
      setNegotiations(negotiations.map((n) => (n._id === negotiationId ? response.data : n)));
    } catch (error) {
      console.error('Error updating negotiation status:', error);
    }
  };

  return (
    <div className="dashboard-container p-8 bg-gray-100">
      <span onClick={onLogout}>Logout</span>
      <div className="dashboard-header flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold">Seller Dashboard</h2>
      </div>

      <div className="form-section bg-white p-6 rounded shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Place a New Order</h3>
        <form className="flex flex-col gap-2" onSubmit={handleOrderSubmit}>

            <select
              name="category"
              className="border p-2 rounded text-gray-400"
              value={newOrder.category}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="grains">Grains/Cereals</option>
              <option value="oilseeds">Oilseeds</option>
              <option value="pulses">Pulses/Legumes</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="fibers">Fibers</option>
              <option value="spices">Spices</option>
              <option value="beverages">Beverage Crops</option>
              <option value="sugar">Sugar Crops</option>
              <option value="tubers">Tuber and Root Crops</option>
              <option value="nuts">Nuts</option>
              <option value="medicinal">Medicinal and Aromatic Plants</option>
            </select>

            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              className="border p-2 rounded"
              value={newOrder.productName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="productVariety"
              placeholder="Product Variety"
              className="border p-2 rounded "
              value={newOrder.productVariety}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="border p-2 rounded"
              value={newOrder.price}
              onChange={handleInputChange}
              required
              min="1"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              className="border p-2 rounded"
              value={newOrder.quantity}
              onChange={handleInputChange}
              required
              min="1"
            />

          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>

      <div className="orders-section bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order._id} className="border-b py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p>Product Name: {order.productName}</p>
                    <p>Category: {order.category}</p>
                    <p>Price: ₹{order.price}</p>
                    <p>Quantity: {order.quantity}</p>
                  </div>
                  <button
                    onClick={() => {
                      fetchNegotiations(order._id);
                      setSelectedOrderId(order._id);
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    View Negotiations
                  </button>
                </div>

                {selectedOrderId === order._id && (
                  <div className="negotiations border-t-2">
                    <h5 className="font-semibold mt-2">Negotiations</h5>
                    {negotiations.length > 0 ? (
                      <ul>
                        {negotiations.map((negotiation) => (
                          <li key={negotiation._id} className="flex justify-between py-2">
                            <span>{negotiation.status}</span>
                            <div>
                              <button
                                onClick={() => handleStatusChange(negotiation._id, 'accepted')}
                                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusChange(negotiation._id, 'declined')}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                              >
                                Decline
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No negotiations yet.</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;


