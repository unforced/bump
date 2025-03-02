import React, { useState } from 'react';
import styled from 'styled-components';
import { Friend } from '../types';
import { updateIntendToBump } from '../services/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

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
  align-items: center;
  cursor: pointer;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-right: ${({ theme }) => theme.space[3]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const NameContainer = styled.div`
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
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const IntendLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const ToggleOption = styled.button<{ $isActive: boolean; $optionType: 'off' | 'private' | 'shared' }>`
  padding: ${({ theme }) => `${theme.space[1.5]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  background-color: ${({ theme, $isActive, $optionType }) => 
    $isActive 
      ? $optionType === 'off' 
        ? theme.colors.mediumGray
        : $optionType === 'private'
          ? theme.colors.accent
          : theme.colors.success
      : theme.colors.white
  };
  
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.white : theme.colors.text
  };
  
  border: 1px solid ${({ theme, $isActive, $optionType }) => 
    $isActive 
      ? 'transparent'
      : $optionType === 'off'
        ? theme.colors.mediumGray
        : $optionType === 'private'
          ? theme.colors.accent
          : theme.colors.success
  };
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const StatusWrapper = styled.div<{ $status: 'off' | 'private' | 'shared' }>`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[3]};
  background-color: ${({ theme, $status }) => 
    $status === 'off' 
      ? `${theme.colors.mediumGray}20` 
      : $status === 'private' 
        ? `${theme.colors.accent}20` 
        : `${theme.colors.success}20`
  };
  border-radius: ${({ theme }) => theme.radii.md};
  border-left: 4px solid ${({ theme, $status }) => 
    $status === 'off' 
      ? theme.colors.mediumGray 
      : $status === 'private' 
        ? theme.colors.accent 
        : theme.colors.success
  };
  transition: all 0.3s ease;
`;

const StatusIndicator = styled.div<{ $status: 'off' | 'private' | 'shared' }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.space[2]};
  background-color: ${({ theme, $status }) => 
    $status === 'off' ? theme.colors.mediumGray : 
    $status === 'private' ? theme.colors.accent : 
    theme.colors.success
  };
  transition: background-color 0.3s ease;
`;

const StatusText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const MutualIndicator = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.success};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  
  &::before {
    content: '•';
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
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

const ViewProfileButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: ${({ theme }) => theme.space[3]};
  align-self: flex-end;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
    transform: translateY(-2px);
  }
`;

interface FriendCardProps {
  friend: Friend;
  onUpdate: () => void;
  hasMutualIntent?: boolean;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, onUpdate, hasMutualIntent = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [intendToBump, setIntendToBump] = useState(friend.intend_to_bump);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleIntendChange = async (newValue: 'off' | 'private' | 'shared') => {
    if (newValue === intendToBump) return;
    
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
        return 'Intending to bump';
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
  
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  const handleViewProfile = () => {
    navigate(`/friends/${friend.friend_id}`);
  };
  
  return (
    <Card theme={theme}>
      <FriendInfoRow theme={theme}>
        <FriendInfo onClick={handleViewProfile}>
          <Avatar theme={theme}>{getInitials(getFriendName())}</Avatar>
          <NameContainer>
            <FriendName theme={theme}>{getFriendName()}</FriendName>
            <FriendEmail theme={theme}>{friend.users_view?.email}</FriendEmail>
          </NameContainer>
        </FriendInfo>
      </FriendInfoRow>
      
      <IntendSection theme={theme}>
        <IntendHeader theme={theme}>
          <IntendLabel theme={theme}>Intend to Bump</IntendLabel>
          <ToggleContainer theme={theme}>
            <ToggleOption 
              theme={theme}
              $isActive={intendToBump === 'off'}
              $optionType="off"
              onClick={() => handleIntendChange('off')}
              disabled={isUpdating}
            >
              Off
            </ToggleOption>
            <ToggleOption 
              theme={theme}
              $isActive={intendToBump === 'private'}
              $optionType="private"
              onClick={() => handleIntendChange('private')}
              disabled={isUpdating}
            >
              Private
            </ToggleOption>
            <ToggleOption 
              theme={theme}
              $isActive={intendToBump === 'shared'}
              $optionType="shared"
              onClick={() => handleIntendChange('shared')}
              disabled={isUpdating}
            >
              Shared
            </ToggleOption>
          </ToggleContainer>
        </IntendHeader>
        
        <StatusWrapper theme={theme} $status={intendToBump}>
          <StatusIndicator theme={theme} $status={intendToBump} />
          <StatusText theme={theme}>{getStatusText(intendToBump)}</StatusText>
          {hasMutualIntent && intendToBump === 'shared' && (
            <MutualIndicator theme={theme}>Mutual</MutualIndicator>
          )}
          {isUpdating && <LoadingSpinner theme={theme} />}
        </StatusWrapper>
      </IntendSection>
      
      <ViewProfileButton theme={theme} onClick={handleViewProfile}>
        View Profile
      </ViewProfileButton>
    </Card>
  );
};

export default FriendCard; 