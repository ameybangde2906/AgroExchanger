import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 1px solid lightgray;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled(Link)`
  display: flex;
  align-items: center;
  height: 70px;
  text-decoration: none;
  color: #333;
  gap: 1rem;

  &:hover {
    color: #000;
  }
`;

const ImageWrapper = styled.div`
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  justify-content: center;

  img {
    width: 80%;
    height: 80%;
    object-fit: cover;
  }
`;

const OptionName = styled.h3`
  font-size: 0.85rem;
  font-weight: 600;
  color: inherit;
`;

const ActiveBar = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${({ active }) => (active ? 'green' : 'transparent')};
  margin-top: 4px;
  border-radius: 2px;
  transition: background-color 0.3s ease;
`;

const options = [
  { name: 'Crops, Vegetables & Fruits', imgSrc: '/crop.png', link: '/crops' },
  { name: 'Equipment & Hardware', imgSrc: '/equip.png', link: '/equipment' },
  { name: 'Fertilizers & Pesticides', imgSrc: '/fert.png', link: '/fertilizers' },
  { name: 'Land & Farmhouses', imgSrc: '/land.png', link: '/land' },
  { name: 'Rent a Product', imgSrc: '/rent.png', link: '/rent' },
];

const OptionsGrid = () => {
  const location = useLocation();

  return (
    <FlexContainer>
      {options.map((option, index) => {
        const isActive = location.pathname === option.link;

        return (
          <div key={index}>
            <Header to={option.link}>
              <ImageWrapper>
                <img src={option.imgSrc} alt={option.name} />
              </ImageWrapper>
              <OptionName>{option.name}</OptionName>
            </Header>
            <ActiveBar active={isActive} />
          </div>
        );
      })}
    </FlexContainer>
  );
};

export default OptionsGrid;


