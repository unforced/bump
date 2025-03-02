import React, { useState } from 'react';
import styled from 'styled-components';
import { Friend } from '../types';
import { updateIntendToBump } from '../services/supabase';
import { useTheme } from '../contexts/ThemeContext';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[4]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FriendInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const FriendInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FriendName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.space[1]} 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const FriendEmail = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const IntendSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
  padding-top: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const IntendHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const IntendLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const ToggleSelect = styled.select`
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  background-color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}30`};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StatusIndicator = styled.div<{ status: 'off' | 'private' | 'shared' }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.space[2]};
  background-color: ${props => 
    props.status === 'off' ? props.theme.colors.mediumGray : 
    props.status === 'private' ? props.theme.colors.accent : 
    props.theme.colors.success
  };
  transition: background-color 0.3s ease;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const StatusText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin-left: ${({ theme }) => theme.space[2]};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface FriendCardProps {
  friend: Friend;
  onUpdate: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, onUpdate }) => {
  const theme = useTheme();
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
    if (friend.users_view?.username) {
      return friend.users_view.username;
    }
    
    // Try to get username from metadata if available
    const userData = friend.users_view as any; // Type assertion to access user_metadata
    if (userData?.user_metadata?.username) {
      return userData.user_metadata.username;
    }
    
    // Fallback to email or anonymous
    return friend.users_view?.email?.split('@')[0] || 'Anonymous';
  };
  
  return (
    <Card theme={theme}>
      <FriendInfoRow theme={theme}>
        <FriendInfo>
          <FriendName theme={theme}>{getFriendName()}</FriendName>
          <FriendEmail theme={theme}>{friend.users_view?.email}</FriendEmail>
        </FriendInfo>
      </FriendInfoRow>
      
      <IntendSection theme={theme}>
        <IntendHeader theme={theme}>
          <IntendLabel theme={theme}>Intend to Bump</IntendLabel>
          <ToggleSelect 
            theme={theme}
            value={intendToBump} 
            onChange={handleIntendChange}
            disabled={isUpdating}
          >
            <option value="off">Off</option>
            <option value="private">Private</option>
            <option value="shared">Shared</option>
          </ToggleSelect>
        </IntendHeader>
        
        <StatusWrapper theme={theme}>
          <StatusIndicator theme={theme} status={intendToBump} />
          <StatusText theme={theme}>{getStatusText(intendToBump)}</StatusText>
          {isUpdating && <LoadingSpinner theme={theme} />}
        </StatusWrapper>
      </IntendSection>
    </Card>
  );
};

export default FriendCard; 