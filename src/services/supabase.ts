import { createClient } from '@supabase/supabase-js';
import { Place } from '../types';

// These would typically come from environment variables
// For the MVP, we'll use import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY';

// Create a single supabase client for interacting with your database
// Adding specific options for WebSocket connections
export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// User related functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users_view')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Places related functions
export const getPlaces = async () => {
  const { data, error } = await supabase
    .from('places')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const addPlace = async (placeData: Omit<Place, 'id'>) => {
  const { data, error } = await supabase
    .from('places')
    .insert([placeData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserPlaces = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_places')
    .select(`
      *,
      places:place_id(*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
};

export const addUserPlace = async (userId: string, placeId: string, visibility: string) => {
  const { data, error } = await supabase
    .from('user_places')
    .insert([
      { user_id: userId, place_id: placeId, visibility }
    ]);
  
  if (error) throw error;
  return data;
};

// Status related functions
export const getActiveStatuses = async () => {
  const { data, error } = await supabase
    .from('statuses')
    .select(`
      *,
      places:place_id(*)
    `)
    .eq('is_active', true);
  
  if (error) throw error;
  
  // Manually fetch user data for each status
  if (data && data.length > 0) {
    const userIds = [...new Set(data.map(status => status.user_id))];
    const { data: userData, error: userError } = await supabase
      .from('users_view')
      .select('*')
      .in('id', userIds);
    
    if (userError) throw userError;
    
    // Attach user data to each status
    return data.map(status => ({
      ...status,
      users_view: userData?.find(user => user.id === status.user_id)
    }));
  }
  
  return data;
};

export const checkIn = async (userId: string, placeId: string, activity: string, privacy: string) => {
  // First, deactivate any existing active statuses for this user
  await supabase
    .from('statuses')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true);
  
  // Then create a new status
  const { data, error } = await supabase
    .from('statuses')
    .insert([
      { 
        user_id: userId, 
        place_id: placeId, 
        activity, 
        privacy,
        is_active: true 
      }
    ]);
  
  if (error) throw error;
  return data;
};

export const checkOut = async (statusId: string) => {
  const { data, error } = await supabase
    .from('statuses')
    .update({ is_active: false })
    .eq('id', statusId);
  
  if (error) throw error;
  return data;
};

// Friends related functions
export const getFriends = async (userId: string) => {
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  // Manually fetch user data for each friend
  if (data && data.length > 0) {
    const friendIds = data.map(friend => friend.friend_id);
    const { data: userData, error: userError } = await supabase
      .from('users_view')
      .select('*')
      .in('id', friendIds);
    
    if (userError) throw userError;
    
    // Attach user data to each friend
    return data.map(friend => ({
      ...friend,
      users_view: userData?.find(user => user.id === friend.friend_id)
    }));
  }
  
  return data;
};

export const addFriend = async (userId: string, friendId: string, intendToBump: string = 'off') => {
  const { data, error } = await supabase
    .from('friends')
    .insert([
      { user_id: userId, friend_id: friendId, intend_to_bump: intendToBump }
    ]);
  
  if (error) throw error;
  return data;
};

export const findUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users_view')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateIntendToBump = async (friendshipId: string, intendToBump: string) => {
  const { data, error } = await supabase
    .from('friends')
    .update({ intend_to_bump: intendToBump })
    .eq('id', friendshipId);
  
  if (error) throw error;
  return data;
};

// Meetups related functions
export const getMeetups = async (userId: string) => {
  const { data, error } = await supabase
    .from('meetups')
    .select(`
      *,
      places:place_id(*)
    `)
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const logMeetup = async (userId: string, friendName: string, placeId: string, wasIntentional: boolean) => {
  const { data, error } = await supabase
    .from('meetups')
    .insert([
      { 
        user_id: userId, 
        friend_name: friendName, 
        place_id: placeId, 
        was_intentional: wasIntentional,
        timestamp: new Date()
      }
    ]);
  
  if (error) throw error;
  return data;
};

// Settings related functions
export const getUserSettings = async (userId: string) => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned" error
  
  if (!data) {
    // Create default settings if none exist
    return createDefaultSettings(userId);
  }
  
  return data;
};

export const createDefaultSettings = async (userId: string) => {
  const defaultSettings = {
    user_id: userId,
    availability_start: '09:00',
    availability_end: '17:00',
    notify_for: 'all', // all, intended, none
    do_not_disturb: false
  };
  
  const { data, error } = await supabase
    .from('settings')
    .insert([defaultSettings])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateSettings = async (userId: string, settings: any) => {
  const { data, error } = await supabase
    .from('settings')
    .update(settings)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}; 