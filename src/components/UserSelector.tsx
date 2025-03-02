import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllUsers } from '../services/supabase';
import { useTheme } from '../contexts/ThemeContext';

const SelectorContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.space[2.5]};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.white};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}30`};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.lightGray};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space[1]};
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space[1]};
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin: ${({ theme }) => theme.space[2]} auto;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NoUsersMessage = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space[1]};
  font-style: italic;
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
  const theme = useTheme();
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
    <SelectorContainer theme={theme}>
      <Label htmlFor="user-selector" theme={theme}>{label}</Label>
      
      {loading ? (
        <>
          <LoadingSpinner theme={theme} />
          <LoadingText theme={theme}>Loading users...</LoadingText>
        </>
      ) : error ? (
        <ErrorMessage theme={theme}>{error}</ErrorMessage>
      ) : users.length === 0 ? (
        <NoUsersMessage theme={theme}>No users available to add as friends</NoUsersMessage>
      ) : (
        <Select 
          theme={theme}
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