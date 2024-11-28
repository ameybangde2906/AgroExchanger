import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useQuery } from '@tanstack/react-query';
import { LocationOn } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

// Styled Components
const Box = styled.div`
  width: 350px;
  height: 400px;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin: 20px;
  align-items: center;
  justify-content: space-between;
`;

const BoxContent = styled.div`
  padding: 1rem;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #555;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  height: 150px;
  .slick-slide img {
    border-radius: 1rem 1rem 0 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 300px; /* Set a fixed height for the images */
`;

const StyledImage = styled.img`
  height: 100%; /* Make the image fill the height */
  width: auto;  /* Maintain aspect ratio */
  object-fit: cover; /* Ensures the image covers the area neatly */
  border: none;
  outline: none;
  :focus{
    outline: none;
    border: none;
  }
`;

// Image Slider Component
const ImageSlider = ({ images }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <StyledSlider {...settings}>
      {images.map((image, index) => (
        <ImageWrapper key={index}>
          <StyledImage src={image} alt={`Slide ${index}`} />
        </ImageWrapper>
      ))}
    </StyledSlider>
  );
};

// Main Component
const BuySell = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Crops, Vegetables & Fruits',
      description: 'Buy or sell fresh directly from farmers.',
      images: [
        'https://cdn.wikifarmer.com/wp-content/uploads/2024/01/Which-are-the-cash-crops-.jpg',
        'https://foxfarm.com/wp-content/uploads/2022/05/landing-page_1564791433.jpg',
        'https://www.agrifarming.in/wp-content/uploads/2022/09/How-to-Start-Exotic-Fruit-Farming-in-India-11.jpg'
      ],
      redirectPath: '/crops',
    },
    {
      title: 'Equipment',
      description: 'Find the best farming equipment and tools.',
      images: [
        'https://www.cnet.com/a/img/resize/9c994ce6ca9ab5f0f23094d401595a3561ad1617/hub/2024/01/11/fc0a70aa-faae-4131-a27f-14f2360a1bf9/john-deere-ces.jpg?auto=webp&fit=crop&height=675&width=1200',
        'https://international.sonalika.com/wp-content/uploads/2020/09/4-17.jpg',
        'https://hips.hearstapps.com/hmg-prod/images/pop-chainsaws-66a00ca77b014.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*'
      ],
      redirectPath: '/equipment',
    },
    {
      title: 'Fertilizers & Pesticides',
      description: 'Buy or sell best fertilizers and pesticides.',
      images: [
        'https://www.agriplexindia.com/cdn/shop/collections/New_Project_3.png?v=1714216579&width=640',
        'https://5.imimg.com/data5/AM/TC/MY-5720948/agro-chemicals-500x500.jpg',
        'https://i0.wp.com/bhangerinsecticides.com/wp-content/uploads/2022/01/Herbicie.png?fit=1001%2C801&ssl=1'
      ],
      redirectPath: '/fertilizers',
    },
    {
      title: 'Land',
      description: 'Buy or sell agricultural land easily.',
      images: [
        'https://www.theoneacrefarms.com/uploads/1698834458750-pexels-photo-1483880.jpeg',
        'https://img.staticmb.com/mbcontent/images/crop/uploads/2021/9/the-process-of-buying-agricultural-land-in-india_0_1200.jpg',
        'https://img.etimg.com/thumb/width-1200,height-900,imgsize-121753,resizemode-75,msid-30808077/wealth/personal-finance-news/realty-companies-with-foreign-investment-may-buy-farm-land-in-india.jpg'
      ],
      redirectPath: '/land',
    },
    {
      title: 'Rent',
      description: 'Buy or sell agricultural land easily.',
      images: [
        'https://www.theoneacrefarms.com/uploads/1698834458750-pexels-photo-1483880.jpeg',
        'https://img.staticmb.com/mbcontent/images/crop/uploads/2021/9/the-process-of-buying-agricultural-land-in-india_0_1200.jpg',
        'https://img.etimg.com/thumb/width-1200,height-900,imgsize-121753,resizemode-75,msid-30808077/wealth/personal-finance-news/realty-companies-with-foreign-investment-may-buy-farm-land-in-india.jpg'],
      redirectPath: '/land',
    },
  ];

  const handleRedirect = (url) => {
    // Scroll to top before navigating
    window.scrollTo(0, 0);
    // Perform the navigation
    navigate(url);
  };

  return (
    <div className='flex flex-col'>
      {/* <div className='flex justify-between mt-5'> 
        <img src='/logo.jpg' alt='' className='w-20 h-14 ml-6' />
        <p className='text-3xl mt-10'>Welcome {authUser.name}</p>
        <span className='text-[13px] m-4'> <LocationOn fontSize='small'/> {authUser.address.subDistrict}, {authUser.address.village}</span>
      </div> */}

      <div className="flex flex-wrap justify-center p-8 ">
        {categories.map((category, index) => (

          <Box key={index} onClick={() => handleRedirect(`${category.redirectPath}`)}>
            <ImageSlider images={category.images} />
            <BoxContent>
              <Title>{category.title}</Title>
              <Description>{category.description}</Description>
            </BoxContent>
          </Box>

        ))}
      </div>
    </div>
  );
};

export default BuySell;
