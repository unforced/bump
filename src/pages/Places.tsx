import React from 'react';
import styled from 'styled-components';

const PlacesContainer = styled.div`
  padding: 20px;
`;

const PlacesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const PlaceCard = styled.div`
  background-color: #f5f1e3; /* Sandstone beige */
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const AddPlaceButton = styled.button`
  background-color: #4a7c59; /* Forest green */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3a6a49;
    transform: scale(1.05);
  }
`;

const Places: React.FC = () => {
  return (
    <PlacesContainer>
      <h1>Gathering Places</h1>
      <p>Your favorite spots to hang out</p>
      
      <PlacesList>
        <PlaceCard>
          <h3>Add your first place</h3>
          <p>Start by adding your favorite cafes, parks, or hangout spots.</p>
        </PlaceCard>
      </PlacesList>
      
      <AddPlaceButton>Add Place</AddPlaceButton>
    </PlacesContainer>
  );
};

export default Places; 