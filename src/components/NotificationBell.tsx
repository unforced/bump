import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNotifications } from '../contexts/NotificationContext';

const BellContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const Bell = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a7c59;
  font-size: 24px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const NotificationDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 40px;
  right: 0;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
`;

const NotificationTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #4a7c59;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const NotificationList = styled.div`
  padding: 0;
`;

const NotificationItem = styled.div<{ $isRead: boolean }>`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background-color: ${props => props.$isRead ? 'white' : '#f5f9f7'};
  cursor: pointer;
  
  &:hover {
    background-color: #f0f5f2;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationMessage = styled.p`
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
`;

const NotificationTime = styled.span`
  font-size: 12px;
  color: #999;
`;

const EmptyNotification = styled.div`
  padding: 16px;
  text-align: center;
  color: #999;
`;

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };
  
  const handleItemClick = (id: string) => {
    markAsRead(id);
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <BellContainer ref={dropdownRef}>
      <Bell onClick={toggleDropdown}>
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <Badge>{unreadCount > 9 ? '9+' : unreadCount}</Badge>}
      </Bell>
      
      <NotificationDropdown $isOpen={isOpen}>
        <NotificationHeader>
          <NotificationTitle>Notifications</NotificationTitle>
          {notifications.length > 0 && (
            <ClearButton onClick={clearNotifications}>Clear all</ClearButton>
          )}
        </NotificationHeader>
        
        <NotificationList>
          {notifications.length === 0 ? (
            <EmptyNotification>No notifications</EmptyNotification>
          ) : (
            notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                $isRead={notification.read}
                onClick={() => handleItemClick(notification.id)}
              >
                <NotificationContent>
                  <NotificationMessage>{notification.message}</NotificationMessage>
                  <NotificationTime>{formatTime(notification.timestamp)}</NotificationTime>
                </NotificationContent>
              </NotificationItem>
            ))
          )}
        </NotificationList>
      </NotificationDropdown>
    </BellContainer>
  );
};

export default NotificationBell; 