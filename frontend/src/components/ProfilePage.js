import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Routes, Link } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, CircularProgress, Divider } from '@mui/material';
import { AccountCircleRounded, CheckCircle, Description, ErrorOutlineSharp, ExitToApp, Home, Logout, Sell, ShoppingBag } from '@mui/icons-material';
import BuyersProfile from '../pages/profile/Profile';
import Address from '../pages/profile/Address';
import Documents from '../pages/profile/Documents';
import { useQuery } from '@tanstack/react-query';

const ProfilePage = ({ onLogout }) => {
    const [progressValue, setProgressValue] = useState(0); // Initially set to 0
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    // Fetch profile completion percentage from API
    const fetchProfileCompletion = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/profile-completion', {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setProgressValue(Math.floor(response.data.completionPercentage));// Adjust to match the response structure
        } catch (error) {
            console.error('Error fetching profile completion:', error);
        }
    };

    useEffect(() => {
        fetchProfileCompletion();
    }, [fetchProfileCompletion]);

    return (
        <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
            {/* Left-side menu with gradient background and profile progress */}
            <Box
                width="17%"
                sx={{
                    background: 'offwhite',
                    color: 'black',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Your Profile
                </Typography>

                {/* Two-colored Profile Progress */}
                <Box position="relative" display="inline-flex" mb={4} >
                    {/* Background CircularProgress */}
                    <CircularProgress
                        variant="determinate"
                        value={100} // Full background
                        size={120}
                        thickness={3}
                        sx={{
                            color: '#e0e0e0', // Background color
                            position: 'absolute',
                        }}
                    />
                    {/* Foreground CircularProgress */}
                    <CircularProgress
                        variant="determinate"
                        value={progressValue} // Completed portion
                        size={120}
                        thickness={3}
                    />
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="h5" color="inherit">{progressValue}%</Typography>
                    </Box>
                </Box>

                {/* Profile Sections */}
                <List>
                    <ListItem button component={Link} to="/account">
                        <AccountCircleRounded sx={{ fontSize: 'large', marginRight: '5px' }} />
                        <ListItemText primary="Basic Details" />
                        {authUser.name && authUser.userType && authUser.mobileNumber && authUser.gender && authUser.dob ?
                            <CheckCircle sx={{ fontSize: 'large', marginLeft: '8px', color: 'green' }} /> :
                            <ErrorOutlineSharp sx={{ fontSize: 'large', marginLeft: '8px', color: 'red' }} />

                        }
                    </ListItem>

                    <ListItem button component={Link} to="/account/manage-address">
                        <Home sx={{ fontSize: 'large', marginRight: '5px' }} />
                        <ListItemText primary="Manage Address" />
                        {authUser.address.state && authUser.address.district && authUser.address.subDistrict && authUser.address.village && authUser.address.country && authUser.address.postalCode && authUser.address.lineOne && authUser.address.lineTwo ?
                            <CheckCircle sx={{ fontSize: 'large', marginLeft: '8px', color: 'green' }} /> :
                            <ErrorOutlineSharp sx={{ fontSize: 'large', marginLeft: '8px', color: 'red' }} />

                        }
                    </ListItem>

                    <ListItem button component={Link} to="/account/documents">
                        <Description sx={{ fontSize: 'large', marginRight: '5px' }} />
                        <ListItemText primary="Documents" />
                        {authUser.aadhar.number && authUser.pan.number ?
                            <CheckCircle sx={{ fontSize: 'large', marginLeft: '8px', color: 'green' }} /> :
                            <ErrorOutlineSharp sx={{ fontSize: 'large', marginLeft: '8px', color: 'red' }} />

                        }
                    </ListItem>

                    <Divider />

                    <ListItem button component={Link} to="/account/buy-history">
                        <ShoppingBag sx={{ fontSize: 'large', marginRight: '5px' }} />
                        <ListItemText primary="Buy History" />
                    </ListItem>

                    <ListItem button component={Link} to="/account/sell-history">
                        <Sell sx={{ fontSize: 'large', marginRight: '5px' }} />
                        <ListItemText primary="Sell History" />
                    </ListItem>

                    <Divider />

                    <ListItem button onClick={onLogout}>
                        <ExitToApp sx={{ fontSize: 'large', marginRight: '5px' }} />
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Box>

            {/* Right-side content area */}
            <Box flexGrow={1} p={4} bgcolor="white">

                <Routes>
                    <Route path="/" element={<BuyersProfile fetchProfile={fetchProfileCompletion} />} />
                    <Route path="manage-address" element={<Address fetchProfile={fetchProfileCompletion} />} />
                    <Route path="documents" element={<Documents fetchProfile={fetchProfileCompletion} />} />
                    <Route path="buy-history" element={<div>Buy History Component</div>} />
                    <Route path="sell-history" element={<div>Sell History Component</div>} />
                </Routes>
            </Box>
        </Box>
    );
};

export default ProfilePage;



