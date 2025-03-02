import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
  gap: 1rem;
`;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <LoadingContainer>
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </LoadingContainer>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 