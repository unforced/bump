import React from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: 20px;
`;

const SettingsSection = styled.div`
  background-color: #f5f1e3; /* Sandstone beige */
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

const Settings: React.FC = () => {
  return (
    <SettingsContainer>
      <h1>Settings</h1>
      <p>Customize your Bump experience</p>
      
      <SettingsSection>
        <h2>Availability</h2>
        <p>Set your default availability times for notifications</p>
        <div>
          <label>Start Time: </label>
          <input type="time" defaultValue="09:00" />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>End Time: </label>
          <input type="time" defaultValue="17:00" />
        </div>
      </SettingsSection>
      
      <SettingsSection>
        <h2>Notifications</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>Do Not Disturb</p>
          <ToggleSwitch>
            <input type="checkbox" />
            <span></span>
          </ToggleSwitch>
        </div>
      </SettingsSection>
      
      <SaveButton>Save Settings</SaveButton>
    </SettingsContainer>
  );
};

export default Settings; 