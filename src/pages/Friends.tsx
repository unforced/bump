import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFriends, addFriend, supabase } from '../services/supabase';
import { Friend } from '../types';
import FriendCard from '../components/FriendCard';
import AddFriendForm from '../components/AddFriendForm';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.space[5]};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.space[6]};
  max-width: 600px;
`;

const FriendsList = styled.div`
  margin-top: ${({ theme }) => theme.space[5]};
  width: 100%;
  max-width: 600px;
`;

const EmptyState = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[5]};
  margin-bottom: ${({ theme }) => theme.space[4]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
`;

const EmptyStateTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const EmptyStateDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const AddFriendButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[6]}`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  margin-top: ${({ theme }) => theme.space[5]};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: scale(1.05);
  }
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
  margin-bottom: ${({ theme }) => theme.space[4]};
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space[4]};
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const InfoCard = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[5]};
  width: 100%;
  max-width: 600px;
  text-align: left;
`;

const InfoTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const InfoDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const InfoList = styled.ul`
  margin: ${({ theme }) => theme.space[3]} 0;
  padding-left: ${({ theme }) => theme.space[5]};
`;

const InfoListItem = styled.li`
  margin-bottom: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Friends: React.FC = () => {
  const theme = useTheme();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        const data = await getFriends(user.id);
        setFriends(data || []);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Failed to load friends. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();

    // Set up real-time subscription for friend updates
    let friendsSubscription: { unsubscribe: () => void } | undefined;
    if (user) {
      friendsSubscription = supabase
        .channel('public:friends')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'friends',
          filter: `user_id=eq.${user.id}` 
        }, (payload: any) => {
          console.log('Friend change received!', payload);
          fetchFriends();
        })
        .subscribe();
    }

    return () => {
      if (friendsSubscription) {
        friendsSubscription.unsubscribe();
      }
    };
  }, [user]);

  const handleAddFriend = async (data: { friendId: string }) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Add friend with default intend_to_bump set to 'off'
      await addFriend(user.id, data.friendId);
      
      setSuccess(`Friend added successfully`);
      setIsModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error adding friend:', error);
      setError('Failed to add friend. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFriendUpdate = () => {
    // This will be called after a friend is updated
    // The real-time subscription should handle refreshing the list
    setSuccess('Friend updated successfully');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  return (
    <PageContainer theme={theme}>
      <PageTitle theme={theme}>Friends</PageTitle>
      <PageDescription theme={theme}>
        Manage your connections and set your bump intentions to increase the chances of spontaneous meetups
      </PageDescription>
      
      <InfoCard theme={theme}>
        <InfoTitle theme={theme}>What is "Intend to Bump"?</InfoTitle>
        <InfoDescription theme={theme}>
          The "Intend to Bump" feature helps you connect with friends in a natural way. 
          You can set your intention to bump into specific friends, which affects how you're notified about their check-ins.
        </InfoDescription>
        <InfoList theme={theme}>
          <InfoListItem theme={theme}>
            <strong>Off:</strong> You won't receive special notifications about this friend's check-ins.
          </InfoListItem>
          <InfoListItem theme={theme}>
            <strong>Private:</strong> You'll be notified when this friend checks in, but they won't know you're intending to bump into them.
          </InfoListItem>
          <InfoListItem theme={theme}>
            <strong>Shared:</strong> Both you and your friend will be notified of each other's check-ins, creating mutual awareness.
          </InfoListItem>
        </InfoList>
        <InfoDescription theme={theme}>
          For "Shared" to work, both you and your friend need to set the intention to "Shared".
        </InfoDescription>
      </InfoCard>
      
      {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}
      {success && <SuccessMessage theme={theme}>{success}</SuccessMessage>}
      
      {loading ? (
        <LoadingSpinner theme={theme} />
      ) : (
        <FriendsList theme={theme}>
          {friends.length === 0 ? (
            <EmptyState theme={theme}>
              <EmptyStateTitle theme={theme}>Add your first friend</EmptyStateTitle>
              <EmptyStateDescription theme={theme}>
                Connect with friends to see their check-ins and set bump intentions.
              </EmptyStateDescription>
            </EmptyState>
          ) : (
            friends.map(friend => (
              <FriendCard 
                key={friend.id} 
                friend={friend} 
                onUpdate={handleFriendUpdate} 
              />
            ))
          )}
        </FriendsList>
      )}
      
      <AddFriendButton theme={theme} onClick={() => setIsModalOpen(true)}>
        Add Friend
      </AddFriendButton>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddFriendForm 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddFriend}
          currentUserId={user?.id || ''}
        />
      </Modal>
    </PageContainer>
  );
};

export default Friends; 