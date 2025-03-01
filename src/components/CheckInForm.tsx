import React, { useState } from 'react';
import styled from 'styled-components';

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

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  font-size: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
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

// Mock data for places (will be replaced with data from Supabase)
const mockPlaces = [
  { id: '1', name: 'MycoCafe', type: 'cafe' },
  { id: '2', name: 'North Boulder Park', type: 'park' },
  { id: '3', name: 'Tonic Coworking', type: 'coworking' },
  { id: '4', name: 'Boulder Creek Path', type: 'outdoors' }
];

interface CheckInFormProps {
  onClose: () => void;
  onSubmit: (data: {
    placeId: string;
    activity: string;
    privacy: 'all' | 'intended' | 'specific';
  }) => void;
}

const CheckInForm: React.FC<CheckInFormProps> = ({ onClose, onSubmit }) => {
  const [placeId, setPlaceId] = useState('');
  const [activity, setActivity] = useState('');
  const [privacy, setPrivacy] = useState<'all' | 'intended' | 'specific'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeId || !activity) return;
    
    onSubmit({
      placeId,
      activity,
      privacy
    });
  };

  return (
    <FormContainer>
      <FormTitle>Check In</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="place">Where are you?</Label>
          <Select 
            id="place" 
            value={placeId} 
            onChange={(e) => setPlaceId(e.target.value)}
            required
          >
            <option value="">Select a place</option>
            {mockPlaces.map(place => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="activity">What are you doing?</Label>
          <Input 
            id="activity" 
            type="text" 
            placeholder="e.g., Reading, Working, Having coffee" 
            value={activity} 
            onChange={(e) => setActivity(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Who can see this?</Label>
          <RadioGroup>
            <RadioOption>
              <input 
                type="radio" 
                id="all" 
                name="privacy" 
                value="all" 
                checked={privacy === 'all'} 
                onChange={() => setPrivacy('all')} 
              />
              <span>All friends</span>
            </RadioOption>
            <RadioOption>
              <input 
                type="radio" 
                id="intended" 
                name="privacy" 
                value="intended" 
                checked={privacy === 'intended'} 
                onChange={() => setPrivacy('intended')} 
              />
              <span>Only friends who intend to bump with me</span>
            </RadioOption>
            <RadioOption>
              <input 
                type="radio" 
                id="specific" 
                name="privacy" 
                value="specific" 
                checked={privacy === 'specific'} 
                onChange={() => setPrivacy('specific')} 
              />
              <span>Specific friends (coming soon)</span>
            </RadioOption>
          </RadioGroup>
        </FormGroup>
        
        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit">
            Check In
          </SubmitButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default CheckInForm; 