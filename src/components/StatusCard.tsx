import React from 'react';
import styled from 'styled-components';
import { Status } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Card = styled.div`
  background-color: var(--secondary-color);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const TimeStamp = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const PlaceName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const Activity = styled.div`
  margin-bottom: 12px;
`;

const JoinButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3a6a49;
    transform: scale(1.05);
  }
`;

const SelfTag = styled.span`
  background-color: #4a7c59;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
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
  
  return (
    <Card>
      <CardHeader>
        <UserName>
          {getUserName()}
          {isCurrentUser && <SelfTag>You</SelfTag>}
        </UserName>
        <TimeStamp>{formatTime(status.timestamp)}</TimeStamp>
      </CardHeader>
      <PlaceName>{status.places?.name || 'Unknown location'}</PlaceName>
      <Activity>{status.activity}</Activity>
      {!isCurrentUser && (
        <JoinButton onClick={() => onJoin(status)}>
          Join
        </JoinButton>
      )}
    </Card>
  );
};

export default StatusCard; 