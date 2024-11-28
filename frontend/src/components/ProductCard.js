import { Box } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter'

const ProductCard = ({ order }) => {
    return (
        <Link to={`/product/${order._id}`}>
            <div className="bg-white border rounded-lg shadow-md p-4 flex space-x-3" key={order._id}>
                <div className="flex-1 space-y-1">
                    <p className="text-lg font-bold text-gray-700">{order.productName}</p>
                    <p className="text-sm font-bold text-gray-700">Variety: <span className="font-normal">{order.productType}</span></p>
                    <p className="text-sm font-bold text-gray-700">Speciality: <span className="font-normal">{capitalizeFirstLetter(order.speciality)}</span></p>
                    <p className="text-sm font-bold text-gray-700">Quantity: <span className="font-normal">{order.quantity} {capitalizeFirstLetter(order.quantityUnit)} </span></p>
                    <p className="text-sm font-bold text-gray-700">Price: <span className="font-normal">₹{order.price} / {capitalizeFirstLetter(order.quantityUnit)} </span></p>
                    <p className="text-sm font-bold text-gray-700">Location: <span className="font-normal">{order.address.village}</span></p>
                </div>
                <div className="w-40 h-40">
                    <img
                        src={order.productImage[0]}
                        alt={`${order.productName} image`}
                        className="w-full h-full object-cover rounded"
                    />
                </div>
            </div>
        </Link>

    )
}

export default ProductCard