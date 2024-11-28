// src/components/OrderList.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ImageDialog from '../dialogs/ImageDialog';
import NegotiationDialog from '../dialogs/NegotiationDialog';
import ProfileDialog from '../dialogs/UserProfileDialog';

const OrderList = ({ orders }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const cellClass = "border border-gray-400 px-2 py-2 text-[13px]";
  const headerCellClass = `${cellClass} font-bold bg-blue-400 border-white text-white`;
  const headers = [
    "Sr No.",
    "Seller ID",
    "Seller District",
    "Seller Sub-District",
    "Seller Village",
    "Category",
    "Crop Name",
    "Crop Type",
    "Price",
    "Weight",
    "Images",
    "Action"
  ];

  return (
    <div className="p-5">
      <h3 className="text-xl font-semibold mb-4">Available Orders</h3>
      {orders.length > 0 ? (
        <table className="table-auto w-full text-center border border-gray-300 border-collapse">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className={headerCellClass}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className={cellClass}>{index + 1}</td>
                <td className={`${cellClass} text-blue-500 cursor-pointer hover:underline`}>
                  <ProfileDialog seller={order?.seller} />
                </td>
                <td className={cellClass}>{order.seller?.address?.district}</td>
                <td className={cellClass}>{order.seller?.address?.subDistrict}</td>
                <td className={cellClass}>{order.seller?.address?.village}</td>
                <td className={cellClass}>{order.category}</td>
                <td className={cellClass}>{order.productName}</td>
                <td className={cellClass}>{order.productVariety}</td>
                <td className={cellClass}>{order.price}</td>
                <td className={cellClass}>{order.quantity}</td>
                <td className={`${cellClass} text-blue-500 cursor-pointer hover:underline`}>
                  <ImageDialog images={order.productImage} />
                </td>

                <td className={cellClass}>
                    <NegotiationDialog orderId={order?._id} user={authUser} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders available</p>
      )}
    </div>
  );
};

export default OrderList;




