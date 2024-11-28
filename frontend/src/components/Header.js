import React from 'react'
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationSlider from '../sliders/NotificationSlider';
import SearchComponent from './SearchBar';
import { useQuery } from '@tanstack/react-query';
import RegisterDialog from './RegisterDialog';
import LocationFetcher from './Filter';
import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';

const Header = () => {
    const { data: authUser, isLoading, isRefetching } = useQuery({
        queryKey: ["authUser"],
    });

    useEffect(() => {
        if (authUser) {

        }
    }, [authUser])

    return (
        <>
            <div className='flex justify-between items-center py-3 max-w-[1200px] mx-auto my-0 '>
                <Link to="/">
                    <img src='/logo.jpg' alt='' className='w-16' />
                </Link>

                <div className='flex w-[50%] border-[1px] border-gray-400 rounded-xl'>
                    <LocationFetcher />
                    <div className='p-1 w-[70%] border-l border-gray-400'><SearchComponent /></div>
                </div>

                <div className='flex justify-evenly items-center'>
                    <NotificationSlider />
                    {authUser ?
                        <Link to='/account' >
                            <AccountCircleIcon style={{ fontSize: 25, color: 'black', marginLeft: '10px' }} /> {/* You can adjust the size */}
                        </Link>
                        :
                    <RegisterDialog />}
                </div>

            </div>
        </>

    )
}
export default Header