import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatusList = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
`;

const CheckInButton = styled.button`
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

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <h1>Bump</h1>
      <p>See where your friends are hanging out</p>
      
      <StatusList>
        <p>No active statuses yet. Your friends will appear here when they check in.</p>
      </StatusList>
      
      <CheckInButton>Check In</CheckInButton>
    </HomeContainer>
  );
};

export default Home; 