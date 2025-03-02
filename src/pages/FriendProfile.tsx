import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  getFriendById, 
  getUserPlacesByUserId, 
  getActiveStatusesByUserId,
  updateIntendToBump
} from '../services/supabase';
import { Friend, UserPlace, Status } from '../types';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.space[5]};
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  align-self: flex-start;
  margin-bottom: ${({ theme }) => theme.space[4]};
  
  &:hover {
    text-decoration: underline;
  }
  
  &::before {
    content: '←';
    margin-right: ${({ theme }) => theme.space[2]};
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[5]};
  width: 100%;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-right: ${({ theme }) => theme.space[4]};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  margin: 0 0 ${({ theme }) => theme.space[1]} 0;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.text};
`;

const ProfileEmail = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textLight};
`;

const IntentSection = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.space[3]};
`;

const IntentStatus = styled.div<{ $status: 'off' | 'private' | 'shared'; $isMutual: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background-color: ${({ theme, $status, $isMutual }) => 
    $isMutual && $status === 'shared'
      ? `${theme.colors.success}20`
      : $status === 'off'
        ? `${theme.colors.mediumGray}20`
        : $status === 'private'
          ? `${theme.colors.accent}20`
          : `${theme.colors.success}20`
  };
  color: ${({ theme, $status, $isMutual }) => 
    $isMutual && $status === 'shared'
      ? theme.colors.success
      : $status === 'off'
        ? theme.colors.mediumGray
        : $status === 'private'
          ? theme.colors.accent
          : theme.colors.success
  };
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: ${({ theme }) => theme.space[2]};
    background-color: ${({ theme, $status, $isMutual }) => 
      $isMutual && $status === 'shared'
        ? theme.colors.success
        : $status === 'off'
          ? theme.colors.mediumGray
          : $status === 'private'
            ? theme.colors.accent
            : theme.colors.success
    };
  }
`;

const TabsContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  background-color: transparent;
  border: none;
  border-bottom: 3px solid ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : 'transparent'
  };
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.text
  };
  font-weight: ${({ theme, $isActive }) => 
    $isActive ? theme.fontWeights.semibold : theme.fontWeights.normal
  };
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContentContainer = styled.div`
  width: 100%;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[3]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%;
`;

const PlaceCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const PlaceName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.space[2]} 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const PlaceType = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const StatusCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const StatusActivity = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const StatusTime = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const StatusLocation = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: ${({ theme }) => theme.space[1]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.colors.textLight};
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.lightGray};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: ${({ theme }) => theme.space[5]} auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.md};
  margin: ${({ theme }) => theme.space[4]} 0;
  width: 100%;
  text-align: center;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[3]};
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

type TabType = 'places' | 'statuses';

