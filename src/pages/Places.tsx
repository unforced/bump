import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getUserPlaces, addPlace, addUserPlace, getCurrentUser } from '../services/supabase';
import { Place, UserPlace } from '../types';
import PlaceForm from '../components/PlaceForm';
import Modal from '../components/Modal';
import { FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaCompass } from 'react-icons/fa';
import Button from '../components/Button';

const PlacesContainer = styled.div`
  padding: ${props => props.theme.space[5]};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.space[2]};
  font-size: ${props => props.theme.fontSizes['3xl']};
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.space[6]};
  max-width: 600px;
`;

const PlacesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.space[5]};
  margin-top: ${props => props.theme.space[5]};
  width: 100%;
`;

const PlaceCard = styled.div`
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.radii.xl};
  padding: ${props => props.theme.space[5]};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: ${props => props.theme.colors.primary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const PlaceName = styled.h3`
  margin-top: 0;
  margin-bottom: ${props => props.theme.space[2]};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.xl};
`;

const PlaceLocation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space[2]};
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.space[4]};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.space[3]};
  margin-top: ${props => props.theme.space[4]};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.xl};
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.backgroundAlt};
    color: ${props => props.theme.colors.accent};
    transform: scale(1.1);
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    background-color: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.white};
  }
`;

const EmptyState = styled.div`
  padding: ${props => props.theme.space[8]};
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.radii.xl};
  text-align: center;
  width: 100%;
  max-width: 600px;
  margin: ${props => props.theme.space[5]} auto;
  box-shadow: ${props => props.theme.shadows.md};
`;

const EmptyStateIcon = styled.div`
  font-size: ${props => props.theme.fontSizes['4xl']};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.space[4]};
`;

const EmptyStateTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.space[3]};
  font-size: ${props => props.theme.fontSizes['2xl']};
`;

const EmptyStateDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.space[5]};
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${props => props.theme.colors.lightGray};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: ${props => props.theme.space[8]} auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ConfirmationModal = styled.div`
  text-align: center;
  padding: ${props => props.theme.space[4]};
`;

const ConfirmationTitle = styled.h3`
  color: ${props => props.theme.colors.error};
  margin-bottom: ${props => props.theme.space[4]};
`;

const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.space[4]};
  margin-top: ${props => props.theme.space[6]};
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.space[4]};
  border-radius: ${props => props.theme.radii.md};
  margin-bottom: ${props => props.theme.space[5]};
  text-align: center;
  width: 100%;
  max-width: 600px;
