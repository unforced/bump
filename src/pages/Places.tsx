import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getUserPlaces, addPlace, addUserPlace, getCurrentUser } from '../services/supabase';
import { Place, UserPlace } from '../types';
import PlaceForm from '../components/PlaceForm';
import Modal from '../components/Modal';
import { FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';

const PlacesContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const PlacesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
`;

const PlaceCard = styled.div`
  background-color: #f5f1e3; /* Sandstone beige */
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const PlaceType = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #4a7c59;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  text-transform: capitalize;
`;

const PlaceName = styled.h3`
  margin-top: 0;
  margin-bottom: 8px;
  color: #333;
`;

const PlaceLocation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #666;
  margin-bottom: 12px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #4a7c59;
  font-size: 18px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #3a6a49;
    transform: scale(1.1);
  }
`;

const AddPlaceButton = styled.button`
  background-color: #4a7c59; /* Forest green */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3a6a49;
    transform: scale(1.05);
  }
`;

const EmptyState = styled.div`
  padding: 30px;
  background-color: #f5f1e3;
  border-radius: 12px;
  text-align: center;
  width: 100%;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a7c59;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Places: React.FC = () => {
  const [userPlaces, setUserPlaces] = useState<UserPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlace(null);
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

  return (
    <PlacesContainer>
      <h1>Gathering Places</h1>
      <p>Your favorite spots to hang out</p>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <PlacesList>
          {userPlaces.length === 0 ? (
            <EmptyState>
              <h3>Add your first place</h3>
              <p>Start by adding your favorite cafes, parks, or hangout spots.</p>
            </EmptyState>
          ) : (
            userPlaces.map((userPlace) => (
              <PlaceCard key={userPlace.id}>
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
                  {/* Delete functionality would be added here */}
                </ActionButtons>
              </PlaceCard>
            ))
          )}
        </PlacesList>
      )}
      
      <AddPlaceButton onClick={handleAddPlace}>Add Place</AddPlaceButton>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <PlaceForm
          initialPlace={editingPlace || undefined}
          onSubmit={handleSubmitPlace}
          onCancel={handleCloseModal}
        />
      </Modal>
    </PlacesContainer>
  );
};

export default Places; 