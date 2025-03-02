import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.space[6]};
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
  text-align: center;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.md};
  max-width: 600px;
  margin: 0 auto;
`;

const SettingsSection = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[5]};
  margin-bottom: ${({ theme }) => theme.space[4]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  width: 100%;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.space[3]};
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -${({ theme }) => theme.space[2]};
    left: 0;
    width: 40px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.radii.full};
  }
`;

const SectionDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const TimeInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const ToggleLabel = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin: 0;
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
    background-color: ${({ theme }) => theme.colors.border};
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
    background-color: ${({ theme }) => theme.colors.primary};
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${({ theme }) => theme.space[3]};
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[3]};
  cursor: pointer;
  
  input {
    margin-right: ${({ theme }) => theme.space[3]};
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[6]};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const LogoutButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.error}dd;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Message = styled.div<{ $isError?: boolean }>`
  padding: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-align: center;
  background-color: ${({ theme, $isError }) => 
    $isError ? theme.colors.error + '20' : theme.colors.success + '20'};
  color: ${({ theme, $isError }) => 
    $isError ? theme.colors.error : theme.colors.success};
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary}40;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-right: ${({ theme }) => theme.space[3]};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const Email = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.space[6]};
  
  &:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid ${({ theme }) => theme.colors.border};
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
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
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Load settings when available
  useEffect(() => {
    if (settings) {
      setAvailabilityStart(settings.availability_start);
      setAvailabilityEnd(settings.availability_end);
      
      // Only update notifyFor if it hasn't been manually changed by the user
      // or if this is the initial load (loading is true)
      if (loading) {
        setNotifyFor(settings.notify_for);
      }
      
      setLoading(false);
    }
  }, [settings, loading]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setMessage('Error signing out. Please try again.');
      setIsError(true);
      
      setTimeout(() => {
        setMessage('');
        setIsError(false);
      }, 3000);
    }
  };
  
  // Handle Do Not Disturb toggle without resetting notification preferences
  const handleToggleDoNotDisturb = () => {
    toggleDoNotDisturb();
  };
  
  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setMessage('');
    setIsError(false);
    
    try {
      await updateNotificationSettings({
        availability_start: availabilityStart,
        availability_end: availabilityEnd,
        notify_for: notifyFor
      });
      
      setMessage('Settings saved successfully!');
      setIsError(false);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings. Please try again.');
      setIsError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };
  
  if (loading) {
    return (
      <PageContainer>
        <LoadingIndicator />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageDescription>
          Customize your Bump experience and notification preferences
        </PageDescription>
      </PageHeader>
      
      {message && (
        <Message $isError={isError}>
          {message}
        </Message>
      )}
      
      <SettingsSection
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <SectionTitle>Account</SectionTitle>
        <SectionDescription>
          Manage your account information
        </SectionDescription>
        
        {user && (
          <AccountInfo>
            <Avatar>{user.email?.charAt(0).toUpperCase() || '?'}</Avatar>
            <UserInfo>
              <Username>{user.user_metadata?.username || user.email?.split('@')[0] || 'User'}</Username>
              <Email>{user.email}</Email>
            </UserInfo>
          </AccountInfo>
        )}
      </SettingsSection>
      
      <SettingsSection
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <SectionTitle>Availability</SectionTitle>
        <SectionDescription>
          Set your default availability times for receiving notifications
        </SectionDescription>
        
        <FormGroup>
          <Label htmlFor="availabilityStart">Start Time</Label>
          <TimeInput
            id="availabilityStart"
            type="time"
            value={availabilityStart}
            onChange={(e) => setAvailabilityStart(e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="availabilityEnd">End Time</Label>
          <TimeInput
            id="availabilityEnd"
            type="time"
            value={availabilityEnd}
            onChange={(e) => setAvailabilityEnd(e.target.value)}
          />
        </FormGroup>
      </SettingsSection>
      
      <SettingsSection
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <SectionTitle>Notifications</SectionTitle>
        <SectionDescription>
          Control when and how you receive notifications
        </SectionDescription>
        
        <ToggleContainer>
          <ToggleLabel>Do Not Disturb</ToggleLabel>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={doNotDisturb}
              onChange={handleToggleDoNotDisturb}
            />
            <span></span>
          </ToggleSwitch>
        </ToggleContainer>
        
        <Label>Notify me for:</Label>
        <RadioGroup>
          <RadioOption>
            <input
              type="radio"
              name="notifyFor"
              value="all"
              checked={notifyFor === 'all'}
              onChange={() => setNotifyFor('all')}
            />
            All friend check-ins
          </RadioOption>
          
          <RadioOption>
            <input
              type="radio"
              name="notifyFor"
              value="intended"
              checked={notifyFor === 'intended'}
              onChange={() => setNotifyFor('intended')}
            />
            Only "Intend to Bump" friends
          </RadioOption>
          
          <RadioOption>
            <input
              type="radio"
              name="notifyFor"
              value="none"
              checked={notifyFor === 'none'}
              onChange={() => setNotifyFor('none')}
            />
            None (disable check-in notifications)
          </RadioOption>
        </RadioGroup>
      </SettingsSection>
      
      <ButtonGroup>
        <SaveButton 
          onClick={handleSaveSettings} 
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </SaveButton>
        
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </ButtonGroup>
    </PageContainer>
  );
};

export default Settings; 