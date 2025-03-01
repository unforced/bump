import React from 'react';
import styled from 'styled-components';

const MeetupsContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MeetupsList = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
`;

const MeetupCard = styled.div`
  background-color: #f5f1e3; /* Sandstone beige */
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const LogMeetupButton = styled.button`
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

const Meetups: React.FC = () => {
  return (
    <MeetupsContainer>
      <h1>Meetups</h1>
      <p>Log and track your spontaneous encounters</p>
      
      <MeetupsList>
        <MeetupCard>
          <h3>No meetups yet</h3>
          <p>Log your first meetup when you bump into a friend!</p>
        </MeetupCard>
      </MeetupsList>
      
      <LogMeetupButton>Log Meetup</LogMeetupButton>
    </MeetupsContainer>
  );
};

export default Meetups; 