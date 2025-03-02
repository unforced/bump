import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getMeetups, logMeetup, getPlaces } from '../services/supabase';
import { Meetup, Place } from '../types';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';

const MeetupsContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MeetupsList = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
`;

const MeetupCard = styled.div`
  background-color: var(--secondary-color);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const MeetupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const MeetupTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const MeetupDate = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const MeetupLocation = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const MeetupType = styled.div<{ isIntentional: boolean }>`
  display: inline-block;
  background-color: ${props => props.isIntentional ? '#4caf50' : '#ff9800'};
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 8px;
`;

const EmptyState = styled.div`
  background-color: var(--secondary-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
`;

const LogMeetupButton = styled.button`
  background-color: var(--primary-color);
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

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #3a6a49;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #2e7d32;
  background-color: #e8f5e9;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

// New styled components for statistics
const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin: 20px 0;
  width: 100%;
  max-width: 500px;
`;

const StatCard = styled.div`
  background-color: var(--secondary-color);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 140px;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const Meetups: React.FC = () => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  
  // Form state
  const [friendName, setFriendName] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [wasIntentional, setWasIntentional] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Fetch meetups
        const meetupsData = await getMeetups(user.id);
        setMeetups(meetupsData || []);
        
        // Fetch places for the dropdown
        const placesData = await getPlaces();
        setPlaces(placesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !friendName || !placeId) return;
    
    try {
      setSubmitting(true);
      setError('');
      
      await logMeetup(user.id, friendName, placeId, wasIntentional);
      
      // Refresh meetups list
      const meetupsData = await getMeetups(user.id);
      setMeetups(meetupsData || []);
      
      // Reset form
      setFriendName('');
      setPlaceId('');
      setWasIntentional(false);
      
      setSuccess('Meetup logged successfully!');
      setIsModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error logging meetup:', error);
      setError('Failed to log meetup. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // New functions for statistics
  const getMonthlyMeetups = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return meetups.filter(meetup => {
      const meetupDate = new Date(meetup.timestamp);
      return meetupDate >= firstDayOfMonth;
    }).length;
  };
  
  const getSpontaneousMeetups = () => {
    return meetups.filter(meetup => !meetup.was_intentional).length;
  };
  
  const getPlannedMeetups = () => {
    return meetups.filter(meetup => meetup.was_intentional).length;
  };
  
  const getMostVisitedPlace = () => {
    if (meetups.length === 0) return 'None yet';
    
    const placeCounts: Record<string, { count: number, name: string }> = {};
    
    meetups.forEach(meetup => {
      const placeId = meetup.place_id;
      const placeName = meetup.places?.name || 'Unknown';
      
      if (!placeCounts[placeId]) {
        placeCounts[placeId] = { count: 0, name: placeName };
      }
      
      placeCounts[placeId].count++;
    });
    
    let mostVisitedId = '';
    let highestCount = 0;
    
    Object.entries(placeCounts).forEach(([id, data]) => {
      if (data.count > highestCount) {
        mostVisitedId = id;
        highestCount = data.count;
      }
    });
    
    return placeCounts[mostVisitedId]?.name || 'None';
  };
  
  return (
    <MeetupsContainer>
      <h1>Meetups</h1>
      <p>Log and track your spontaneous encounters</p>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Statistics Section */}
          {meetups.length > 0 && (
            <StatsContainer>
              <StatCard>
                <StatValue>{getMonthlyMeetups()}</StatValue>
                <StatLabel>Meetups this month</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getSpontaneousMeetups()}</StatValue>
                <StatLabel>Spontaneous</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getPlannedMeetups()}</StatValue>
                <StatLabel>Planned</StatLabel>
              </StatCard>
            </StatsContainer>
          )}
          
          {meetups.length > 0 && (
            <StatCard style={{ width: '100%', maxWidth: '500px', marginBottom: '20px' }}>
              <StatLabel>Most visited place</StatLabel>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {getMostVisitedPlace()}
              </div>
            </StatCard>
          )}
          
          <MeetupsList>
            {meetups.length === 0 ? (
              <EmptyState>
                <h3>No meetups yet</h3>
                <p>Log your first meetup when you bump into a friend!</p>
              </EmptyState>
            ) : (
              meetups.map(meetup => (
                <MeetupCard key={meetup.id}>
                  <MeetupHeader>
                    <MeetupTitle>Met {meetup.friend_name}</MeetupTitle>
                    <MeetupDate>{formatDate(meetup.timestamp)}</MeetupDate>
                  </MeetupHeader>
                  <MeetupLocation>
                    {meetup.places?.name || 'Unknown location'}
                  </MeetupLocation>
                  <MeetupType isIntentional={meetup.was_intentional}>
                    {meetup.was_intentional ? 'Planned' : 'Spontaneous'}
                  </MeetupType>
                </MeetupCard>
              ))
            )}
          </MeetupsList>
        </>
      )}
      
      <LogMeetupButton onClick={() => setIsModalOpen(true)}>
        Log Meetup
      </LogMeetupButton>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Log a Meetup</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="friendName">Friend's Name</Label>
            <Input
              id="friendName"
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="Who did you meet?"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="placeId">Location</Label>
            <Select
              id="placeId"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              required
            >
              <option value="">Select a location</option>
              {places.map(place => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Checkbox>
              <input
                id="wasIntentional"
                type="checkbox"
                checked={wasIntentional}
                onChange={(e) => setWasIntentional(e.target.checked)}
              />
              <Label htmlFor="wasIntentional">This was a planned meetup</Label>
            </Checkbox>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? 'Logging...' : 'Log Meetup'}
          </SubmitButton>
        </Form>
      </Modal>
    </MeetupsContainer>
  );
};

export default Meetups; 