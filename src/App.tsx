import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';
import Places from './pages/Places';
import Friends from './pages/Friends';
import Meetups from './pages/Meetups';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import './App.css';

const AppContainer = styled.div`
  font-family: 'Inter', sans-serif;
  color: #333;
  background-color: #f9f7f2;
  min-height: 100vh;
  padding-bottom: 70px; /* Space for the navigation bar */
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/meetups" element={<Meetups />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <Navigation />
      </AppContainer>
    </Router>
  );
}

export default App;
