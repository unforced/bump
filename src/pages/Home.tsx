import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import CheckInForm from '../components/CheckInForm';
import StatusCard from '../components/StatusCard';
import { Status } from '../types';
import { checkIn, getActiveStatuses, supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { FaMapMarkerAlt, FaUserFriends, FaPlus } from 'react-icons/fa';

const HomeContainer = styled.div`
  padding: ${props => props.theme.space[5]};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.space[6]};
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.space[2]};
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textLight};
  max-width: 500px;
`;

const StatusList = styled.div`
  margin-top: ${props => props.theme.space[5]};
  width: 100%;
  max-width: 500px;
`;

const StatusGroup = styled.div`
  margin-bottom: ${props => props.theme.space[6]};
  text-align: left;
  animation: fadeIn 0.5s ease-in-out;
`;

const PlaceHeading = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space[2]};
  margin-bottom: ${props => props.theme.space[3]};
  padding-bottom: ${props => props.theme.space[2]};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PlaceIcon = styled(FaMapMarkerAlt)`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.xl};
`;

const PlaceName = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textDark};
  margin: 0;
`;

const PlaceCount = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: ${props => props.theme.fontWeights.bold};
  padding: ${props => props.theme.space[1]} ${props => props.theme.space[2]};
  border-radius: ${props => props.theme.radii.full};
  margin-left: ${props => props.theme.space[2]};
`;

const CheckInButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radii.lg};
  padding: ${props => props.theme.space[3]} ${props => props.theme.space[6]};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  margin-top: ${props => props.theme.space[5]};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space[2]};
  box-shadow: ${props => props.theme.shadows.md};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PlusIcon = styled(FaPlus)`
  font-size: ${props => props.theme.fontSizes.md};
`;

const EmptyState = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.radii.lg};
  padding: ${props => props.theme.space[5]};
  text-align: center;
  margin-top: ${props => props.theme.space[5]};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px dashed ${props => props.theme.colors.border};
`;

const EmptyStateIcon = styled(FaUserFriends)`
  font-size: 48px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.space[3]};
  opacity: 0.7;
`;

const EmptyStateTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textDark};
  margin-bottom: ${props => props.theme.space[2]};
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.space[4]};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.space[6]};
`;

const LoadingText = styled.p`
  margin-top: ${props => props.theme.space[4]};
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const TestNotificationButton = styled.button`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radii.md};
  padding: ${props => props.theme.space[2]} ${props => props.theme.space[4]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  margin-top: ${props => props.theme.space[5]};
  margin-bottom: ${props => props.theme.space[5]};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.accentDark};
    transform: scale(1.05);
  }
