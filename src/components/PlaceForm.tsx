import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaPlus, FaSearch, FaLocationArrow } from 'react-icons/fa';
import { Place } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space[4]};
  width: 100%;
  max-width: 500px;
`;

const FormTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.space[2]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space[2]};
`;

const Label = styled.label`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: ${props => props.theme.space[3]};
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: ${props => props.theme.radii.md};
  font-size: ${props => props.theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }
`;

const MapContainer = styled.div`
  height: 300px;
  width: 100%;
  border-radius: ${props => props.theme.radii.lg};
  overflow: hidden;
  margin: ${props => props.theme.space[4]} 0;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.lightGray};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.space[3]};
  margin-top: ${props => props.theme.space[4]};
`;

const Button = styled.button`
  padding: ${props => props.theme.space[3]} ${props => props.theme.space[5]};
  border: none;
  border-radius: ${props => props.theme.radii.md};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space[2]};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const CancelButton = styled(Button)`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.theme.colors.secondaryDark};
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: ${props => props.theme.space[1]};
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.space[3]};
`;

const SearchInput = styled.input`
  padding: ${props => props.theme.space[3]};
  padding-left: ${props => props.theme.space[10]};
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: ${props => props.theme.radii.md};
  font-size: ${props => props.theme.fontSizes.md};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.space[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: ${props => props.theme.radii.md};
  box-shadow: ${props => props.theme.shadows.md};
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

const SuggestionItem = styled.div`
  padding: ${props => props.theme.space[3]};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space[2]};
  
  &:hover {
    background-color: ${props => props.theme.colors.backgroundAlt};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  }
`;

const SuggestionIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.md};
`;

const SuggestionText = styled.div`
  flex: 1;
`;

const SuggestionName = styled.div`
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.text};
`;

const SuggestionAddress = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textLight};
`;

const CustomLocationButton = styled.div`
  padding: ${props => props.theme.space[3]};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space[2]};
  background-color: ${props => props.theme.colors.backgroundAlt};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fontWeights.medium};
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const LocationOptionsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.space[2]};
  margin-bottom: ${props => props.theme.space[3]};
`;

