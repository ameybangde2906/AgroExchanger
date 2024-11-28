import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { DialogContent, TextField, MenuItem, FormControl, Button, CircularProgress, Autocomplete, InputAdornment } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { closeForm, openForm } from '../redux/slices/sellForms';
import LocationDropdown from '../components/LocationDropdown';
import ClearIcon from '@mui/icons-material/Clear';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        overflow: 'hidden',
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(2),
    },
}));

export default function SellFormDialog() {
    const dispatch = useDispatch();
    const value = useSelector(store => store.sellForm.open);

    const [open, setOpen] = useState(value);
    const [suggestions, setSuggestions] = useState([]); // For storing API suggestions
    const [loadingSuggestions, setLoadingSuggestions] = useState(false); // For handling suggestion loading state

    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        category: '',
        productName: '',
        price: '',
        quantity: '',
        productImage: [],
        productType: '',
        speciality: '',
        address: {
            lineOne: '',
            lineTwo: '',
            state: '',
            district: '',
            subDistrict: '',
            village: '',
            country: 'India',
            pincode: ''
        },
        pickUpDate: '',
        quantityUnit: '',
        allowedPriceEntry: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            // Handle nested fields
            const [parent, child] = name.split('.');
            setNewOrder((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            // Handle regular fields
            setNewOrder((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        setOpen(value);
    }, [value]);

    const getPlaceholder = () => {
        switch (newOrder.category) {
            case 'grains': return ('Grain');
            case 'vegetables': return ('Vegetable');
            case 'fruits': return ('Fruit');
            default: return ('Product');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (newOrder.productImage.length >= 4) {
            setError("You can't upload more than 4 images.");
            return;
        }
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setNewOrder((prevOrder) => ({
                    ...prevOrder,
                    productImage: [...prevOrder.productImage, base64String],
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddressChange = (field, value) => {
        setNewOrder(prevData => ({
            ...prevData,
            address: {
                ...prevData.address,
                [field]: value
            }
        }));
    };


    const handleRemoveImage = (index) => {
        setNewOrder((prevOrder) => ({
            ...prevOrder,
            productImage: prevOrder.productImage.filter((_, i) => i !== index),
        }));
    };

    const fetchSuggestions = async (query) => {

        if (!query) return setSuggestions([]);
        try {
            setLoadingSuggestions(true);
            const response = await axios.get(`http://localhost:5000/api/crops/${newOrder.category}/${query}`);
            setSuggestions(response.data); // Assuming the API returns an array of crop names
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoadingSuggestions(false);
        }
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
                price: '',
                quantity: '',
                productImage: [],
                productType: '',
                speciality: '',
                address: {
                    lineOne: '',
                    lineTwo: '',
                    state: '',
                    district: '',
                    subDistrict: '',
                    village: '',
                    country: '',
                    pincode: '',
                },
                pickUpDate: '',
                quantityUnit: '',
                allowedPriceEntry: '',
            });
            setError('');
        } catch (error) {
            console.error('Error placing order:', error);
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClickOpen = () => dispatch(openForm());
    const handleClose = () => {
        dispatch(closeForm())
        setNewOrder({
            category: '',
            productName: '',
            price: '',
            quantity: '',
            productImage: [],
            productType: '',
            speciality: '',
            address: {
                lineOne: '',
                lineTwo: '',
                state: '',
                district: '',
                subDistrict: '',
                village: '',
                country: '',
                pincode: '',
            },
            pickUpDate: '',
            quantityUnit: '',
            allowedPriceEntry: '',
        });
        setError('');
    }

    return (
        <React.Fragment>
            <button onClick={handleClickOpen} className="bg-green-700 rounded-xl m-4 text-white px-3 py-1">Click here</button>
            <BootstrapDialog onClose={handleClose} open={open} fullWidth>
                <DialogTitle className='flex justify-between items-center'>
                    <span className="text-lg font-semibold">Sell Product</span>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    sx={{
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#888 #f0f0f0',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#555',
                        },
                    }}
                    dividers
                >
                    <form onSubmit={handleOrderSubmit} className=''>
                        <p className='font-semibold pb-2'>Product Details : </p>
                        <div className='grid grid-cols-2 gap-4 '>

                            <FormControl fullWidth>
                                <TextField
                                    select
                                    label='Category'
                                    name="category" value={newOrder.category} onChange={handleInputChange} required
                                    variant="outlined"
                                    size="small"
                                    fullWidth>
                                    <MenuItem value="grains">Grains</MenuItem>
                                    <MenuItem value="vegetables">Vegetables</MenuItem>
                                    <MenuItem value="fruits">Fruits</MenuItem>
                                </TextField>
                            </FormControl>

                            <div style={{ position: 'relative' }}>
                                <TextField
                                    label={`${getPlaceholder()} Name`}
                                    size="small"
                                    variant="outlined"
                                    fullWidth
                                    value={newOrder.productName}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setNewOrder((prev) => ({ ...prev, productName: value })); // Update product name
                                        fetchSuggestions(value); // Fetch suggestions based on input
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {newOrder.productName && <ClearIcon
                                                    fontSize='small'
                                                    onClick={() => { setNewOrder((prev) => ({ ...prev, productName: '' })); }}
                                                    className="cursor-pointer"
                                                    sx={{ marginRight: '4px' }}
                                                />}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {/* Suggestions Dropdown */}
                                {suggestions.length > 0 && (
                                    <ul
                                        style={{
                                            position: 'absolute',
                                            zIndex: 10,
                                            background: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            marginTop: '5px',
                                            listStyleType: 'none',
                                            padding: 0,
                                            width: '100%',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {suggestions.map((item, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setNewOrder((prev) => ({ ...prev, productName: item.name + ` (${item.marathi_name})` })); // Set selected value
                                                    setSuggestions([]); // Clear suggestions
                                                }}
                                                style={{
                                                    padding: '10px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee',
                                                    display: 'flex'
                                                }}
                                            >
                                                {item.name} ({item.marathi_name})


                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <TextField name="productType" size='small' label={`${getPlaceholder()} Type`} value={newOrder.productType} onChange={handleInputChange} required />
                            <FormControl fullWidth>
                                <TextField
                                    select
                                    label='Speciality'
                                    name="speciality" value={newOrder.speciality} onChange={handleInputChange} required
                                    variant="outlined"
                                    size="small"
                                    fullWidth>
                                    <MenuItem value="grains">Organic</MenuItem>
                                    <MenuItem value="inorganic">Inorganic</MenuItem>
                                </TextField>
                            </FormControl>
                            <TextField name="quantity" size='small' label="Quantity" type="number" value={newOrder.quantity} onChange={handleInputChange} required />

                            <TextField
                                name="quantityUnit"
                                size="small"
                                label="Quantity Unit"
                                select
                                value={newOrder.quantityUnit}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            >
                                <MenuItem value="kg">Kilogram <span className='text-[13px]'>(kg)</span></MenuItem>
                                <MenuItem value="quintal">Quintal<span className='text-[13px]'> (1 Quintal=100kg)</span></MenuItem>
                            </TextField>

                            <TextField name="price" size='small' label={`Price / ${!newOrder.quantityUnit ? 'unit' : newOrder.quantityUnit}`} type="number" value={newOrder.price} onChange={handleInputChange} required />
                            <TextField name="allowedPriceEntry" required size='small' label={`Allowed price / ${!newOrder.quantityUnit ? 'unit' : newOrder.quantityUnit}`} type="number" value={newOrder.allowedPriceEntry} onChange={handleInputChange} />

                        </div>

                        <div className='mt-2'>
                            <p className='font-semibold py-2'>Pickup Address and Date : </p>
                            <div className='grid grid-cols-2 gap-4 pb-4'>
                                <TextField name="address.lineOne" required size='small' label="Address Line 1 " value={newOrder.address.lineOne} onChange={handleInputChange} />
                                <TextField name="address.lineTwo" size='small' label="Address Line 2 " value={newOrder.address.lineTwo} onChange={handleInputChange} />
                            </div>

                            <LocationDropdown
                                onStateChange={(state) => handleAddressChange('state', state)}
                                onDistrictChange={(district) => handleAddressChange('district', district)}
                                onSubDistrictChange={(subDistrict) => handleAddressChange('subDistrict', subDistrict)}
                                onVillageChange={(village) => handleAddressChange('village', village)}
                            />

                            <div className='grid grid-cols-2 gap-4 pt-2 pb-4'>
                                <TextField name="address.country" disabled required size='small' label="Country" value='India' onChange={handleInputChange} />
                                <TextField name="address.pincode" required size='small' label="Pincode" value={newOrder.address.pincode} onChange={handleInputChange} />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <TextField name="pickUpDate" size='small' required label="Pick Up Date" fullWidth type="date" value={newOrder.pickUpDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
                            </div>

                        </div>

                        <div className="col-span-2 mt-4">
                            <label className="block font-semibold mb-2">Upload Product Images : <span className='font-normal text-[14px]'>(Max 4 Images)</span> </label>
                            <label
                                htmlFor="file-upload"
                                className="block border-blue-500 border-2 text-blue-500 py-1 px-3 rounded-lg cursor-pointer text-center w-max"
                            >
                                Choose File
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <div className="uploaded-images flex gap-2 mt-2">
                                {newOrder.productImage.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img src={image} alt="" className="w-32 h-32 object-cover border border-gray-300 rounded-lg" />
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && <p className="text-red-500 col-span-2">{error}</p>}

                        <button type="submit" variant="contained" color="primary" disabled={loading} className="col-span-2 w-full bg-green-700 text-white rounded-xl p-2 mt-4">
                            {loading ? <CircularProgress size={24} /> : 'Sell Product'}
                        </button>
                    </form>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}