`;

// Fallback mock data in case Supabase connection fails
const fallbackMockStatuses: Status[] = [
  {
    id: '1',
    user_id: '101',
    place_id: '1',
    activity: 'Working on my laptop',
    privacy: 'all',
    timestamp: new Date().toISOString(),
    is_active: true,
    users_view: {
      id: '101',
      email: 'sarah@example.com',
      username: 'Sarah',
      created_at: new Date().toISOString()
    },
    places: {
      id: '1',
      name: 'MycoCafe',
      type: 'cafe'
    }
  },
  {
    id: '2',
    user_id: '102',
    place_id: '1',
    activity: 'Having a coffee meeting',
    privacy: 'all',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    is_active: true,
    users_view: {
      id: '102',
      email: 'alex@example.com',
      username: 'Alex',
      created_at: new Date().toISOString()
    },
    places: {
      id: '1',
      name: 'MycoCafe',
      type: 'cafe'
    }
  },
  {
    id: '3',
    user_id: '103',
    place_id: '2',
    activity: 'Playing frisbee',
    privacy: 'all',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    is_active: true,
    users_view: {
      id: '103',
      email: 'jamie@example.com',
      username: 'Jamie',
      created_at: new Date().toISOString()
    },
    places: {
      id: '2',
      name: 'North Boulder Park',
      type: 'park'
    }
  }
];

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoading(true);
        const data = await getActiveStatuses();
        setStatuses(data || []);
      } catch (error) {
        // Fallback to mock data if Supabase fails
        setStatuses(fallbackMockStatuses);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();

    // Set up real-time subscription for status updates
    const statusSubscription = supabase
      .channel('public:statuses')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'statuses' 
      }, () => {
        fetchStatuses();
      })
      .subscribe();

    return () => {
      statusSubscription.unsubscribe();
    };
  }, []);

  const handleCheckIn = async (data: { placeId: string; activity: string; privacy: 'all' | 'intended' | 'specific' }) => {
    if (!user) {
      return;
    }

    try {
      await checkIn(user.id, data.placeId, data.activity, data.privacy);
      // The real-time subscription will update the UI
      setIsModalOpen(false);
      
      // Add a notification for successful check-in
      addNotification({
        title: 'Check-in Successful',
        message: `You've checked in at ${statuses.find(s => s.place_id === data.placeId)?.places?.name || 'a place'}`,
        type: 'system'
      });
    } catch (error) {
      // Add error notification
      addNotification({
        title: 'Check-in Failed',
        message: 'There was an error checking in. Please try again.',
        type: 'system'
      });
    }
  };

  const handleJoin = (status: Status) => {
    if (!user) {
      return;
    }

    handleCheckIn({
      placeId: status.place_id,
      activity: status.activity,
      privacy: 'all'
    });
    
    // Add notification for joining
    addNotification({
      title: 'Joined Activity',
      message: `You've joined ${status.users_view?.username || 'a friend'} at ${status.places?.name || 'a place'}`,
      type: 'system'
    });
  };

  // Group statuses by place
  const statusesByPlace = statuses.reduce<Record<string, Status[]>>((acc, status) => {
    const placeName = status.places?.name || 'Unknown';
    if (!acc[placeName]) {
      acc[placeName] = [];
    }
    acc[placeName].push(status);
    return acc;
  }, {});

  const sendTestNotification = () => {
    // Create a notification with current timestamp to ensure uniqueness
    const timestamp = new Date().toISOString();
    
    addNotification({
      title: 'Test Notification',
      message: `This is a test notification sent at ${timestamp}`,
      type: 'system'
    });
    
    // Also show an alert to confirm the button was clicked
    alert('Test notification sent! Check the notification bell in the top right corner.');
  };

  const renderLoading = () => (
    <LoadingContainer>
      <div className="loading-spinner"></div>
      <LoadingText>Loading statuses...</LoadingText>
    </LoadingContainer>
  );

  const renderEmptyState = () => (
    <EmptyState className="fade-in">
      <EmptyStateIcon className="floating" />
      <EmptyStateTitle>No active statuses yet</EmptyStateTitle>
      <EmptyStateText>
        Your friends will appear here when they check in. 
        Be the first to share your location!
      </EmptyStateText>
      <CheckInButton onClick={() => setIsModalOpen(true)}>
        <PlusIcon /> Check In Now
      </CheckInButton>
    </EmptyState>
  );

  return (
    <HomeContainer>
      <Header className="fade-in">
        <Title>Bump</Title>
        <Subtitle>See where your friends are hanging out</Subtitle>
      </Header>
      
      <TestNotificationButton onClick={sendTestNotification} className="slide-in-right">
        Send Test Notification
      </TestNotificationButton>
      
      <StatusList>
        {loading ? (
          renderLoading()
        ) : statuses.length === 0 ? (
          renderEmptyState()
        ) : (
          Object.entries(statusesByPlace).map(([placeName, placeStatuses], index) => (
            <StatusGroup key={placeName} style={{ animationDelay: `${index * 0.1}s` }}>
              <PlaceHeading>
                <PlaceIcon />
                <PlaceName>{placeName}</PlaceName>
                <PlaceCount>{placeStatuses.length}</PlaceCount>
              </PlaceHeading>
              {placeStatuses.map((status) => (
                <StatusCard 
                  key={status.id} 
                  status={status} 
                  onJoin={handleJoin} 
                />
              ))}
            </StatusGroup>
          ))
        )}
      </StatusList>
      
      {!loading && statuses.length > 0 && (
        <CheckInButton 
          onClick={() => setIsModalOpen(true)}
          className="pulse-on-hover"
        >
          <PlusIcon /> Check In
        </CheckInButton>
      )}
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CheckInForm 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleCheckIn} 
        />
      </Modal>
    </HomeContainer>
  );
};

export default Home; 