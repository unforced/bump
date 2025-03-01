import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllUsers } from '../services/supabase';

const SelectorContainer = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 4px;
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 14px;
  margin-top: 4px;
`;

interface User {
  id: string;
  email: string;
  username?: string;
}

interface UserSelectorProps {
  onSelect: (userId: string) => void;
  excludeIds?: string[];
  label?: string;
}

const UserSelector: React.FC<UserSelectorProps> = ({ 
  onSelect, 
  excludeIds = [], 
  label = "Select User" 
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        
        // Filter out excluded users
        const filteredUsers = data.filter(user => !excludeIds.includes(user.id));
        setUsers(filteredUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [excludeIds]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    onSelect(userId);
  };

  return (
    <SelectorContainer>
      <Label htmlFor="user-selector">{label}</Label>
      
      {loading ? (
        <LoadingText>Loading users...</LoadingText>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <Select 
          id="user-selector" 
          value={selectedUserId} 
          onChange={handleChange}
        >
          <option value="">-- Select a user --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username ? `${user.username} (${user.email})` : user.email}
            </option>
          ))}
        </Select>
      )}
    </SelectorContainer>
  );
};

export default UserSelector; 