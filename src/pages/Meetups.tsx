import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getMeetups, logMeetup, getUserPlaces, getFriends } from '../services/supabase';
import { Meetup, Place, Friend } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.space[6]};
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
  text-align: center;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.md};
  max-width: 600px;
  margin: 0 auto;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[4]};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const MeetupsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const MeetupCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[4]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const MeetupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const MeetupTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin: 0;
`;

const MeetupDate = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const MeetupLocation = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.space[3]};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${({ theme }) => theme.space[2]};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MeetupType = styled.div<{ isIntentional: boolean }>`
  display: inline-block;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background-color: ${({ theme, isIntentional }) => 
    isIntentional ? theme.colors.secondary + '20' : theme.colors.primary + '20'};
  color: ${({ theme, isIntentional }) => 
    isIntentional ? theme.colors.secondary : theme.colors.primary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space[8]};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const EmptyStateTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const EmptyStateDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const LogMeetupButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[6]};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    margin-right: ${({ theme }) => theme.space[2]};
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndices.modal};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[6]};
  width: 90%;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  position: relative;
`;

const ModalHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.space[4]};
  right: ${({ theme }) => theme.space[4]};
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  
  input {
    margin-right: ${({ theme }) => theme.space[2]};
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.error}10;
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  background-color: ${({ theme }) => theme.colors.success}10;
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.space[6]};
  
  &:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid ${({ theme }) => theme.colors.border};
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-top: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[4]};
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -${({ theme }) => theme.space[2]};
    left: 0;
    width: 40px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.radii.full};
  }
`;

const AutocompleteContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SuggestionsList = styled.ul<{ $visible: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top: none;
  border-radius: 0 0 ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md};
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SuggestionItem = styled.li`
  padding: ${({ theme }) => theme.space[3]};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
  }
`;

const FriendAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary}40;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const SuggestionContent = styled.div`
  display: flex;
  align-items: center;
`;

const Meetups: React.FC = () => {
  const { user } = useAuth();
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeId, setPlaceId] = useState('');
  const [wasIntentional, setWasIntentional] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch places
        const placesData = await getUserPlaces(user.id);
        setPlaces(placesData?.map(up => up.places) || []);
        
        // Fetch meetups
        const meetupsData = await getMeetups(user.id);
        setMeetups(meetupsData || []);
        
        // Fetch friends
        const friendsData = await getFriends(user.id);
        setFriends(friendsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  useEffect(() => {
    // Filter friends based on input
    if (friendName.trim() === '') {
      setFilteredFriends([]);
      return;
    }
    
    const filtered = friends.filter(friend => 
      friend.users_view?.username?.toLowerCase().includes(friendName.toLowerCase())
    );
    setFilteredFriends(filtered);
  }, [friendName, friends]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFriendNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFriendName(e.target.value);
    setShowSuggestions(true);
  };
  
  const handleSelectFriend = (friend: Friend) => {
    setFriendName(friend.users_view?.username || '');
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    if (!friendName.trim()) {
      setError('Please enter a friend name');
      return;
    }
    if (!placeId) {
      setError('Please select a place');
      return;
    }
    
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
      setIsModalOpen(false);
      
      setSuccess('Meetup logged successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error logging meetup:', error);
      setError('Failed to log meetup. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

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
    
    const placeCounts: Record<string, { count: number; name: string }> = {};
    
    meetups.forEach(meetup => {
      const placeId = meetup.place_id;
      const placeName = meetup.places?.name || 'Unknown';
      
      if (!placeCounts[placeId]) {
        placeCounts[placeId] = { count: 0, name: placeName };
      }
      
      placeCounts[placeId].count += 1;
    });
    
    let maxCount = 0;
    let mostVisitedPlaceName = '';
    
    Object.values(placeCounts).forEach(({ count, name }) => {
      if (count > maxCount) {
        maxCount = count;
        mostVisitedPlaceName = name;
      }
    });
    
    return mostVisitedPlaceName;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Meetups</PageTitle>
        <PageDescription>
          Log your spontaneous encounters and planned meetups with friends to track your social connections
        </PageDescription>
      </PageHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          {meetups.length > 0 && (
            <>
              <StatsContainer>
                <StatCard>
                  <StatValue>{getMonthlyMeetups()}</StatValue>
                  <StatLabel>Meetups this month</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{getSpontaneousMeetups()}</StatValue>
                  <StatLabel>Spontaneous meetups</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{getPlannedMeetups()}</StatValue>
                  <StatLabel>Planned meetups</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{getMostVisitedPlace()}</StatValue>
                  <StatLabel>Most visited place</StatLabel>
                </StatCard>
              </StatsContainer>
              
              <SectionTitle>Your Meetups</SectionTitle>
            </>
          )}
          
          {meetups.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>No meetups yet</EmptyStateTitle>
              <EmptyStateDescription>
                Log your first meetup when you bump into a friend!
              </EmptyStateDescription>
              <LogMeetupButton onClick={() => setIsModalOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Log Your First Meetup
              </LogMeetupButton>
            </EmptyState>
          ) : (
            <MeetupsList>
              {meetups.map((meetup, i) => (
                <MeetupCard
                  key={meetup.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <MeetupHeader>
                    <MeetupTitle>Met {meetup.friend_name}</MeetupTitle>
                    <MeetupDate>{formatDate(meetup.timestamp)}</MeetupDate>
                  </MeetupHeader>
                  <MeetupLocation>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {meetup.places?.name || 'Unknown location'}
                  </MeetupLocation>
                  <MeetupType isIntentional={meetup.was_intentional}>
                    {meetup.was_intentional ? 'Planned' : 'Spontaneous'}
                  </MeetupType>
                </MeetupCard>
              ))}
            </MeetupsList>
          )}
          
          {meetups.length > 0 && (
            <LogMeetupButton onClick={() => setIsModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Log Meetup
            </LogMeetupButton>
          )}
        </>
      )}
      
      <Modal $isOpen={isModalOpen}>
        <ModalContent>
          <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
          <ModalHeader>
            <ModalTitle>Log a Meetup</ModalTitle>
          </ModalHeader>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="friendName">Friend's Name</Label>
              <AutocompleteContainer ref={inputRef}>
                <Input
                  id="friendName"
                  type="text"
                  value={friendName}
                  onChange={handleFriendNameChange}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Enter your friend's name"
                  required
                />
                <SuggestionsList $visible={showSuggestions && filteredFriends.length > 0}>
                  {filteredFriends.map(friend => (
                    <SuggestionItem 
                      key={friend.id} 
                      onClick={() => handleSelectFriend(friend)}
                    >
                      <SuggestionContent>
                        <FriendAvatar>
                          {friend.users_view?.username?.charAt(0).toUpperCase() || '?'}
                        </FriendAvatar>
                        {friend.users_view?.username || 'Unknown'}
                      </SuggestionContent>
                    </SuggestionItem>
                  ))}
                </SuggestionsList>
              </AutocompleteContainer>
              <small style={{ color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                You can enter any name, even if they're not on Bump
              </small>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="placeId">Where did you meet?</Label>
              <Select
                id="placeId"
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                required
              >
                <option value="">Select a place</option>
                {places.map((place) => (
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
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Meetups; 