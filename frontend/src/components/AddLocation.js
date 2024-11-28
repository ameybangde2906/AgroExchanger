import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import LocationDropdown from './LocationDropdown';


const AddLocation = () => {
    const queryClient = useQueryClient();
    const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });
    const { t } = useTranslation('profile');

    // Form states for all fields
    const [formData, setFormData] = useState({
        address: {
            district: '',
            subDistrict: '',
            village: '',
            state: '',
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


    // Mutation to update buyer profile
    const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/update`, {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
            ]);
        },
        onError: (error) => { },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
        window.location.href = '/buyorsell';
    };


    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="container mx-auto mt-5 p-5 max-w-lg bg-white shadow-lg rounded-lg">
            <h1 className='text-center text-xl'>Welcome, {authUser?.name}</h1>
            <h3 className='text-center m-3 text-red-600'> {!formData.address.state  && "Add your location first !"}</h3>

            <form onSubmit={handleSubmit} className='mt-3'>

                <label className='font-medium'>Location</label>
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
                    {isUpdating ? 'Submiting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default AddLocation;
