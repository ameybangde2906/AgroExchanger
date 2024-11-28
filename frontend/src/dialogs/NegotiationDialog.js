// src/components/NegotiationDialog.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const NegotiationDialog = ({ orderId, user }) => {
  const [open, setOpen] = useState(false);
  const [negotiations, setNegotiations] = useState([]);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerQuantity, setOfferQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchNegotiations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/negotiations/order/${orderId}`);
        setNegotiations(response.data);
      } catch (error) {
        console.error('Error fetching negotiations:', error);
      }
    };

    if (open) fetchNegotiations();
  }, [orderId, open]);

  const handleOfferSubmit = async () => {
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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button onClick={() => setOpen(true)} variant="contained" className='bg-blue-400 text-white px-3 py-1 rounded-md '>
        Bid
      </button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Bids :</DialogTitle>
        <DialogContent>
          {negotiations.length > 0 ? (
            negotiations.map((negotiation) => (
              <div key={negotiation._id}>
                <p>Offer Price: {negotiation.offerPrice}</p>
                <p>Offer Quantity: {negotiation.offerQuantity}</p>
                <p>Status: {negotiation.status}</p>
              </div>
            ))
          ) : (
            <p>No negotiations available yet.</p>
          )}

          <TextField
            label="Offer Price"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Offer Quantity"
            value={offerQuantity}
            onChange={(e) => setOfferQuantity(e.target.value)}
            fullWidth
            margin="normal"
          />

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOfferSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Offer'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NegotiationDialog;
