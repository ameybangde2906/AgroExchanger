import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MainConatiner = styled.div`
background-color: #f9f9f9;
`

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-bottom: 2%;
  max-width: 1200px; /* Set a maximum width for the slider */
  margin: 0 auto; /* Center the slider horizontally */
`;
const Title = styled.div`
font-size: 18px;
font-weight: 500;
padding: 2% 0;
`
const SliderWrapper = styled.div`
  display: flex;
  gap: 3rem;
  transition: transform 0.5s ease;
  transform: ${({ translateX }) => `translateX(${translateX}px)`};
`;

const SlideItem = styled.div`
  flex: 0 0 auto;
  text-align: center;
`;

const CropImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

const CropName = styled.p`
  margin-top: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 10;
  
  ${({ direction }) =>
        direction === "left" ? `left: 10px;` : `right: 10px;`}

  &:hover {
    background: #eee;
  }
`;

const crops = [
    { name: 'Wheat', imgSrc: '/wheat.png' },
    { name: 'Rice', imgSrc: '/rice.png' },
    { name: 'Corn', imgSrc: '/corn.png' },
    { name: 'Barley', imgSrc: '/barley.png' },
    { name: 'Soybean', imgSrc: '/soyabean.png' },
    { name: 'Sugarcane', imgSrc: '/sugercane.png' },
    { name: 'Millet', imgSrc: 'millet.jpg' },
    { name: 'Cotton', imgSrc: '/cotton.png' },
    { name: 'Sugarcane', imgSrc: 'sugarcane.jpg' },
    { name: 'Millet', imgSrc: 'millet.jpg' },
    { name: 'Cotton', imgSrc: 'cotton.jpg' },
    { name: 'Sugarcane', imgSrc: 'sugarcane.jpg' },
    { name: 'Millet', imgSrc: 'millet.jpg' },
    { name: 'Cotton', imgSrc: 'cotton.jpg' },
];

const CropSlider = ({ filters, onCropSelect }) => {
    const [translateX, setTranslateX] = useState(0);

    const handleSlide = (direction) => {
        const slideWidth = 180; // Image + margin
        const visibleSlides = Math.floor(window.innerWidth / slideWidth);
        const maxTranslateX = -(crops.length - visibleSlides) * slideWidth;

        if (direction === "left" && translateX < 0) {
            setTranslateX((prev) => prev + slideWidth);
        } else if (direction === "right" && translateX > maxTranslateX) {
            setTranslateX((prev) => prev - slideWidth);
        }
    };


    return (
        <MainConatiner>
            <SliderContainer>
                <Title>Browse Our Top Crops</Title>
                {translateX < 0 && (
                    <ArrowButton direction="left" onClick={() => handleSlide("left")}>
                        &#x276E;
                    </ArrowButton>
                )}
                <SliderWrapper translateX={translateX}>
                    {crops.map((crop, index) => (

                        <SlideItem key={index} variant={filters[crop.name.toLowerCase()] ? 'contained' : 'outlined'}
                            onClick={() => onCropSelect(crop.name.toLowerCase())}>
                            <CropImage src={crop.imgSrc} alt={crop.name} />
                            <CropName>{crop.name}</CropName>
                        </SlideItem>

                    ))}
                </SliderWrapper>
                <ArrowButton direction="right" onClick={() => handleSlide("right")}>
                    &#x276F;
                </ArrowButton>
            </SliderContainer>
        </MainConatiner>

    );
};

export default CropSlider;
