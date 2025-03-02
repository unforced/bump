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

const PlaceType = styled.div`
  position: absolute;
  top: ${props => props.theme.space[3]};
  right: ${props => props.theme.space[3]};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.space[1]} ${props => props.theme.space[3]};
  border-radius: ${props => props.theme.radii.full};
  font-size: ${props => props.theme.fontSizes.xs};
  text-transform: capitalize;
  font-weight: ${props => props.theme.fontWeights.medium};
  letter-spacing: 0.5px;
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

// Mock function for deleteUserPlace since it's not exported from supabase.ts
const deleteUserPlace = async (id: string) => {
  console.log(`Deleting user place with id: ${id}`);
  // In a real implementation, this would call the API
  return Promise.resolve();
};

const Places: React.FC = () => {
  const [userPlaces, setUserPlaces] = useState<UserPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [deletingPlace, setDeletingPlace] = useState<UserPlace | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndPlaces = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserId(user.id);
          const places = await getUserPlaces(user.id);
          setUserPlaces(places);
        }
      } catch (error) {
        console.error('Error fetching places:', error);
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
    setEditingPlace(place);
    setIsModalOpen(true);
  };

  const handleDeletePlace = (userPlace: UserPlace) => {
    setDeletingPlace(userPlace);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePlace = async () => {
    if (!userId || !deletingPlace) return;
    
    try {
      setLoading(true);
      await deleteUserPlace(deletingPlace.id);
      
      // Refresh the places list
      const places = await getUserPlaces(userId);
      setUserPlaces(places);
      
      // Close the modal
      setIsDeleteModalOpen(false);
      setDeletingPlace(null);
    } catch (error) {
      console.error('Error deleting place:', error);
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
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // If we're editing an existing place, we would update it here
      // For now, we'll just add a new place
      
      // First add the place to the places table
      const newPlace = await addPlace(placeData);
      
      // Then link it to the user
      await addUserPlace(userId, newPlace.id, 'friends');
      
      // Refresh the places list
      const places = await getUserPlaces(userId);
      setUserPlaces(places);
      
      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding place:', error);
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
            userPlaces.map((userPlace) => (
              <PlaceCard key={userPlace.id} className="animate-fade-in">
                <PlaceType>{userPlace.places?.type}</PlaceType>
                <PlaceName>{userPlace.places?.name}</PlaceName>
                <PlaceLocation>
                  <FaMapMarkerAlt />
                  {userPlace.places?.lat?.toFixed(4)}, {userPlace.places?.lng?.toFixed(4)}
                </PlaceLocation>
                <ActionButtons>
                  <ActionButton onClick={() => handleEditPlace(userPlace.places!)}>
                    <FaEdit />
                  </ActionButton>
                  <DeleteButton onClick={() => handleDeletePlace(userPlace)}>
                    <FaTrash />
                  </DeleteButton>
                </ActionButtons>
              </PlaceCard>
            ))
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
          <p>Are you sure you want to delete "{deletingPlace?.places?.name}"?</p>
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