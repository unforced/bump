# Bump

Bump is an app crafted to enhance spontaneous in-person connections by helping users bump into friends at their favorite gathering spots. It enables sharing of hangout locations, real-time status updates, and logging of serendipitous meetups.

## Features

- **Gathering Places**: List your favorite spots tied to Google Maps with map view and list view options
- **Real-Time Status**: Check in with an activity and customizable privacy settings
- **Friends & Intend to Bump**: Add friends with "Intend to Bump" settings (off/private/shared)
- **Meetups**: Log encounters, view history, and see detailed statistics
- **Notifications & Settings**: Customize your availability and notification preferences with "Do Not Disturb" mode

## Tech Stack

- **Frontend**: React/Vite with TypeScript
- **Styling**: styled-components with a comprehensive theming system
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Maps**: Google Maps API with location autocomplete
- **Animations**: Framer Motion for smooth transitions
- **PWA**: Workbox for service worker and offline capabilities
- **CI/CD**: GitHub Actions for testing and Vercel for deployment

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account
- Google Maps API key

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
   - Update the values with your Supabase credentials and Google Maps API key:
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
     ```

5. Set up the Supabase CLI (optional, for local development):
   ```
   npm install -g supabase
   supabase init
   supabase start
   ```

6. Run the migrations:
   ```
   supabase db push
   ```
   
   Alternatively, in the Supabase dashboard:
   - Go to the SQL Editor
   - Copy the contents of `supabase/migrations/00001_initial_schema.sql` and run it
   - Copy the contents of `supabase/migrations/00002_seed_data.sql` and run it

7. Start the development server:
   ```
   npm run dev
   ```

8. Open [http://localhost:5173](http://localhost:5173) in your browser

## Development

### Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components for each route
- `src/contexts`: React contexts for state management
- `src/services`: Service functions for API calls
- `src/types`: TypeScript type definitions
- `src/theme`: Theme configuration and styled-components setup
- `src/utils`: Utility functions
- `supabase/migrations`: SQL migrations for Supabase

### Theming System

The app uses a comprehensive theming system with styled-components:

- Consistent colors, typography, spacing, and animations
- TypeScript interfaces for type safety
- Transient props for clean DOM rendering

### CI/CD Pipeline

The project uses GitHub Actions for continuous integration:

- Automated testing and building on pull requests and pushes to main
- Supabase migrations deployment to staging (develop branch) and production (main branch)
- Vercel integration for frontend deployment

### Supabase Setup

The app uses Supabase for authentication, database, and real-time subscriptions. The database schema includes:

- `users`: Handled by Supabase Auth
- `places`: Gathering spots with Google Maps integration
- `user_places`: Links users to their favorite places
- `statuses`: Check-ins with privacy settings
- `meetups`: Logged encounters
- `friends`: Friend relationships with "Intend to Bump" settings
- `settings`: User preferences for notifications and availability

### PWA Support

The app is configured as a Progressive Web App:

- Service worker registration with Workbox
- Manifest file for home screen installation
- Offline capabilities
- Mobile-friendly design

## Deployment

The app is deployed using Vercel's GitHub integration:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel
3. Deploy automatically on push to main

Database migrations are deployed using GitHub Actions:

1. Staging environment: Triggered on push to develop branch
2. Production environment: Triggered on push to main branch

## License

[MIT](LICENSE)
