import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Place } from '../types';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 500px;
`;

const FormTitle = styled.h2`
  color: #4a7c59;
  margin-bottom: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4a7c59;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4a7c59;
  }
`;

const MapContainer = styled.div`
  height: 300px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const CancelButton = styled(Button)`
  background-color: #f5f1e3;
  color: #333;
  
  &:hover {
    background-color: #e5e1d3;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4a7c59;
  color: white;
  
  &:hover {
    background-color: #3a6a49;
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 4px;
`;

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const defaultCenter = {
  lat: 40.0150, // Boulder, CO coordinates
  lng: -105.2705,
};

interface PlaceFormProps {
  initialPlace?: Place;
  onSubmit: (place: Omit<Place, 'id'>) => void;
  onCancel: () => void;
}

const PlaceForm: React.FC<PlaceFormProps> = ({ initialPlace, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialPlace?.name || '');
  const [type, setType] = useState(initialPlace?.type || 'cafe');
  const [position, setPosition] = useState<google.maps.LatLngLiteral>(
    initialPlace?.lat && initialPlace?.lng
      ? { lat: initialPlace.lat, lng: initialPlace.lng }
      : defaultCenter
  );
  const [error, setError] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries as any,
  });

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setPosition({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a place name');
      return;
    }
    
    onSubmit({
      name,
      type,
      lat: position.lat,
      lng: position.lng,
      google_place_id: '', // We would get this from Google Places API in a more complete implementation
    });
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <FormContainer>
      <FormTitle>{initialPlace ? 'Edit Place' : 'Add New Place'}</FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Place Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., MycoCafe"
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="type">Place Type</Label>
          <Select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="cafe">Cafe</option>
            <option value="park">Park</option>
            <option value="coworking">Coworking Space</option>
            <option value="restaurant">Restaurant</option>
            <option value="bar">Bar</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Location</Label>
          <p>Click on the map to set the location</p>
          <MapContainer>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={position}
              zoom={13}
              onClick={handleMapClick}
            >
              <Marker position={position} />
            </GoogleMap>
          </MapContainer>
        </FormGroup>
        
        <ButtonGroup>
          <CancelButton type="button" onClick={onCancel}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit">
            {initialPlace ? 'Update Place' : 'Add Place'}
          </SubmitButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default PlaceForm; 