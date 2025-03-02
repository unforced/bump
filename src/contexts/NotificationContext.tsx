import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserSettings, updateSettings } from '../services/supabase';
import { Settings } from '../types';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'check-in' | 'friend-request' | 'system';
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: Settings | null;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  updateNotificationSettings: (settings: Partial<Settings>) => Promise<void>;
  doNotDisturb: boolean;
  toggleDoNotDisturb: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  // Get user settings on mount and when user changes
  useEffect(() => {
    if (user) {
      const fetchSettings = async () => {
        try {
          const userSettings = await getUserSettings(user.id);
          setSettings(userSettings);
          setDoNotDisturb(userSettings.do_not_disturb);
        } catch (error) {
          console.error('Error fetching user settings:', error);
        }
      };
      
      fetchSettings();
    }
  }, [user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    console.log('Adding notification:', notification);
    
    // Don't add notifications if Do Not Disturb is on
    if (doNotDisturb) {
      console.log('Do Not Disturb is on, not adding notification');
      return;
    }
    
    // TEMPORARILY DISABLED FOR TESTING
    // Don't add notifications if outside availability hours
    /*
    if (settings) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      const [startHour, startMinute] = settings.availability_start.split(':').map(Number);
      const [endHour, endMinute] = settings.availability_end.split(':').map(Number);
      
      const currentTime = currentHour * 60 + currentMinute;
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      
      const isWithinAvailability = currentTime >= startTime && currentTime <= endTime;
      
      console.log('Availability check:', { 
        currentTime, 
        startTime, 
        endTime, 
        isWithinAvailability,
        availabilityStart: settings.availability_start,
        availabilityEnd: settings.availability_end
      });
      
      if (!isWithinAvailability) {
        console.log('Outside availability hours, not adding notification');
        return;
      }
    }
    */
    
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      read: false
    };
    
    console.log('Adding new notification to state:', newNotification);
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      console.log('Updated notifications:', updated);
      return updated;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateNotificationSettings = async (newSettings: Partial<Settings>) => {
    if (!user || !settings) return;
    
    try {
      await updateSettings(user.id, newSettings);
      setSettings({ ...settings, ...newSettings });
      
      if (newSettings.do_not_disturb !== undefined) {
        setDoNotDisturb(newSettings.do_not_disturb);
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  };

  const toggleDoNotDisturb = async () => {
    if (!user || !settings) return;
    
    const newDoNotDisturb = !doNotDisturb;
    try {
      await updateSettings(user.id, { do_not_disturb: newDoNotDisturb });
      setDoNotDisturb(newDoNotDisturb);
      setSettings({ ...settings, do_not_disturb: newDoNotDisturb });
    } catch (error) {
      console.error('Error toggling Do Not Disturb:', error);
      throw error;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    updateNotificationSettings,
    doNotDisturb,
    toggleDoNotDisturb
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 