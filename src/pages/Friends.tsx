import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFriends, addFriend, supabase } from '../services/supabase';
import { Friend } from '../types';
import FriendCard from '../components/FriendCard';
import AddFriendForm from '../components/AddFriendForm';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';

const FriendsContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FriendsList = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
`;

const EmptyState = styled.div`
  background-color: var(--secondary-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const AddFriendButton = styled.button`
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

const Friends: React.FC = () => {
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
    <FriendsContainer>
      <h1>Friends</h1>
      <p>Manage your connections and bump intentions</p>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <FriendsList>
          {friends.length === 0 ? (
            <EmptyState>
              <h3>Add your first friend</h3>
              <p>Connect with friends to see their check-ins and set bump intentions.</p>
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
      
      <AddFriendButton onClick={() => setIsModalOpen(true)}>
        Add Friend
      </AddFriendButton>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddFriendForm 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddFriend}
          currentUserId={user?.id || ''}
        />
      </Modal>
    </FriendsContainer>
  );
};

export default Friends; 