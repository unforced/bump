import React from 'react';
import styled from 'styled-components';

const FriendsContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FriendsList = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
`;

const FriendCard = styled.div`
  background-color: #f5f1e3; /* Sandstone beige */
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IntendToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddFriendButton = styled.button`
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

const Friends: React.FC = () => {
  return (
    <FriendsContainer>
      <h1>Friends</h1>
      <p>Manage your connections and bump intentions</p>
      
      <FriendsList>
        <FriendCard>
          <div>
            <h3>Add your first friend</h3>
            <p>Connect with friends to see their check-ins and set bump intentions.</p>
          </div>
        </FriendCard>
      </FriendsList>
      
      <AddFriendButton>Add Friend</AddFriendButton>
    </FriendsContainer>
  );
};

export default Friends; 