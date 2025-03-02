import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const SettingsContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const SettingsSection = styled.div`
  background-color: #f5f1e3; /* Sandstone beige */
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: #4a7c59;
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const SaveButton = styled.button`
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

const LogoutButton = styled.button`
  background-color: #e74c3c; /* Red */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #c0392b;
    transform: scale(1.05);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
  
  label {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    
    input {
      margin-right: 8px;
    }
  }
`;

const Settings: React.FC = () => {
  const { signOut, user } = useAuth();
  const { settings, updateNotificationSettings, doNotDisturb, toggleDoNotDisturb } = useNotifications();
  const navigate = useNavigate();
  
  const [availabilityStart, setAvailabilityStart] = useState('09:00');
  const [availabilityEnd, setAvailabilityEnd] = useState('17:00');
  const [notifyFor, setNotifyFor] = useState<'all' | 'intended' | 'none'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Load settings when available
  useEffect(() => {
    if (settings) {
      setAvailabilityStart(settings.availability_start);
      setAvailabilityEnd(settings.availability_end);
      setNotifyFor(settings.notify_for);
    }
  }, [settings]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      await updateNotificationSettings({
        availability_start: availabilityStart,
        availability_end: availabilityEnd,
        notify_for: notifyFor
      });
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <SettingsContainer>
      <h1>Settings</h1>
      <p>Customize your Bump experience</p>
      
      {user && (
        <SettingsSection>
          <h2>Account</h2>
          <p>Logged in as: {user.email}</p>
        </SettingsSection>
      )}
      
      <SettingsSection>
        <h2>Availability</h2>
        <p>Set your default availability times for notifications</p>
        <div>
          <label>Start Time: </label>
          <input 
            type="time" 
            value={availabilityStart}
            onChange={(e) => setAvailabilityStart(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>End Time: </label>
          <input 
            type="time" 
            value={availabilityEnd}
            onChange={(e) => setAvailabilityEnd(e.target.value)}
          />
        </div>
      </SettingsSection>
      
      <SettingsSection>
        <h2>Notifications</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <p>Do Not Disturb</p>
          <ToggleSwitch>
            <input 
              type="checkbox" 
              checked={doNotDisturb}
              onChange={toggleDoNotDisturb}
            />
            <span></span>
          </ToggleSwitch>
        </div>
        
        <div style={{ textAlign: 'left' }}>
          <p>Notify me for:</p>
          <RadioGroup>
            <label>
              <input 
                type="radio" 
                name="notifyFor" 
                value="all" 
                checked={notifyFor === 'all'}
                onChange={() => setNotifyFor('all')}
              />
              All friend check-ins
            </label>
            <label>
              <input 
                type="radio" 
                name="notifyFor" 
                value="intended" 
                checked={notifyFor === 'intended'}
                onChange={() => setNotifyFor('intended')}
              />
              Only "Intend to Bump" friends
            </label>
            <label>
              <input 
                type="radio" 
                name="notifyFor" 
                value="none" 
                checked={notifyFor === 'none'}
                onChange={() => setNotifyFor('none')}
              />
              None (disable check-in notifications)
            </label>
          </RadioGroup>
        </div>
      </SettingsSection>
      
      {saveMessage && (
        <p style={{ color: saveMessage.includes('Error') ? '#e74c3c' : '#4a7c59' }}>
          {saveMessage}
        </p>
      )}
      
      <ButtonGroup>
        <SaveButton onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </SaveButton>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </ButtonGroup>
    </SettingsContainer>
  );
};

export default Settings; 