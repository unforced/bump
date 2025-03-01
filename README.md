# Bump

Bump is an app crafted to enhance spontaneous in-person connections by helping users bump into friends at their favorite gathering spots. It enables sharing of hangout locations, real-time status updates, and logging of serendipitous meetups.

## Features

- **Gathering Places**: List your favorite spots tied to Google Maps
- **Real-Time Status**: Check in with an activity and privacy settings
- **Friends & Intend to Bump**: Add friends with "Intend to Bump" settings
- **Meetups**: Log encounters and view history
- **Notifications & Settings**: Customize your availability and notification preferences

## Tech Stack

- **Frontend**: React/Vite with TypeScript
- **Styling**: styled-components
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Maps**: Google Maps API

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account

### Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd bump
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a Supabase project:
   - Go to [Supabase](https://supabase.com/) and create a new project
   - Note your project URL and anon key

4. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the values with your Supabase credentials:
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

5. Run the migrations:
   - In the Supabase dashboard, go to the SQL Editor
   - Copy the contents of `supabase/migrations/00001_initial_schema.sql` and run it
   - Copy the contents of `supabase/migrations/00002_seed_data.sql` and run it

6. Start the development server:
   ```
   npm run dev
   ```

7. Open [http://localhost:5173](http://localhost:5173) in your browser

## Development

### Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components for each route
- `src/services`: Service functions for API calls
- `src/types`: TypeScript type definitions
- `supabase/migrations`: SQL migrations for Supabase

### Supabase Setup

The app uses Supabase for authentication, database, and real-time subscriptions. The database schema includes:

- `users`: Handled by Supabase Auth
- `places`: Gathering spots with Google Maps integration
- `user_places`: Links users to their favorite places
- `statuses`: Check-ins with privacy settings
- `meetups`: Logged encounters
- `friends`: Friend relationships with "Intend to Bump" settings
- `settings`: User preferences for notifications and availability

## License

[MIT](LICENSE)
