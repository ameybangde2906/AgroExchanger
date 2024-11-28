import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import { LinearProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import useUpdateProfile from '../../hooks/useUpdateProfile';

const BuyersProfile = ({ fetchProfile }) => {
  const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });
  const { t } = useTranslation('profile');

  const [formData, setFormData] = useState({
    userType: '',
    name: '',
    mobileNumber: '',
    dob: null,
    gender: ''
  });

  const getPlaceholder = () => {
    switch (formData.userType) {
      case 'trader': return t('Shop Name');
      case 'institutional': return t('Institution Name');
      default: return t('Name');
    }
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        ...formData,
        ...authUser,
        dob: authUser?.dob ? new Date(authUser.dob).toISOString().split('T')[0] : '',
      });
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { updateProfile, isUpdating } = useUpdateProfile();

  const calculateCompletionPercentage = () => {
    const totalFields = 5;
    const filledFields = ['name', 'mobileNumber', 'userType', 'dob', 'gender'].filter(field => formData[field]).length;
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
        fetchProfile()
      }}>
        <label className='font-medium'>Basic Details:</label>
        <div className="mb-4 mt-5">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="userType-label">{t('Type of Buyer/Seller')}</InputLabel>
            <Select
              labelId="userType-label"
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              label={t('Type of Buyer/Seller')}
              required
            >
              <MenuItem value="">{t('Select Type')}</MenuItem>
              <MenuItem value="individual">{t('Individual')}</MenuItem>
              <MenuItem value="trader">{t('Trader')}</MenuItem>
              <MenuItem value="institutional">{t('Institutional')}</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="mb-4">
          <TextField
            id="name"
            name="name"
            label={getPlaceholder()}
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <TextField
            id="mobileNumber"
            name="mobileNumber"
            label={t('Contact Number')}
            variant="outlined"
            fullWidth
            value={formData.mobileNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <TextField
            id="dob"
            name="dob"
            label={t('Date of Birth')}
            type="date"
            variant="outlined"
            fullWidth
            value={formData.dob || ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </div>

        <div className="mb-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="gender-label">{t('Gender')}</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              label={t('Gender')}
              required
            >
              <MenuItem value="">{t('Select Gender')}</MenuItem>
              <MenuItem value="male">{t('Male')}</MenuItem>
              <MenuItem value="female">{t('Female')}</MenuItem>
              <MenuItem value="other">{t('Other')}</MenuItem>
            </Select>
          </FormControl>
        </div>

        <button
          type="submit"
          className={`py-2 px-4 w-full rounded ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white font-bold'}`}
          disabled={isUpdating}
        >
          {isUpdating ? t('Updating...') : t('Update Profile')}
        </button>
      </form>
    </div>
  );
};

export default BuyersProfile;



