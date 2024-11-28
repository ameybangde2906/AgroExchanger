import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';

export default function CounterOfferDialog({ product, productId }) {
    const [open, setOpen] = React.useState(false);
    const [showPasswordInput, setShowPasswordInput] = React.useState(false);
    const [offerPrice, setOfferPrice] = React.useState('');
    const [offerQuantity, setOfferQuantity] = React.useState(null);
    const [password, setPassword] = React.useState('');
    const [validationError, setValidationError] = React.useState('');
    const [quantityError, setQuantityError] = React.useState('');
    const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });
    const [error, setError] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setShowPasswordInput(false);
        setOfferPrice('');
        setOfferQuantity('');
        setPassword('');
        setValidationError('');
        setError('');
        setQuantityError('')
    };

    const handleConfirmClick = () => {
        let hasError = false;

        // Validate offer price
        if (offerPrice < product.allowedPriceEntry) {
            setValidationError(`Offer price must be at least ₹${product?.allowedPriceEntry}`);
            hasError = true;
        } else {
            setValidationError('');
        }

        // Validate offer quantity
        if (!offerQuantity || offerQuantity <= 0) {
            setQuantityError('Quantity must be at least 1.');
            hasError = true;
        } else {
            setQuantityError('');
        }

        // If there are no errors, proceed
        if (!hasError) {
            setShowPasswordInput(true);
        }
    };


    const handlePasswordSubmit = async () => {
        try {
            if (isLoading || !authUser) {
                alert("User data is not available. Please try again later.");
                return;
            }

            await axios.post(
                'http://localhost:5000/api/negotiations',
                {
                    orderId: productId,
                    buyerId: authUser._id,
                    offerPrice,
                    offerQuantity,
                    offerQuantityUnit: product?.quantityUnit,
                    password: password,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            alert("Negotiation started successfully!");
            handleClose();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Incorrect password. Please try again.')
            } else {
                alert("Failed to start negotiation. Please try again.");
            }
        }
    };

    return (
        <React.Fragment>
            <button
                onClick={handleClickOpen}
                className='rounded-lg bg-green-500 text-white px-6 py-2 font-bold'
            >
                Make Counter Bid
            </button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    '& .MuiDialog-paper': {
                        width: '400px',
                        padding: '10px',
                        position: 'relative',
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {showPasswordInput ? "Password" : "Add your bid"}
                    <IconButton onClick={handleClose} sx={{ marginRight: '-12px' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {!showPasswordInput ? (
                        <React.Fragment>
                            <DialogContentText id="alert-dialog-description">
                                <p>{`Product: ${capitalizeFirstLetter(product?.productName)}`}</p>
                                <p>{`Quantity: ${product?.quantity} ${capitalizeFirstLetter(product?.quantityUnit)}`}</p>
                                <p>{`Price per unit: ₹${product?.price} / ${capitalizeFirstLetter(product?.quantityUnit)}`}</p>
                                <p>{`Total Cost: ₹${product?.price * product?.quantity}`}</p>
                                {product?.description && <p>{`Description: ${product?.description}`}</p>}
                                {product?.sellerName && <p>{`Seller: ${capitalizeFirstLetter(product?.sellerName)}`}</p>}
                            </DialogContentText>
                            <TextField
                                label="Offer Price"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={offerPrice}
                                size="small"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setOfferPrice(inputValue);

                                    // Validate dynamically as user types
                                    if (inputValue < product.allowedPriceEntry) {
                                        setValidationError(`Offer price must be at least ₹${product.allowedPriceEntry}`);
                                    } else {
                                        setValidationError(''); // Clear error if input is valid
                                    }

                                }}
                                sx={{ marginBottom: '20px', marginTop: '10px' }}
                                error={!!validationError}
                                helperText={validationError}
                            />
                            <TextField
                                label="Offer Quantity"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={offerQuantity}
                                size="small"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setOfferQuantity(inputValue);

                                    // Validate dynamically as the user types
                                    if (inputValue <= 0) {
                                        setQuantityError('Quantity must be atleast 1.');
                                    } else {
                                        setQuantityError(''); // Clear error if input is valid
                                    }
                                }}
                                sx={{ marginBottom: '20px' }}
                                error={!!quantityError} // Error state
                                helperText={quantityError} // Show error message
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <label>Enter your password to confirm this order:</label>
                            <p className='text-sm text-red-400'>{error}</p>
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={password}
                                size="small"
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ marginBottom: '20px', marginTop: '10px' }}
                            />
                        </React.Fragment>
                    )}
                </DialogContent>
                <DialogActions>
                    {showPasswordInput ? (
                        <React.Fragment>
                            <Button
                                variant="contained"
                                onClick={() => setShowPasswordInput(false)}
                                sx={{
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#218838',
                                    },
                                }}
                            >
                                back
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handlePasswordSubmit}
                                sx={{
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#218838',
                                    },
                                }}
                            >
                                Submit
                            </Button>
                        </React.Fragment>

                    ) : (
                        <React.Fragment>
                            <Button
                                onClick={handleClose}
                                sx={{
                                    backgroundColor: '#ff2252',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: 'red',
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmClick}
                                autoFocus
                                sx={{
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#218838',
                                    },
                                }}
                            >
                                Submit
                            </Button>
                        </React.Fragment>
                    )}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
