export interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
}

export interface Place {
  id: string;
  name: string;
  type: string;
  google_place_id?: string;
  lat?: number;
  lng?: number;
}

export interface UserPlace {
  id: string;
  user_id: string;
  place_id: string;
  visibility: 'public' | 'friends' | 'private';
  places?: Place;
}

export interface Status {
  id: string;
  user_id: string;
  place_id: string;
  activity: string;
  privacy: 'all' | 'intended' | 'specific';
  timestamp: string;
  is_active: boolean;
  users?: User;
  places?: Place;
}

export interface Meetup {
  id: string;
  user_id: string;
  friend_name: string;
  place_id: string;
  timestamp: string;
  was_intentional: boolean;
  places?: Place;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  intend_to_bump: 'off' | 'private' | 'shared';
  friend?: User;
}

export interface Settings {
  id: string;
  user_id: string;
  availability_start: string;
  availability_end: string;
  notify_for: 'all' | 'intended' | 'none';
  do_not_disturb: boolean;
} 