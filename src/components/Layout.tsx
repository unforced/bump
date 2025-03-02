import React from 'react';
import styled from 'styled-components';

interface LayoutProps {
  children: React.ReactNode;
}

const MainContainer = styled.main`
  padding: 1rem;
  padding-bottom: 5rem; /* Space for the navigation bar */
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <MainContainer>
      {children}
    </MainContainer>
  );
};

export default Layout; 