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
    // Don't add notifications if Do Not Disturb is on
    if (doNotDisturb) {
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
      
      if (!isWithinAvailability) {
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
    
    setNotifications(prev => [newNotification, ...prev]);
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