const FriendProfile: React.FC = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [friend, setFriend] = useState<Friend | null>(null);
  const [places, setPlaces] = useState<UserPlace[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('places');
  const [intendToBump, setIntendToBump] = useState<'off' | 'private' | 'shared'>('off');
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasMutualIntent, setHasMutualIntent] = useState(false);
  
  useEffect(() => {
    const fetchFriendData = async () => {
      if (!friendId || !user) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Fetch friend relationship
        const friendData = await getFriendById(user.id, friendId);
        if (!friendData) {
          setError('Friend not found or you do not have permission to view this profile.');
          setLoading(false);
          return;
        }
        
        setFriend(friendData);
        setIntendToBump(friendData.intend_to_bump);
        
        // Check if there's a mutual intent
        const mutualFriend = await getFriendById(friendId, user.id);
        setHasMutualIntent(
          mutualFriend?.intend_to_bump === 'shared' && 
          friendData.intend_to_bump === 'shared'
        );
        
        // Fetch places and statuses if we have permission
        // (either friend has shared intent or we have private/shared intent)
        if (
          friendData.intend_to_bump === 'shared' || 
          mutualFriend?.intend_to_bump === 'shared' ||
          mutualFriend?.intend_to_bump === 'private'
        ) {
          const placesData = await getUserPlacesByUserId(friendId);
          setPlaces(placesData || []);
          
          const statusesData = await getActiveStatusesByUserId(friendId);
          setStatuses(statusesData || []);
        }
      } catch (err) {
        console.error('Error fetching friend data:', err);
        setError('Failed to load friend data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFriendData();
  }, [friendId, user]);
  
  const handleIntendChange = async (newValue: 'off' | 'private' | 'shared') => {
    if (!friend || newValue === intendToBump) return;
    
    setIsUpdating(true);
    
    try {
      await updateIntendToBump(friend.id, newValue);
      setIntendToBump(newValue);
      
      // Refetch to check if there's now a mutual intent
      if (friendId && user) {
        const mutualFriend = await getFriendById(friendId, user.id);
        setHasMutualIntent(
          mutualFriend?.intend_to_bump === 'shared' && 
          newValue === 'shared'
        );
        
        // If we now have permission, fetch places and statuses
        if (
          newValue === 'shared' || 
          mutualFriend?.intend_to_bump === 'shared' ||
          mutualFriend?.intend_to_bump === 'private'
        ) {
          const placesData = await getUserPlacesByUserId(friendId);
          setPlaces(placesData || []);
          
          const statusesData = await getActiveStatusesByUserId(friendId);
          setStatuses(statusesData || []);
        }
      }
    } catch (err) {
      console.error('Error updating intend to bump:', err);
      setIntendToBump(friend.intend_to_bump); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  const getFriendName = () => {
    if (!friend?.users_view) return 'Friend';
    
    if (friend.users_view.username) {
      return friend.users_view.username;
    }
    
    // Try to get username from metadata if available
    const userData = friend.users_view as any;
    if (userData?.user_metadata?.username) {
      return userData.user_metadata.username;
    }
    
    // Fallback to email or anonymous
    return friend.users_view.email?.split('@')[0] || 'Anonymous';
  };
  
  const getIntentText = () => {
    if (hasMutualIntent && intendToBump === 'shared') {
      return 'Mutual intent to bump';
    }
    
    switch (intendToBump) {
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
  
  const canViewContent = () => {
    if (!friend) return false;
    
    // If we have a mutual intent, we can view content
    if (hasMutualIntent) return true;
    
    // If we have a private or shared intent, we can view content
    return intendToBump === 'private' || intendToBump === 'shared';
  };
  
  if (loading) {
    return (
      <PageContainer theme={theme}>
        <LoadingSpinner theme={theme} />
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer theme={theme}>
        <BackButton theme={theme} onClick={() => navigate('/friends')}>
          Back to Friends
        </BackButton>
        <ErrorMessage theme={theme}>{error}</ErrorMessage>
      </PageContainer>
    );
  }
  
  if (!friend) {
    return (
      <PageContainer theme={theme}>
        <BackButton theme={theme} onClick={() => navigate('/friends')}>
          Back to Friends
        </BackButton>
        <ErrorMessage theme={theme}>Friend not found</ErrorMessage>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer theme={theme}>
      <BackButton theme={theme} onClick={() => navigate('/friends')}>
        Back to Friends
      </BackButton>
      
      <ProfileHeader theme={theme}>
        <Avatar theme={theme}>{getInitials(getFriendName())}</Avatar>
        <ProfileInfo>
          <ProfileName theme={theme}>{getFriendName()}</ProfileName>
          <ProfileEmail theme={theme}>{friend.users_view?.email}</ProfileEmail>
          
          <IntentSection theme={theme}>
            <IntentStatus 
              theme={theme} 
              $status={intendToBump} 
              $isMutual={hasMutualIntent}
            >
              {getIntentText()}
            </IntentStatus>
          </IntentSection>
          
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
        </ProfileInfo>
      </ProfileHeader>
      
      {!canViewContent() ? (
        <EmptyState theme={theme}>
          <p>Set your intention to bump to view this friend's places and statuses.</p>
        </EmptyState>
      ) : (
        <>
          <TabsContainer theme={theme}>
            <Tab 
              theme={theme} 
              $isActive={activeTab === 'places'} 
              onClick={() => setActiveTab('places')}
            >
              Places
            </Tab>
            <Tab 
              theme={theme} 
              $isActive={activeTab === 'statuses'} 
              onClick={() => setActiveTab('statuses')}
            >
              Status Updates
            </Tab>
          </TabsContainer>
          
          <ContentContainer>
            {activeTab === 'places' && (
              <>
                {places.length === 0 ? (
                  <EmptyState theme={theme}>
                    <p>No places added yet.</p>
                  </EmptyState>
                ) : (
                  places.map(place => (
                    <PlaceCard key={place.id} theme={theme}>
                      <PlaceName theme={theme}>{place.places?.name || 'Unnamed Place'}</PlaceName>
                      <PlaceType theme={theme}>{place.places?.type || 'No type specified'}</PlaceType>
                    </PlaceCard>
                  ))
                )}
              </>
            )}
            
            {activeTab === 'statuses' && (
              <>
                {statuses.length === 0 ? (
                  <EmptyState theme={theme}>
                    <p>No active status updates.</p>
                  </EmptyState>
                ) : (
                  statuses.map(status => (
                    <StatusCard key={status.id} theme={theme}>
                      <StatusHeader theme={theme}>
                        <StatusActivity theme={theme}>{status.activity}</StatusActivity>
                        <StatusTime theme={theme}>{formatDate(status.timestamp)}</StatusTime>
                      </StatusHeader>
                      <StatusLocation theme={theme}>
                        at {status.places?.name || 'Unknown Location'}
                      </StatusLocation>
                    </StatusCard>
                  ))
                )}
              </>
            )}
          </ContentContainer>
        </>
      )}
    </PageContainer>
  );
};

export default FriendProfile; 