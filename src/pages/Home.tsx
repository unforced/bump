import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import CheckInForm from '../components/CheckInForm';
import StatusCard from '../components/StatusCard';
import { Status } from '../types';
import { checkIn, getActiveStatuses } from '../services/supabase';

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

// Mock data for active statuses (will be replaced with data from Supabase)
const mockStatuses: Status[] = [
  {
    id: '1',
    user_id: '101',
    place_id: '1',
    activity: 'Working on my laptop',
    privacy: 'all',
    timestamp: new Date().toISOString(),
    is_active: true,
    users: {
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
    users: {
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
    users: {
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

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    // For now, we'll use mock data
    const fetchStatuses = async () => {
      try {
        setLoading(true);
        // const data = await getActiveStatuses();
        // setStatuses(data || []);
        
        // Using mock data for now
        setStatuses(mockStatuses);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  const handleCheckIn = async (data: { placeId: string; activity: string; privacy: 'all' | 'intended' | 'specific' }) => {
    try {
      // In a real app, this would send to Supabase
      // const result = await checkIn('current-user-id', data.placeId, data.activity, data.privacy);
      
      // For now, we'll just add to our local state
      const newStatus: Status = {
        id: `local-${Date.now()}`,
        user_id: 'current-user',
        place_id: data.placeId,
        activity: data.activity,
        privacy: data.privacy,
        timestamp: new Date().toISOString(),
        is_active: true,
        users: {
          id: 'current-user',
          email: 'me@example.com',
          username: 'You',
          created_at: new Date().toISOString()
        },
        places: mockStatuses.find(s => s.place_id === data.placeId)?.places || {
          id: data.placeId,
          name: `Place ${data.placeId}`,
          type: 'unknown'
        }
      };
      
      setStatuses([newStatus, ...statuses]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleJoin = (status: Status) => {
    // In a real app, this would create a new check-in with the same place and activity
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

  return (
    <HomeContainer>
      <h1>Bump</h1>
      <p>See where your friends are hanging out</p>
      
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