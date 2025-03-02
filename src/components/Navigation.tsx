import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background-color: ${props => props.theme.colors.primary};
  padding: 12px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: ${props => props.theme.shadows.md};
  z-index: ${props => props.theme.zIndices.sticky};
  transition: transform 0.3s ease;
  
  @media (min-width: 768px) {
    max-width: 600px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${props => props.theme.radii.xl} ${props => props.theme.radii.xl} 0 0;
  }
`;

const NavList = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const NavItem = styled.li`
  text-align: center;
  flex: 1;
  display: flex;
  justify-content: center;
`;

const StyledNavLink = styled(NavLink)`
  color: ${props => props.theme.colors.secondary};
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: ${props => props.theme.fontSizes.xs};
  width: 100%;
  transition: all 0.3s ease;
  
  &.active {
    color: ${props => props.theme.colors.white};
    font-weight: ${props => props.theme.fontWeights.bold};
    transform: translateY(-5px);
  }
  
  &:hover {
    color: ${props => props.theme.colors.white};
  }
  
  svg {
    margin-bottom: 4px;
    font-size: 1.25rem;
    transition: transform 0.3s ease;
  }
  
  &.active svg {
    transform: scale(1.2);
  }
  
  &:hover svg {
    transform: scale(1.1);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  
  .active & {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Navigation: React.FC = () => {
  return (
    <NavContainer className="slide-up">
      <NavList>
        <NavItem>
          <StyledNavLink to="/" end>
            <IconWrapper>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </IconWrapper>
            Home
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/places">
            <IconWrapper>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </IconWrapper>
            Places
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/friends">
            <IconWrapper>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </IconWrapper>
            Friends
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/meetups">
            <IconWrapper>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </IconWrapper>
            Meetups
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/settings">
            <IconWrapper>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </IconWrapper>
            Settings
          </StyledNavLink>
        </NavItem>
      </NavList>
    </NavContainer>
  );
};

export default Navigation; 