import React, { useState } from 'react';
import styled from 'styled-components';
import UserSelector from './UserSelector';
import { useTheme } from '../contexts/ThemeContext';

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[5]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[5]};
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.space[6]};
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[6]}`};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const CancelButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.text};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.mediumGray};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: scale(1.05);
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space[1]};
`;

interface AddFriendFormProps {
  onClose: () => void;
  onSubmit: (data: { friendId: string }) => void;
  currentUserId: string;
}

const AddFriendForm: React.FC<AddFriendFormProps> = ({ onClose, onSubmit, currentUserId }) => {
  const theme = useTheme();
  const [friendId, setFriendId] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!friendId) {
      setError('Please select a user');
      return;
    }
    
    onSubmit({ friendId });
  };
  
  return (
    <FormContainer theme={theme}>
      <FormTitle theme={theme}>Add Friend</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup theme={theme}>
          <UserSelector 
            onSelect={setFriendId} 
            excludeIds={[currentUserId]} 
            label="Select a user to add as a friend"
          />
          {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}
        </FormGroup>
        
        <ButtonGroup theme={theme}>
          <CancelButton theme={theme} type="button" onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton theme={theme} type="submit">
            Add Friend
          </SubmitButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default AddFriendForm; 