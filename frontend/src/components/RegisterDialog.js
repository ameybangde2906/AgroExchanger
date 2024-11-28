import { useState } from 'react';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import '../styles/RegisterLogin.css';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LocationDropdown from './LocationDropdown';
import { FormControl, MenuItem } from '@mui/material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { closeLogin, openLogin } from '../redux/slices/loginForm';

const Lable = styled.p`
margin-bottom: 10px;
font-weight: 500;
`

export default function RegisterDialog() {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.loginForm.open)
  const [showPassword, setShowPassword] = React.useState(false); // State to toggle password visibility
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [formData, setFormData] = useState({
    userType: '',
    name: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    address: {
      district: '',
      subDistrict: '',
      village: '',
      state: '',
    },
  });
  const [error, setError] = useState('');
  const { t } = useTranslation('login');

  const handleClickOpen = () => {
    dispatch(openLogin())
  };

  const handleClose = () => {
    dispatch(closeLogin())
  };

  const getPlaceholder = () => {
    switch (formData.userType) {
      case 'trader': return t('Shop Name');
      case 'institutional': return t('Institution Name');
      default: return t('Full Name');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      address: {
        ...prevData.address,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegistering
        ? 'http://localhost:5000/api/auth/register'
        : 'http://localhost:5000/api/auth/login';

      if (isRegistering && (!formData.name || !formData.mobileNumber || !formData.password)) {
        setError('All fields are required for registration.');
        return;
      }

      if (!isRegistering && (!formData.mobileNumber || !formData.password)) {
        setError('Mobile number and password are required for login.');
        return;
      }

      const payload = isRegistering
        ? {
          name: formData.name,
          mobileNumber: formData.mobileNumber,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          userType: formData.userType,
          address: {
            district: formData.address.district,
            subDistrict: formData.address.subDistrict,
            village: formData.address.village,
            state: formData.address.state,
          },
        }
        : {
          mobileNumber: formData.mobileNumber,
          password: formData.password,
        };

      const response = await axios.post(url, payload, { withCredentials: true });

      if (response) {
        window.location.href = '/';
      }

      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while processing your request.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <React.Fragment>
      <button variant="contained" onClick={handleClickOpen} className='text-[14px] bg-green-700 text-white px-3 py-1 rounded-full'>
        Login / Register
      </button>
      <Dialog
        open={open}
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="register-dialog-title"
        aria-describedby="register-dialog-description"
      >
        <DialogTitle className="flex justify-between items-center p-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isRegistering ? t('register') : t('login')}
          </h2>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <div className="flex items-center justify-center h-full p-2">
            <div className="bg-white p-2 w-full max-w-lg">
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-6" >
                <div>
                  {isRegistering && <Lable >Basic Details: </Lable>}
                  <div className={isRegistering ? `grid grid-cols-2 gap-4` : ``}>
                    {isRegistering && <div>
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          select
                          label={t('Type of Buyer/Seller')}
                          value={formData?.userType}
                          onChange={handleChange}
                          name="userType"
                          variant="outlined"
                          size="small"
                          fullWidth
                        >

                          <MenuItem value="">{t('Select Type')}</MenuItem>
                          <MenuItem value="individual">{t('Individual')}</MenuItem>
                          <MenuItem value="trader">{t('Trader')}</MenuItem>
                          <MenuItem value="institutional">{t('Institutional')}</MenuItem>
                        </TextField>
                      </FormControl>
                    </div>}

                    {isRegistering && (
                      <div>
                        <TextField
                          id="name"
                          name="name"
                          label={getPlaceholder()}
                          variant="outlined"
                          value={formData?.name}
                          onChange={handleChange}
                          size='small'
                          fullWidth
                          required
                        />
                      </div>
                    )}

                    <div>
                      <TextField
                        id="mobileNumber"
                        name="mobileNumber"
                        label={t('mobileNumber')}
                        variant="outlined"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        size='small'
                        fullWidth
                        required

                      />
                    </div>
                  </div>
                </div>


                <div>
                  {isRegistering && <Lable>Location : </Lable>}
                  {isRegistering && <LocationDropdown
                    onStateChange={(state) => handleAddressChange('state', state)}
                    onDistrictChange={(district) => handleAddressChange('district', district)}
                    onSubDistrictChange={(subDistrict) => handleAddressChange('subDistrict', subDistrict)}
                    onVillageChange={(village) => handleAddressChange('village', village)}
                  />}
                </div>

                <div>
                  {isRegistering && <Lable>Set Password: </Lable>}
                  <div className='flex gap-x-4'>

                    <TextField
                      id="password"
                      name="password"
                      label={t('password')}
                      type={showPassword ? 'text' : 'password'} // Toggle between text and password
                      variant="outlined"
                      value={formData.password}
                      onChange={handleChange}
                      size='small'
                      fullWidth
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility}>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {isRegistering && (
                      <TextField
                        id="confirmPassword"
                        name="confirmPassword"
                        label={t('confirmPassword')}
                        type="password" // Keep confirmPassword field hidden
                        variant="outlined"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        size='small'
                        fullWidth
                        required
                      />

                    )}
                  </div>
                </div>


                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-2 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                >
                  {isRegistering ? t('registerButton') : t('loginButton')}
                </button>

                <div className="text-center">
                  <p
                    className="mt-4 text-sm text-gray-600 cursor-pointer"
                    onClick={() => setIsRegistering(!isRegistering)}
                  >
                    {isRegistering ? t('alreadyUser') : t('newUser')}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}



