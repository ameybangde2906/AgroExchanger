import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function StoreSelector() {
  const { type } = useParams();
  const navigate = useNavigate()
  const handleStore = (link) => {
    localStorage.setItem('link', `/${type}/${link}`)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      {/* Top Logo Section */}
      <div className="text-center mb-8">
        {/* Replace with your random logo */}
        <h2 className="text-xl font-semibold">Select Your Store</h2>
      </div>

      {/* Store Options */}
      <div className="space-y-6 w-full max-w-md">
        {/* Block 1 - Buy Crops */}
        <div className="relative bg-gradient-to-r from-red-500 to-yellow-400 rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20231228/pngtree-serene-countryside-landscape-rye-barley-and-wheat-grains-thriving-in-a-image_13850128.png"
            alt="Grains"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative p-6 text-white">
            <h3 className="text-2xl font-bold capitalize">{type} Crops</h3>
            <p className="mt-2">Select and purchase various grains.</p>
            <button onClick={(e) => handleStore('crops')} className="mt-4 inline-block bg-white text-black py-2 px-4 rounded-full">Enter Store</button>
          </div>
        </div>

        {/* Block 2 - Buy or Rent Equipment */}
        <div className="relative bg-gradient-to-r from-green-400 to-blue-400 rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://www.tafe.com/tractors/tafe/tafe-tractor-1002-4wd.jpg"
            alt="Tractor"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative p-6 text-white">
            <h3 className="text-2xl font-bold capitalize">{type} or Rent Equipment</h3>
            <p className="mt-2">Find the best tools or rent a tractor.</p>
            <button onClick={(e) => handleStore('equipment')} className="mt-4 inline-block bg-white text-black py-2 px-4 rounded-full">Enter Store</button>
          </div>
        </div>

        {/* Block 3 - Fertilizers & Pesticides */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://c8.alamy.com/zooms/9/62581a00675d4e52aaac27d208483b4d/w4785g.jpg"
            alt="Pesticides"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative p-6 text-white">
            <h3 className="text-2xl font-bold capitalize">{type} Fertilizers & Pesticides</h3>
            <p className="mt-2">Organic and inorganic options available.</p>
            <button onClick={(e) => handleStore('pesticides')} className="mt-4 inline-block bg-white text-black py-2 px-4 rounded-full">Enter Store</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreSelector;
