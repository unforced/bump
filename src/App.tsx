import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';
import Places from './pages/Places';
import Friends from './pages/Friends';
import Meetups from './pages/Meetups';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

const AppContainer = styled.div`
  font-family: 'Inter', sans-serif;
  color: #333;
  background-color: #f9f7f2;
  min-height: 100vh;
  padding-bottom: 70px; /* Space for the navigation bar */
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (min-width: 768px) {
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    min-height: 100vh;
  }
`;

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <AppContainer>
    {children}
    <Navigation />
  </AppContainer>
);

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
