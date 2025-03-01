-- Seed data for Bump app

-- Insert sample places
INSERT INTO places (id, name, type, google_place_id, lat, lng)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'MycoCafe', 'cafe', 'google_place_id_1', 40.0150, -105.2705),
  ('00000000-0000-0000-0000-000000000002', 'North Boulder Park', 'park', 'google_place_id_2', 40.0369, -105.2811),
  ('00000000-0000-0000-0000-000000000003', 'Tonic Coworking', 'coworking', 'google_place_id_3', 40.0176, -105.2797),
  ('00000000-0000-0000-0000-000000000004', 'Boulder Creek Path', 'outdoors', 'google_place_id_4', 40.0138, -105.2780);

-- Note: User data will be created through the auth system when users sign up
-- The following seed data assumes these users exist and should be adjusted in a real deployment

-- Sample user_places data (to be adjusted with real user IDs)
-- INSERT INTO user_places (user_id, place_id, visibility)
-- VALUES 
--   ('user_id_1', '00000000-0000-0000-0000-000000000001', 'friends'),
--   ('user_id_1', '00000000-0000-0000-0000-000000000002', 'public'),
--   ('user_id_2', '00000000-0000-0000-0000-000000000001', 'friends'),
--   ('user_id_2', '00000000-0000-0000-0000-000000000003', 'public');

-- Sample statuses data (to be adjusted with real user IDs)
-- INSERT INTO statuses (user_id, place_id, activity, privacy, is_active)
-- VALUES 
--   ('user_id_1', '00000000-0000-0000-0000-000000000001', 'Working on my laptop', 'all', true),
--   ('user_id_2', '00000000-0000-0000-0000-000000000001', 'Having a coffee meeting', 'all', true),
--   ('user_id_3', '00000000-0000-0000-0000-000000000002', 'Playing frisbee', 'all', true);

-- Sample friends data (to be adjusted with real user IDs)
-- INSERT INTO friends (user_id, friend_id, intend_to_bump)
-- VALUES 
--   ('user_id_1', 'user_id_2', 'shared'),
--   ('user_id_2', 'user_id_1', 'shared'),
--   ('user_id_1', 'user_id_3', 'private'),
--   ('user_id_3', 'user_id_1', 'off');

-- Sample meetups data (to be adjusted with real user IDs)
-- INSERT INTO meetups (user_id, friend_name, place_id, was_intentional)
-- VALUES 
--   ('user_id_1', 'Alex', '00000000-0000-0000-0000-000000000001', false),
--   ('user_id_1', 'Jamie', '00000000-0000-0000-0000-000000000002', true);

-- Sample settings data (to be adjusted with real user IDs)
-- INSERT INTO settings (user_id, availability_start, availability_end, notify_for, do_not_disturb)
-- VALUES 
--   ('user_id_1', '09:00', '17:00', 'all', false),
--   ('user_id_2', '10:00', '18:00', 'intended', false),
--   ('user_id_3', '08:00', '16:00', 'none', true); 