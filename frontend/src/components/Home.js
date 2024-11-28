import React from 'react'
import RegisterDialog from './RegisterDialog'
import styled from 'styled-components';
import BuySell from './BuySell';
import SearchComponent from './SearchBar';
import { useQuery } from '@tanstack/react-query';

const Heading = styled.div`
font-size: 20px;
font-weight: 700;
`
const Box = styled.div`
padding: 0 3%;
`
const Container = styled.div`
margin-bottom: 3% ;
`
const Home = () => {
  

    return (
        <div>
            <div className='flex justify-around items-center bg-black bg-opacity-60 text-white fixed w-full p-4 z-10 h-18 '>
                <img src='/logo.jpg' alt='' className='w-16' />
                <div>
                    <ul className='flex gap-8'>
                        <li>Home</li>
                        <li>About</li>
                        <li>Why choose us</li>
                    </ul>
                </div>
                { <RegisterDialog />}
            </div>

            <div className='flex justify-center'>
                <div className='relative w-[100%]'>
                    <div className='absolute w-full h-[82%] bg-white opacity-5'>
                    </div>

                    <img src='/hero4.webp' className='w-[100%] h-[90%]' />

                    <div className='absolute top-[24%] py-[2%] px-[2%] left-10 flex flex-col bg-black rounded-3xl w-[27%] h-[42%]'>
                        <i className='text-4xl mb-4 font-bold text-white'>
                            <span className='text-orange-500'>Agro</span> <span className='text-white'>Exch</span><span className='text-green-700'>anger</span>
                        </i>
                        <span className='text-xl font-bold text-white'>
                            Connecting Agriculture,
                        </span>
                        <span className='text-xl font-bold text-white'>
                            Empowering Growth !
                        </span>
                        <p className=' mt-3 text-white text-[13px]'>Our goal is to connect buyers and sellers in the agriculture industry, making transactions smooth, secure, and efficient.</p>
                        <button className='bg-green-700 text-white rounded-full p-1 mt-4 w-32 text-[14px] '>Get Started</button>
                    </div>
                </div>
                <div className='flex items-center absolute top-[30%] w-[30%] h-10 bg-white p-1 border border-solid border-gray-300 rounded-full'> <SearchComponent/></div>
            </div>

            <Box>
                <Container>
                    <Heading>
                        About Us
                    </Heading>

                    <p>At [Your Website Name], we aim to revolutionize the agricultural sector by providing a marketplace that caters to every stakeholder. Our platform is designed to bridge the gap between sellers and buyers, ensuring a seamless trading experience. We believe in empowering farmers, promoting sustainable practices, and driving innovation in agricultural commerce.
                        With a focus on transparency, trust, and efficiency, [Your Website Name] is more than just a marketplace—it's a community where agriculture thrives. We are committed to supporting growth, one trade at a time.
                    </p>
                </Container>

                <Container >
                    <Heading>
                        Our Services
                    </Heading>
                    <BuySell />
                </Container>
            </Box>
        </div>
    )
}

export default Home