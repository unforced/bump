import React, { useState } from 'react';
import styled from 'styled-components';
import UserSelector from './UserSelector';

const FormContainer = styled.div`
  background-color: var(--secondary-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const CancelButton = styled(Button)`
  background-color: #f1f1f1;
  color: #333;
  
  &:hover {
    background-color: #e1e1e1;
  }
`;

const SubmitButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  
  &:hover {
    background-color: #3a6a49;
    transform: scale(1.05);
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 4px;
`;

interface AddFriendFormProps {
  onClose: () => void;
  onSubmit: (data: { friendId: string }) => void;
  currentUserId: string;
}

const AddFriendForm: React.FC<AddFriendFormProps> = ({ onClose, onSubmit, currentUserId }) => {
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
    <FormContainer>
      <FormTitle>Add Friend</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <UserSelector 
            onSelect={setFriendId} 
            excludeIds={[currentUserId]} 
            label="Select a user to add as a friend"
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>
        
        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit">
            Add Friend
          </SubmitButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default AddFriendForm; 