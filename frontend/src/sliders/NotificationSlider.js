import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useQuery } from '@tanstack/react-query';

export default function NotificationSlider() {
    const [state, setState] = React.useState({
        right: false,
    });

    const { data: notifications } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:5000/api/notifications", {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong")
                return data
            } catch (error) {
                throw new Error(error.message);
            }
        },
    })

    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ right: open });
    };

    console.log(notifications)


    return (
        <div>
            <Button onClick={toggleDrawer(true)} color='black'><NotificationsIcon /></Button>
            <SwipeableDrawer
                anchor="right" // Set the anchor to 'right'
                open={state.right}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <Box
                    sx={{ width: 350 }} // Fixed width for the drawer
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >

                    <div>
                        <p className='p-4 text-lg font-semibold'>Notifications <NotificationsIcon fontSize='inherit'/></p>
                        <ul>
                            {notifications?.map((notification) => (
                                <li key={notification._id} className='flex items-center p-3 gap-2 border-b-2'> {/* Assuming each notification has a unique id */}
                                    <div className='w-[50%]'>
                                        <img src={notification.order.productImage[0]} />
                                    </div>
                                    <div >You got {notification.type} offer from user Id <span className='text-blue-500'>#{notification.from._id}</span> for product <span className='font-semibold'>{notification.order.productName}</span></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Box>
            </SwipeableDrawer>
        </div>
    );
}




