import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Function to fetch data from the API
    const fetchSuggestions = async (query) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:5000/api/orders/search/${query}`);
            const { productNames, categories, productVarieties } = response.data;

            // Combine all data into one suggestions array
            const combinedSuggestions = [
                ...productNames,
                ...categories,
                ...productVarieties
            ];

            // Filter suggestions that start with the search term (case insensitive)
            const filteredSuggestions = combinedSuggestions.filter(item =>
                item.toLowerCase().startsWith(query.toLowerCase())
            );

            setSuggestions(filteredSuggestions);
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce mechanism to avoid excessive API calls
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSuggestions([]); // Clear suggestions if input is empty
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            fetchSuggestions(searchTerm);
        }, 300); // Wait for 300ms before making the API request

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleClear = () => {
        setSearchTerm('');
        setSuggestions([]);
    };

    return (
        <div className='relative w-[100%] p-1'>
            <div className='flex items-center w-[100%] '>
                <SearchIcon fontSize='small' sx={{marginLeft:'4px'}}/>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder=" What are you looking for ?"
                    className='text-[14px] w-[100%] ml-2 focus:outline-none border-none'
                />
                {searchTerm && (
                    <ClearIcon 
                        fontSize='small' 
                        onClick={handleClear} 
                        className="cursor-pointer"
                        sx={{marginRight:'4px'}}
                    />
                )}
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
                <ul className='absolute left-0 right-0 bg-white border border-gray-300 mt-3 text-[14px] rounded-xl max-h-60 overflow-y-auto'>
                    {isLoading ? (
                        <li className='p-2 text-gray-500'>Loading...</li>
                    ) : (
                        suggestions.map((item, index) => (
                            <li 
                                key={index} 
                                className='p-2 cursor-pointer hover:bg-gray-100'
                            >
                                {item}
                            </li>  
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchComponent;



