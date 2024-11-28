import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import {
    Checkbox,
    FormGroup,
    FormControlLabel,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Chip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { GridView, Sort, TableRows } from '@mui/icons-material';
import ProductCards from '../components/ProductCards';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function FilterSlider() {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const [searchParams, setSearchParams] = useSearchParams();
    const [dialogOpen, setDialogOpen] = useState(false);

    const [viewMode, setViewMode] = useState(() => {
        // Initialize viewMode from localStorage
        const savedMode = localStorage.getItem('viewMode');
        return savedMode === 'true'; // Convert to boolean
    });

    const handleViewMode = () => {
        const newViewMode = !viewMode;
        setViewMode(newViewMode);
        localStorage.setItem('viewMode', newViewMode); // Save viewMode to localStorage
    };

    const [filters, setFilters] = useState({
        priceRange: [0, 10000],
        cropList: {},
        sortBy: '',
        page: 1,
        limit: 10,
    });

    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => setDialogOpen(false);

    const handleChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNestedChange = (parentField, childField, value) => {
        setFilters((prev) => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [childField]: value,
            },
        }));
    };

    const handlePriceChange = (event, newValue) => {
        handleChange('priceRange', newValue);
    };

    const handleCheckboxChange = (filter) => (event) => {
        handleNestedChange('cropList', filter, event.target.checked);
    };

    const fetchProductList = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders/orderlist', {
                params: { category: 'grains' },
            });
            const products = response.data.productNames;

            if (Array.isArray(products)) {
                setFilters((prev) => ({
                    ...prev,
                    cropList: products.reduce((acc, product) => {
                        acc[product] = !!prev.cropList[product]; // Retain checked state
                        return acc;
                    }, {}),
                }));
            } else {
                console.error('Unexpected data format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching product list:', error);
        }
    };

    const removeFilter = (filterKey, value) => {
        if (filterKey === 'priceRange') {
            setFilters((prev) => ({ ...prev, priceRange: [0, 10000] })); // Reset price range
        } else if (filterKey === 'cropList') {
            setFilters((prev) => ({
                ...prev,
                cropList: {
                    ...prev.cropList,
                    [value]: false, // Uncheck the crop
                },
            }));
        } else if (filterKey === 'sortBy') {
            setFilters((prev) => ({ ...prev, sortBy: '' })); // Reset sort
        }
    };

    const syncFiltersToURL = () => {
        const params = {};

        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
            params.minPrice = filters.priceRange[0];
            params.maxPrice = filters.priceRange[1];
        }

        const selectedCrops = Object.keys(filters.cropList).filter((crop) => filters.cropList[crop]);
        if (selectedCrops.length > 0) params.cropName = selectedCrops;

        if (filters.sortBy) params.sortBy = filters.sortBy;

        params.page = filters.page;
        params.limit = filters.limit;

        setSearchParams(params);
    };

    const loadFiltersFromURL = () => {
        const params = Object.fromEntries(searchParams.entries());

        // Update filters with URL parameters
        setFilters((prev) => ({
            ...prev,
            priceRange: [
                Number(params.minPrice) || 0,
                Number(params.maxPrice) || 10000,
            ],
            sortBy: params.sortBy || '',
            cropList: prev.cropList, // Retain crop list state
            page: Number(params.page) || 1,
            limit: Number(params.limit) || 10,
        }));

        if (params.cropName) {
            const cropNames = Array.isArray(params.cropName)
                ? params.cropName
                : [params.cropName];
            setFilters((prev) => ({
                ...prev,
                cropList: cropNames.reduce((acc, crop) => {
                    acc[crop] = true;
                    return acc;
                }, {}),
            }));
        }
    };

    useEffect(() => {
        fetchProductList();
        loadFiltersFromURL(); // Sync filters with URL on component mount
    }, []);

    useEffect(() => {
        syncFiltersToURL(); // Update URL whenever filters change
    }, [filters]);

    return (
        <div>
            <div className="max-w-[1200px] mx-auto my-4">

                <div className=''>
                    <div>
                        <button onClick={handleDialogOpen} className="text-green-700 border-2 rounded-lg border-green-700 px-3">
                            <Sort /> Filter
                        </button>
                        <button onClick={handleViewMode} className='text-green-700 border-green-700 border-2 rounded-lg ml-4 px-1'>
                            {viewMode ? <GridView /> : <TableRows />}
                        </button>
                    </div>


                    <Box mt={2}>
                        {/* Display Active Filters */}
                        {Object.keys(filters.cropList)
                            .filter((crop) => filters.cropList[crop])
                            .map((crop) => (
                                <Chip
                                    key={crop}
                                    label={crop.charAt(0).toUpperCase() + crop.slice(1)}
                                    onDelete={() => removeFilter('cropList', crop)}
                                    color="primary"
                                    style={{ marginRight: '8px' }}
                                />
                            ))}
                        {filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? (
                            <Chip
                                label={`Price: ₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`}
                                onDelete={() => removeFilter('priceRange')}
                                color="primary"
                                style={{ marginRight: '8px' }}
                            />
                        ) : null}
                        {filters.sortBy && (
                            <Chip
                                label={`Sort: ${filters.sortBy}`}
                                onDelete={() => removeFilter('sortBy')}
                                color="secondary"
                                style={{ marginRight: '8px' }}
                            />
                        )}
                    </Box>

                </div>

                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Filters</DialogTitle>
                    <DialogContent>
                        <Box mb={2}>
                            <Typography>Price Range</Typography>
                            <Slider
                                value={filters.priceRange}
                                onChange={handlePriceChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={10000}
                            />
                        </Box>
                        <Box mb={2}>
                            <Typography>Crop Names</Typography>
                            <FormGroup>
                                {Object.keys(filters.cropList).map((name) => (
                                    <FormControlLabel
                                        key={name}
                                        control={
                                            <Checkbox
                                                checked={filters.cropList[name]}
                                                onChange={handleCheckboxChange(name)}
                                            />
                                        }
                                        label={name.charAt(0).toUpperCase() + name.slice(1)}
                                    />
                                ))}
                            </FormGroup>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <ProductCards filters={filters} view={viewMode}/>

                <Box>
                    <Button
                        onClick={() => handleChange('page', Math.max(filters.page - 1, 1))}
                        disabled={filters.page === 1}
                    >
                        Previous
                    </Button>
                    <Button onClick={() => handleChange('page', filters.page + 1)}>Next</Button>
                </Box>
            </div>
        </div>
    );
}







