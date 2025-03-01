import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--background-color);
`;

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <LoadingContainer>
        <p>Loading...</p>
      </LoadingContainer>
    );
  }
  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 