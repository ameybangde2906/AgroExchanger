import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField'; // Importing TextField from Material-UI
import useUpdateProfile from '../../hooks/useUpdateProfile';
import LocationDropdown from '../../components/LocationDropdown';

const Address = ({ fetchProfile }) => {
  const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });
  const { t } = useTranslation('profile');

  // Form states for all fields
  const [formData, setFormData] = useState({
    address: {
      lineOne: '',
      lineTwo: '',
      district: '',
      subDistrict: '',
      village: '',
      state: '',
      country: 'India',
      postalCode: ''
    },
  });

  const handleAddressChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      address: {
        ...prevData.address,
        [field]: value
      }
    }));
  };


  // Fetch existing buyer profile
  useEffect(() => {
    if (authUser) {
      setFormData({
        ...formData,
        ...authUser,
        address: authUser?.address || { ...formData.address }
      });
    }
  }, [authUser]);



  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const { updateProfile, isUpdating } = useUpdateProfile();


  const calculateCompletionPercentage = () => {
    const totalFields = 8; // Total number of fields
    let filledFields = 0;

    // Count filled fields
    if (formData.address.lineOne) filledFields++;
    if (formData.address.lineTwo) filledFields++;
    if (formData.address.district) filledFields++;
    if (formData.address.subDistrict) filledFields++;
    if (formData.address.village) filledFields++;
    if (formData.address.state) filledFields++;
    if (formData.address.postalCode) filledFields++;
    if (formData.address.country) filledFields++;

    return (filledFields / totalFields) * 100;
  };

  const completionPercentage = calculateCompletionPercentage();
  const progressColor = completionPercentage === 100 ? "primary" : completionPercentage >= 50 ? "secondary" : "error";

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mx-auto mt-5 p-5 max-w-lg border-2 rounded-lg">
      <form onSubmit={(e) => {
        e.preventDefault();
        updateProfile(formData);
        fetchProfile();
      }} >


        <label className='font-medium'>Address:</label>
        <div className="grid grid-cols-2 gap-4 mb-4 mt-5">
          <TextField
            id="address.lineOne"
            name="address.lineOne"
            label={t('Line 1')}
            variant="outlined"
            value={formData.address.lineOne}
            onChange={handleInputChange}
            required
          />
          <TextField
            id="address.lineTwo"
            name="address.lineTwo"
            label={t('Line 2')}
            variant="outlined"
            value={formData.address.lineTwo}
            onChange={handleInputChange}
          />

          <TextField
            id="address.country"
            name="address.country"
            label={t('Country')}
            variant="outlined"
            value={formData.address.country}
            onChange={handleInputChange}
            disabled
          />
          <TextField
            id="address.postalCode"
            name="address.postalCode"
            label={t('Postal Code')}
            variant="outlined"
            value={formData.address.postalCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <LocationDropdown
          onStateChange={(state) => handleAddressChange('state', state)}
          onDistrictChange={(district) => handleAddressChange('district', district)}
          onSubDistrictChange={(subDistrict) => handleAddressChange('subDistrict', subDistrict)}
          onVillageChange={(village) => handleAddressChange('village', village)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Address;