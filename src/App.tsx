import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Layout from './components/Layout';

// Lazy load pages to reduce initial bundle size
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Places = lazy(() => import('./pages/Places'));
const Friends = lazy(() => import('./pages/Friends'));
const FriendProfile = lazy(() => import('./pages/FriendProfile'));
const Meetups = lazy(() => import('./pages/Meetups'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="app">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Layout>
                        <Home />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/places" element={
                    <ProtectedRoute>
                      <Layout>
                        <Places />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/friends" element={
                    <ProtectedRoute>
                      <Layout>
                        <Friends />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/friends/:id" element={
                    <ProtectedRoute>
                      <Layout>
                        <FriendProfile />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/meetups" element={
                    <ProtectedRoute>
                      <Layout>
                        <Meetups />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
              <Navigation />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
