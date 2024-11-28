import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField'; // Importing TextField from Material-UI
import { LinearProgress } from '@mui/material';
import useUpdateProfile from '../../hooks/useUpdateProfile';

const Documents = ({ fetchProfile }) => {
    const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });
    const { t } = useTranslation('profile');

    // Form states for all fields
    const [formData, setFormData] = useState({
        aadharNumber: '',
        panNumber: '',
    });


    // Fetch existing buyer profile
    useEffect(() => {
        if (authUser) {
            setFormData({
                ...formData,
                aadharNumber: authUser.aadhar?.number || '',
                panNumber: authUser.pan?.number || '',
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
        const totalFields = 2; // Total number of fields
        let filledFields = 0;

        // Count filled fields

        if (formData.aadharNumber) filledFields++;
        if (formData.panNumber) filledFields++;
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

            }} >
                <label className='font-medium'>Documents:</label>
                <div className="mb-4 mt-5">
                    <TextField
                        id="aadharNumber"
                        name="aadharNumber"
                        label={t('Aadhar Number')}
                        variant="outlined"
                        fullWidth
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <TextField
                        id="panNumber"
                        name="panNumber"
                        label={t('Pan Number')}
                        variant="outlined"
                        fullWidth
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
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

export default Documents;