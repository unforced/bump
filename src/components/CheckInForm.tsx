import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPlaces } from '../services/supabase';
import { Place } from '../types';
import { FaMapMarkerAlt, FaUserFriends, FaUserSecret } from 'react-icons/fa';

const FormContainer = styled.div`
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.radii.lg};
  padding: ${props => props.theme.space[5]};
  box-shadow: ${props => props.theme.shadows.md};
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  margin-bottom: ${props => props.theme.space[4]};
  text-align: center;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes['2xl']};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.space[4]};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.space[2]};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.text};
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.space[3]};
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: ${props => props.theme.radii.md};
  background-color: ${props => props.theme.colors.background};
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.backgroundAlt};
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.space[3]};
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: ${props => props.theme.radii.md};
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space[3]};
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space[2]};
  cursor: pointer;
  padding: ${props => props.theme.space[2]};
  border-radius: ${props => props.theme.radii.md};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.backgroundAlt};
  }
  
  input {
    accent-color: ${props => props.theme.colors.primary};
  }
`;

const RadioLabel = styled.span`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.text};
`;

const RadioIcon = styled.span`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.theme.space[5]};
`;

const Button = styled.button`
  padding: ${props => props.theme.space[3]} ${props => props.theme.space[5]};
  border: none;
  border-radius: ${props => props.theme.radii.md};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const CancelButton = styled(Button)`
  background-color: ${props => props.theme.colors.backgroundAlt};
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.theme.colors.lightGray};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: ${props => props.theme.space[2]};
`;

// Fallback mock data in case Supabase connection fails
const fallbackPlaces = [
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
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const data = await getPlaces();
        setPlaces(data || []);
      } catch (error) {
        // Fallback to mock data if Supabase fails
        setPlaces(fallbackPlaces);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeId || !activity) return;
    
    setSubmitting(true);
    
    try {
      await onSubmit({
        placeId,
        activity,
        privacy
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer className="scale">
      <FormTitle>Check In</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="place">Where are you?</Label>
          <Select 
            id="place" 
            value={placeId} 
            onChange={(e) => setPlaceId(e.target.value)}
            required
            disabled={loading}
            className={loading ? "shimmer" : ""}
          >
            <option value="">Select a place</option>
            {places.map(place => (
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
              <RadioIcon><FaUserFriends /></RadioIcon>
              <RadioLabel>All friends</RadioLabel>
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
              <RadioIcon><FaMapMarkerAlt /></RadioIcon>
              <RadioLabel>Only friends who intend to bump with me</RadioLabel>
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
              <RadioIcon><FaUserSecret /></RadioIcon>
              <RadioLabel>Specific friends (coming soon)</RadioLabel>
            </RadioOption>
          </RadioGroup>
        </FormGroup>
        
        <ButtonGroup>
          <CancelButton type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={submitting} className={submitting ? "" : "pulse-on-hover"}>
            {submitting ? (
              <>
                <LoadingSpinner /> Checking In...
              </>
            ) : (
              "Check In"
            )}
          </SubmitButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default CheckInForm; 