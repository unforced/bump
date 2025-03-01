import React, { useState } from 'react';
import styled from 'styled-components';
import { Friend } from '../types';
import { updateIntendToBump } from '../services/supabase';

const Card = styled.div`
  background-color: var(--secondary-color);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const FriendInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FriendName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.1rem;
`;

const FriendEmail = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #666;
`;

const IntendToggle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const ToggleLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const ToggleSelect = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const StatusIndicator = styled.div<{ status: 'off' | 'private' | 'shared' }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${props => 
    props.status === 'off' ? '#ccc' : 
    props.status === 'private' ? '#f9a825' : 
    '#4caf50'
  };
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
`;

const StatusText = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

interface FriendCardProps {
  friend: Friend;
  onUpdate: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, onUpdate }) => {
  const [intendToBump, setIntendToBump] = useState(friend.intend_to_bump);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleIntendChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as 'off' | 'private' | 'shared';
    setIntendToBump(newValue);
    setIsUpdating(true);
    
    try {
      await updateIntendToBump(friend.id, newValue);
      onUpdate();
    } catch (error) {
      console.error('Error updating intend to bump:', error);
      // Revert to original value on error
      setIntendToBump(friend.intend_to_bump);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusText = (status: 'off' | 'private' | 'shared') => {
    switch (status) {
      case 'off':
        return 'Not intending to bump';
      case 'private':
        return 'Privately intending to bump';
      case 'shared':
        return 'Mutually intending to bump';
      default:
        return '';
    }
  };
  
  // Get username from friend metadata or fallback to email
  const getFriendName = () => {
    if (friend.friend?.username) {
      return friend.friend.username;
    }
    
    // Try to get username from metadata if available
    const userData = friend.friend as any; // Type assertion to access user_metadata
    if (userData?.user_metadata?.username) {
      return userData.user_metadata.username;
    }
    
    // Fallback to email or anonymous
    return friend.friend?.email?.split('@')[0] || 'Anonymous';
  };
  
  return (
    <Card>
      <FriendInfo>
        <FriendName>{getFriendName()}</FriendName>
        <FriendEmail>{friend.friend?.email}</FriendEmail>
        <StatusWrapper>
          <StatusIndicator status={intendToBump} />
          <StatusText>{getStatusText(intendToBump)}</StatusText>
        </StatusWrapper>
      </FriendInfo>
      
      <IntendToggle>
        <ToggleLabel>Intend to Bump</ToggleLabel>
        <ToggleSelect 
          value={intendToBump} 
          onChange={handleIntendChange}
          disabled={isUpdating}
        >
          <option value="off">Off</option>
          <option value="private">Private</option>
          <option value="shared">Shared</option>
        </ToggleSelect>
      </IntendToggle>
    </Card>
  );
};

export default FriendCard; 