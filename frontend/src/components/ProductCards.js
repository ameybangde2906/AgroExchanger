import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import ImageDialog from "../dialogs/ImageDialog";
import { Link } from "react-router-dom";

const ProductCards = ({ filters, view }) => {
    const [orders, setOrders] = useState([]);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch orders from the API
    const fetchOrders = async () => {
        if (!location) {
            console.error("Location is not available");
            return;
        }

        setLoading(true);
        console.log("Fetching orders for location:", location);

        try {
            const response = await axios.get("http://localhost:5000/api/orders", {
                params: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    maxDistance: filters.maxDistance || 50000,
                    page: filters.page || 1,
                    limit: filters.limit || 10,
                    minPrice: filters.priceRange?.[0] || 0,
                    maxPrice: filters.priceRange?.[1] || Number.MAX_SAFE_INTEGER,
                    cropName: Object.keys(filters.cropList || {}).filter((key) => filters.cropList[key]),
                },
            });
            setOrders(response.data.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initialize location from localStorage on mount
    useEffect(() => {
        const storedLocation = localStorage.getItem("currentLocation");
        if (storedLocation) {
            try {
                setLocation(JSON.parse(storedLocation));
            } catch (error) {
                console.error("Invalid location format in localStorage:", error);
            }
        }
    }, []);

    // Listen for custom "locationUpdated" event
    useEffect(() => {
        const handleLocationUpdated = (event) => {
            const updatedLocation = event.detail;
            setLocation(updatedLocation);
        };

        window.addEventListener("locationUpdated", handleLocationUpdated);

        return () => {
            window.removeEventListener("locationUpdated", handleLocationUpdated);
        };
    }, []);

    // Re-fetch orders whenever filters or location change
    useEffect(() => {
        if (location) {
            fetchOrders();
        }
    }, [filters, location]);

    return (
        <div>
            {!view ? <div className="flex flex-wrap gap-4 mt-5">
                {loading ? (
                    <div>Loading...</div>
                ) : orders.length > 0 ? (
                    orders.map((order) => <ProductCard key={order._id} order={order} view={view} />)
                ) : (
                    <p>No orders found</p>
                )}
            </div> :
                <table className="table-auto mt-5 w-full text-center border border-gray-300 border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-2 py-2 text-[13px] font-bold bg-blue-400 text-white">Sr No.</th>
                            <th className="border border-gray-400 px-2 py-2 text-[13px] font-bold bg-blue-400 text-white">Product Name</th>
                            <th className="border border-gray-400 px-2 py-2 text-[13px] font-bold bg-blue-400 text-white">Variety</th>
                            <th className="border border-gray-400 px-2 py-2 text-[13px] font-bold bg-blue-400 text-white">Speciality</th>
                            <th className="border border-gray-400 px-2 py-2 text-[13px] font-bold bg-blue-400 text-white">Quantity</th>
                            <th className="border border-gray-400 px-2 py-2 text-[13px] font-bold bg-blue-400 text-white">Price</th>
                            <th className="border border-gray-400 px-2 py-2 text-[13px] font-bold bg-blue-400 text-white">Location</th>
                            <th className="border border-gray-400 px-2 py-2 text-[13px] font-bold bg-blue-400 text-white">Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <div>Loading...</div>
                        ) : orders.length > 0 ? (
                            orders.map((order, index) =>
                                <tr key={order._id} className="hover:bg-gray-100">
                                    <td className="border border-gray-400 px-2 py-2 text-[13px]">{index + 1}</td>
                                    <td className="border border-gray-400 px-2 py-2 text-[13px]"><Link to={`/product/${order._id}`}>{order.productName} </Link></td>
                                    <td className="border border-gray-400 px-2 py-2 text-[13px]">{order.productType}</td>
                                    <td className="border border-gray-400 px-2 py-2 text-[13px]">{capitalizeFirstLetter(order.speciality)}</td>
                                    <td className="border border-gray-400 px-2 py-2 text-[13px]">{order.quantity} {capitalizeFirstLetter(order.quantityUnit)}</td>
                                    <td className="border border-gray-400 px-2 py-2 text-[13px]">₹{order.price} / {capitalizeFirstLetter(order.quantityUnit)}</td>
                                    <td className="border border-gray-400 px-2 py-2 text-[13px]">{order.address.village}</td>
                                    <td className="border border-gray-400 px-2 py-2 text-[13px]">
                                        <ImageDialog images={order.productImage} />
                                    </td>
                                </tr>

                            )
                        ) : (
                            <p>No orders found</p>
                        )}
                    </tbody>
                </table>

            }

        </div>
    );
};

export default ProductCards;
