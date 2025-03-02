import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';
import Places from './pages/Places';
import Friends from './pages/Friends';
import Meetups from './pages/Meetups';
import Settings from './pages/Settings';
import Login from './pages/Login';
import FriendProfile from './pages/FriendProfile';
import Navigation from './components/Navigation';
import NotificationBell from './components/NotificationBell';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

const AppContainer = styled.div`
  font-family: 'Inter', sans-serif;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
  padding-bottom: 70px; /* Space for the navigation bar */
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow-x: hidden;
  position: relative; /* Ensure proper positioning context */
  
  @media (min-width: 768px) {
    max-width: 600px;
    margin: 0 auto;
    box-shadow: ${props => props.theme.shadows.lg};
    min-height: 100vh;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  padding: 16px;
`;

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <AppContainer className="fade-in">
    <Header>
      <NotificationBell />
    </Header>
    {children}
    <Navigation />
  </AppContainer>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                } />
                <Route path="/places" element={
                  <MainLayout>
                    <Places />
                  </MainLayout>
                } />
                <Route path="/friends" element={
                  <MainLayout>
                    <Friends />
                  </MainLayout>
                } />
                <Route path="/friends/:friendId" element={
                  <MainLayout>
                    <FriendProfile />
                  </MainLayout>
                } />
                <Route path="/meetups" element={
                  <MainLayout>
                    <Meetups />
                  </MainLayout>
                } />
                <Route path="/settings" element={
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                } />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
