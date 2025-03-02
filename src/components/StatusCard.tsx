import React from 'react';
import styled from 'styled-components';
import { Status } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { FaMapMarkerAlt, FaUserFriends } from 'react-icons/fa';

const Card = styled.div`
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.radii.lg};
  padding: ${props => props.theme.space[4]};
  margin-bottom: ${props => props.theme.space[4]};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  border-left: 4px solid ${props => props.theme.colors.primary};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.space[2]};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space[2]};
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.fontWeights.bold};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const UserName = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
`;

const TimeStamp = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textLight};
  background-color: ${props => props.theme.colors.backgroundAlt};
  padding: ${props => props.theme.space[1]} ${props => props.theme.space[2]};
  border-radius: ${props => props.theme.radii.full};
`;

const StatusContent = styled.div`
  margin: ${props => props.theme.space[3]} 0;
`;

const PlaceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space[2]};
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-bottom: ${props => props.theme.space[2]};
  color: ${props => props.theme.colors.text};
`;

const PlaceIcon = styled(FaMapMarkerAlt)`
  color: ${props => props.theme.colors.primary};
`;

const Activity = styled.div`
  margin-bottom: ${props => props.theme.space[3]};
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.text};
  line-height: ${props => props.theme.lineHeights.relaxed};
  font-style: italic;
`;

const PrivacyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space[1]};
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.space[3]};
`;

const PrivacyIcon = styled(FaUserFriends)`
  font-size: ${props => props.theme.fontSizes.sm};
`;

const JoinButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radii.md};
  padding: ${props => props.theme.space[2]} ${props => props.theme.space[4]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space[2]};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const SelfTag = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: ${props => props.theme.fontSizes.xs};
  padding: ${props => props.theme.space[1]} ${props => props.theme.space[2]};
  border-radius: ${props => props.theme.radii.full};
  margin-left: ${props => props.theme.space[2]};
`;

interface StatusCardProps {
  status: Status;
  onJoin: (status: Status) => void;
}

const StatusCard: React.FC<StatusCardProps> = ({ status, onJoin }) => {
  const { user } = useAuth();
  const isCurrentUser = user?.id === status.user_id;
  
  // Format timestamp to a readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get username from user metadata or fallback to email
  const getUserName = () => {
    if (isCurrentUser) {
      return 'You';
    }
    
    if (status.users_view?.username) {
      return status.users_view.username;
    }
    
    // Try to get username from metadata if available
    const userData = status.users_view as any; // Type assertion to access user_metadata
    if (userData?.user_metadata?.username) {
      return userData.user_metadata.username;
    }
    
    // Fallback to email or anonymous
    return status.users_view?.email?.split('@')[0] || 'Anonymous';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserName();
    if (name === 'You') return 'Y';
    
    return name.charAt(0).toUpperCase();
  };
  
  // Get privacy label
  const getPrivacyLabel = () => {
    switch (status.privacy) {
      case 'all':
        return 'Visible to all friends';
      case 'intended':
        return 'Visible to friends who intend to bump';
      case 'specific':
        return 'Visible to specific friends';
      default:
        return 'Visible to all friends';
    }
  };
  
  return (
    <Card className="fade-in">
      <CardHeader>
        <UserInfo>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <UserName>
            {getUserName()}
            {isCurrentUser && <SelfTag>You</SelfTag>}
          </UserName>
        </UserInfo>
        <TimeStamp>{formatTime(status.timestamp)}</TimeStamp>
      </CardHeader>
      
      <StatusContent>
        <PlaceInfo>
          <PlaceIcon /> {status.places?.name || 'Unknown location'}
        </PlaceInfo>
        <Activity>"{status.activity}"</Activity>
        <PrivacyInfo>
          <PrivacyIcon /> {getPrivacyLabel()}
        </PrivacyInfo>
      </StatusContent>
      
      {!isCurrentUser && (
        <JoinButton 
          onClick={() => onJoin(status)}
          className="pulse-on-hover"
        >
          Join {getUserName()}
        </JoinButton>
      )}
    </Card>
  );
};

export default StatusCard; 