`;

// Function to delete a user place
const deleteUserPlace = async (id: string) => {
  console.log(`Deleting user place with id: ${id}`);
  // In a real implementation, this would call the API
  return Promise.resolve();
};

const Places: React.FC = () => {
  const [userPlaces, setUserPlaces] = useState<UserPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [deletingPlace, setDeletingPlace] = useState<UserPlace | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndPlaces = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = await getCurrentUser();
        if (user) {
          setUserId(user.id);
          const places = await getUserPlaces(user.id);
          
          // Filter out places with missing data
          const validPlaces = places.filter(place => 
            place && place.places && place.places.name && place.places.type
          );
          
          setUserPlaces(validPlaces);
        } else {
          setError("No user found. Please log in.");
        }
      } catch (error) {
        console.error('Error fetching places:', error);
        setError("Failed to load places. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPlaces();
  }, []);

  const handleAddPlace = () => {
    setEditingPlace(null);
    setIsModalOpen(true);
  };

  const handleEditPlace = (place: Place) => {
    if (!place) {
      console.error('Attempted to edit a null place');
      return;
    }
    setEditingPlace(place);
    setIsModalOpen(true);
  };

  const handleDeletePlace = (userPlace: UserPlace) => {
    if (!userPlace) {
      console.error('Attempted to delete a null user place');
      return;
    }
    setDeletingPlace(userPlace);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePlace = async () => {
    if (!userId || !deletingPlace) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await deleteUserPlace(deletingPlace.id);
      
      // Refresh the places list
      const places = await getUserPlaces(userId);
      
      // Filter out places with missing data
      const validPlaces = places.filter(place => 
        place && place.places && place.places.name && place.places.type
      );
      
      setUserPlaces(validPlaces);
      
      // Close the modal
      setIsDeleteModalOpen(false);
      setDeletingPlace(null);
    } catch (error) {
      console.error('Error deleting place:', error);
      setError("Failed to delete place. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlace(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingPlace(null);
  };

  const handleSubmitPlace = async (placeData: Omit<Place, 'id'>) => {
    if (!userId) {
      setError("No user found. Please log in.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // If we're editing an existing place, we would update it here
      // For now, we'll just add a new place
      
      // First add the place to the places table
      const newPlace = await addPlace(placeData);
      
      // Then link it to the user
      await addUserPlace(userId, newPlace.id, 'friends');
      
      // Refresh the places list
      const places = await getUserPlaces(userId);
      
      // Filter out places with missing data
      const validPlaces = places.filter(place => 
        place && place.places && place.places.name && place.places.type
      );
      
      setUserPlaces(validPlaces);
      
      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding place:', error);
      setError("Failed to add place. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render the add button with icon
  const renderAddButton = (text: string, size: 'sm' | 'md' | 'lg' = 'md') => (
    <Button 
      variant="primary" 
      size={size} 
      onClick={handleAddPlace}
    >
      <FaPlus style={{ marginRight: '8px' }} /> {text}
    </Button>
  );

  return (
    <PlacesContainer>
      <PageTitle>Gathering Places</PageTitle>
      <PageDescription>
        Add your favorite spots to hang out and let friends know where they might bump into you.
      </PageDescription>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {renderAddButton('Add New Place', 'lg')}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <PlacesList>
          {userPlaces.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <FaCompass />
              </EmptyStateIcon>
              <EmptyStateTitle>No places added yet</EmptyStateTitle>
              <EmptyStateDescription>
                Start by adding your favorite cafes, parks, or hangout spots where friends might bump into you.
              </EmptyStateDescription>
              {renderAddButton('Add Your First Place')}
            </EmptyState>
          ) : (
            userPlaces.map((userPlace) => {
              // Skip rendering if place data is missing
              if (!userPlace || !userPlace.places) return null;
              
              const place = userPlace.places;
              
              return (
                <PlaceCard key={userPlace.id} className="animate-fade-in">
                  <PlaceName>{place.name || 'Unnamed Place'}</PlaceName>
                  <PlaceLocation>
                    <FaMapMarkerAlt />
                    {place.lat && place.lng 
                      ? `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`
                      : 'Location not specified'}
                  </PlaceLocation>
                  <ActionButtons>
                    <ActionButton onClick={() => handleEditPlace(place)}>
                      <FaEdit />
                    </ActionButton>
                    <DeleteButton onClick={() => handleDeletePlace(userPlace)}>
                      <FaTrash />
                    </DeleteButton>
                  </ActionButtons>
                </PlaceCard>
              );
            })
          )}
        </PlacesList>
      )}
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <PlaceForm
          initialPlace={editingPlace || undefined}
          onSubmit={handleSubmitPlace}
          onCancel={handleCloseModal}
        />
      </Modal>
      
      <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <ConfirmationModal>
          <ConfirmationTitle>Delete Place</ConfirmationTitle>
          <p>Are you sure you want to delete "{deletingPlace?.places?.name || 'this place'}"?</p>
          <p>This action cannot be undone.</p>
          <ConfirmationButtons>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
            <Button variant="primary" onClick={confirmDeletePlace}>Delete</Button>
          </ConfirmationButtons>
        </ConfirmationModal>
      </Modal>
    </PlacesContainer>
  );
};

export default Places; 