const LocationOption = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${props => props.theme.space[2]};
  background-color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.secondary};
  color: ${props => props.$active ? props.theme.colors.white : props.theme.colors.text};
  border: none;
  border-radius: ${props => props.theme.radii.md};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space[2]};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? props.theme.colors.primaryDark : props.theme.colors.secondaryDark};
  }
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
  const theme = useTheme();
  const [name, setName] = useState(initialPlace?.name || '');
  const [type, setType] = useState(initialPlace?.type || 'cafe');
  const [position, setPosition] = useState<google.maps.LatLngLiteral>(
    initialPlace?.lat && initialPlace?.lng
      ? { lat: initialPlace.lat, lng: initialPlace.lng }
      : defaultCenter
  );
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationMode, setLocationMode] = useState<'search' | 'custom'>('search');
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Log Google Maps API key status (without exposing the actual key)
  useEffect(() => {
    console.log('Google Maps API Key available:', !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      console.error('Missing Google Maps API Key. Check your .env files or Vercel environment variables.');
      setError('Google Maps API Key is missing. Please check your configuration.');
    }
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries as any,
  });

  // Display error if Google Maps fails to load
  useEffect(() => {
    if (loadError) {
      console.error('Error loading Google Maps API:', loadError);
      setError('Failed to load Google Maps. Please try again later.');
    }
  }, [loadError]);

  // Initialize services when maps are loaded
  useEffect(() => {
    if (isLoaded && !loadError) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      
      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(userPos);
            setPosition(userPos);
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      }
    }
  }, [isLoaded, loadError]);

  // Initialize places service when map is ready
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    placesService.current = new google.maps.places.PlacesService(map);
  }, []);

  // Handle search input changes
  useEffect(() => {
    if (!autocompleteService.current || searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    const request: google.maps.places.AutocompletionRequest = {
      input: searchQuery,
      types: ['establishment', 'geocode'],
    };

    // Add location bias if user location is available
    if (userLocation) {
      request.location = new google.maps.LatLng(userLocation.lat, userLocation.lng);
      request.radius = 5000; // 5km radius
    }

    autocompleteService.current.getPlacePredictions(
      request,
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [searchQuery, userLocation]);

  // Handle suggestion selection
  const handleSuggestionSelect = (placeId: string) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      { placeId, fields: ['name', 'geometry', 'types', 'formatted_address'] },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
          setName(place.name || '');
          setPosition({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
          
          // Try to determine place type from Google's types
          if (place.types) {
            if (place.types.includes('cafe')) setType('cafe');
            else if (place.types.includes('park')) setType('park');
            else if (place.types.includes('restaurant')) setType('restaurant');
            else if (place.types.includes('bar')) setType('bar');
            else setType('other');
          }
          
          // Keep the place name in the search bar instead of clearing it
          setSearchQuery(place.name || '');
          setShowSuggestions(false);
          
          // Center map on the selected place
          if (mapRef.current) {
            mapRef.current.panTo({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
            mapRef.current.setZoom(15);
          }
        }
      }
    );
  };

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng && locationMode === 'custom') {
      setPosition({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  }, [locationMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (locationMode === 'custom' && !name.trim()) {
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

  const useCurrentLocation = () => {
    if (userLocation) {
      setPosition(userLocation);
      if (mapRef.current) {
        mapRef.current.panTo(userLocation);
        mapRef.current.setZoom(15);
      }
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <FormContainer>
      <FormTitle>{initialPlace ? 'Edit Place' : 'Add New Place'}</FormTitle>
      
      <form onSubmit={handleSubmit}>
        {locationMode === 'custom' && (
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
        )}
        
        <FormGroup>
          <Label>Location</Label>
          
          <LocationOptionsContainer>
            <LocationOption 
              type="button" 
              $active={locationMode === 'search'}
              onClick={() => setLocationMode('search')}
            >
              <FaSearch /> Search Location
            </LocationOption>
            <LocationOption 
              type="button" 
              $active={locationMode === 'custom'}
              onClick={() => setLocationMode('custom')}
            >
              <FaMapMarkerAlt /> Custom Location
            </LocationOption>
          </LocationOptionsContainer>
          
          {locationMode === 'search' && (
            <SearchContainer>
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a place..."
                onFocus={() => setShowSuggestions(true)}
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <SuggestionsContainer>
                  {suggestions.map((suggestion) => (
                    <SuggestionItem 
                      key={suggestion.place_id}
                      onClick={() => handleSuggestionSelect(suggestion.place_id)}
                    >
                      <SuggestionIcon>
                        <FaMapMarkerAlt />
                      </SuggestionIcon>
                      <SuggestionText>
                        <SuggestionName>{suggestion.structured_formatting.main_text}</SuggestionName>
                        <SuggestionAddress>{suggestion.structured_formatting.secondary_text}</SuggestionAddress>
                      </SuggestionText>
                    </SuggestionItem>
                  ))}
                  <CustomLocationButton onClick={() => {
                    setLocationMode('custom');
                    setShowSuggestions(false);
                  }}>
                    <FaPlus /> Add a custom location
                  </CustomLocationButton>
                </SuggestionsContainer>
              )}
              
              {showSuggestions && suggestions.length === 0 && searchQuery.trim() !== '' && (
                <SuggestionsContainer>
                  <CustomLocationButton onClick={() => {
                    setLocationMode('custom');
                    setShowSuggestions(false);
                    setName(searchQuery);
                  }}>
                    <FaPlus /> Add "{searchQuery}" as a custom location
                  </CustomLocationButton>
                </SuggestionsContainer>
              )}
            </SearchContainer>
          )}
          
          {locationMode === 'custom' && (
            <p>Click on the map to set a custom location or use your current location</p>
          )}
          
          <Button 
            type="button" 
            onClick={useCurrentLocation}
            style={{ 
              marginBottom: theme.space[3],
              backgroundColor: theme.colors.secondary,
              color: theme.colors.text
            }}
          >
            <FaLocationArrow /> Use My Current Location
          </Button>
          
          {locationMode === 'custom' && (
            <MapContainer>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={position}
                zoom={13}
                onClick={handleMapClick}
                onLoad={onMapLoad}
              >
                <Marker position={position} />
              </GoogleMap>
            </MapContainer>
          )}
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