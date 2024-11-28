import React from 'react'
import SellFormDialog from '../dialogs/SellCrops'
import { useDispatch } from 'react-redux'
import { openLogin } from '../redux/slices/loginForm'
import { useQuery } from '@tanstack/react-query'
import FilterSlider from '../sliders/FilterSlider'
import OptionsGrid from '../components/OptionsGrid'
import { LocationOnRounded } from '@mui/icons-material'


const Crops = () => {
    const dispatch = useDispatch()
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const location = JSON.parse(localStorage.getItem('currentLocation'))

    const handleLogin = () => {
        dispatch(openLogin())
    }
    return (
        <>
            {location?.address && <div className='py-3 text-gray-500 text-[13px] max-w-[1200px] mx-auto my-0'>
                <LocationOnRounded sx={{fontSize:'15px'}} />  {`${location?.address}`}
            </div>}
            <div >
                <OptionsGrid />
            </div>

            <div className='flex flex-col justify-center items-center py-5 max-w-[500px] mx-auto my-5 text-lg border-[1px]'>
                Want to sell crops, vegetables or fruits ? {authUser ? <SellFormDialog /> : <button className='rounded-lg text-white mt-5 py-1 px-5 bg-green-700' onClick={handleLogin}>Click Here</button>}
            </div>

            <div className=' '>

                <FilterSlider />

            </div>
        </>
    )
}

export default Crops