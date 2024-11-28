// src/components/NegotiationThread.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NegotiationThread = ({ orderId, user }) => {
  const [negotiations, setNegotiations] = useState([]);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerQuantity, setOfferQuantity] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for submit button
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch existing negotiations
  useEffect(() => {
    const fetchNegotiations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/negotiations/order/${orderId}`);
        setNegotiations(response.data);
      } catch (error) {
        console.error('Error fetching negotiations:', error);
      }
    };

    fetchNegotiations();
  }, [orderId]);

  // Handle submitting a counter-offer
  const handleSubmitOffer = async () => {
    if (!offerPrice || offerPrice <= 0 || !offerQuantity || offerQuantity <= 0) {
      setErrorMessage('Please enter a valid price and quantity.');
      setSuccessMessage('');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await axios.post('http://localhost:5000/api/negotiations', {
        orderId,
        buyerId: user._id,
        offerPrice: parseFloat(offerPrice),
        offerQuantity: parseInt(offerQuantity, 10),
      });

      setNegotiations([...negotiations, response.data]);
      setOfferPrice('');
      setOfferQuantity('');
      setSuccessMessage('Offer submitted successfully!');
    } catch (error) {
      console.error('Error submitting offer:', error);
      setErrorMessage('Failed to submit the offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle accepting or rejecting the negotiation
  const handleStatusChange = async (negotiationId, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/negotiations/${negotiationId}`, {
        status,
      });
      setNegotiations(negotiations.map(n => (n._id === negotiationId ? response.data : n)));
    } catch (error) {
      console.error('Error updating negotiation status:', error);
    }
  };

  return (
    <div className="negotiation-thread">
      <h3>Negotiation Thread</h3>
      {negotiations.length > 0 ? (
        negotiations.map((negotiation) => (
          <div key={negotiation._id} className="negotiation-item">
            <p>Offer Price: {negotiation.offerPrice}</p>
            <p>Offer Quantity: {negotiation.offerQuantity}</p>
            <p>Status: {negotiation.status}</p>
            {user.role === 'seller' && negotiation.status === 'pending' && (
              <>
                <button onClick={() => handleStatusChange(negotiation._id, 'accepted')}>Accept</button>
                <button onClick={() => handleStatusChange(negotiation._id, 'rejected')}>Reject</button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No negotiations available yet.</p>
      )}

      {/* Render the counter-offer form only if the user is a buyer */}
      { (
        <div className="offer-form">
          <h4>Place a Counter Offer</h4>
          <input
            type="number"
            placeholder="Offer Price"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            min="0"
            disabled={loading} // Disable input when loading
          />
          <input
            type="number"
            placeholder="Offer Quantity"
            value={offerQuantity}
            onChange={(e) => setOfferQuantity(e.target.value)}
            min="1"
            disabled={loading} // Disable input when loading
          />
          <button onClick={handleSubmitOffer} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Offer'}
          </button>

          {/* Display error or success messages */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default NegotiationThread;
