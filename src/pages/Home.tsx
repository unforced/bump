import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import CheckInForm from '../components/CheckInForm';
import StatusCard from '../components/StatusCard';
import { Status } from '../types';
import { checkIn, getActiveStatuses, supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

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

const StatusGroup = styled.div`
  margin-bottom: 24px;
  text-align: left;
`;

const PlaceHeading = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid #ddd;
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

const EmptyState = styled.div`
  background-color: var(--secondary-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
`;

const TestNotificationButton = styled.button`
  background-color: #e67e22; /* Orange */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #d35400;
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
        console.error('Error fetching statuses:', error);
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
      }, (payload: any) => {
        console.log('Status change received!', payload);
        fetchStatuses();
      })
      .subscribe();

    return () => {
      statusSubscription.unsubscribe();
    };
  }, []);

  const handleCheckIn = async (data: { placeId: string; activity: string; privacy: 'all' | 'intended' | 'specific' }) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      await checkIn(user.id, data.placeId, data.activity, data.privacy);
      // The real-time subscription will update the UI
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleJoin = (status: Status) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    handleCheckIn({
      placeId: status.place_id,
      activity: status.activity,
      privacy: 'all'
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
    console.log('Sending test notification');
    
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

  return (
    <HomeContainer>
      <h1>Bump</h1>
      <p>See where your friends are hanging out</p>
      
      <TestNotificationButton onClick={sendTestNotification}>
        Send Test Notification
      </TestNotificationButton>
      
      <StatusList>
        {loading ? (
          <p>Loading statuses...</p>
        ) : statuses.length === 0 ? (
          <EmptyState>
            <p>No active statuses yet. Your friends will appear here when they check in.</p>
          </EmptyState>
        ) : (
          Object.entries(statusesByPlace).map(([placeName, placeStatuses]) => (
            <StatusGroup key={placeName}>
              <PlaceHeading>{placeName} ({placeStatuses.length})</PlaceHeading>
              {placeStatuses.map(status => (
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
      
      <CheckInButton onClick={() => setIsModalOpen(true)}>
        Check In
      </CheckInButton>
      
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