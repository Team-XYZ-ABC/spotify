# Feature Guide

This document gives developers a quick map of the main features in the repository and where the implementation lives.

## Frontend Features

### Authentication

- Pages: `Frontend/src/pages/auth/`
- Hooks: `Frontend/src/hooks/useAuth.jsx`
- State: `Frontend/src/redux/slices/auth.slice.jsx`
- Routes: `/login`, `/register`, `/register/step-1`, `/register/phoneRegister`, `/register/verify-otp`

What it does:
- Handles login, email verification, OTP verification, and registration.
- Protects private routes through `Frontend/src/guards/AuthRoute.jsx`.

### Home

- Page: `Frontend/src/pages/home/Home.jsx`
- Route: `/`

What it does:
- Serves as the main landing page after authentication.
- Renders inside `MainLayout`.

### Playlist

- Page: `Frontend/src/pages/Playlist/Playlist`
- Components: `Frontend/src/components/Playlist/`
- Route: `/playlist`

What it does:
- Displays playlist metadata, controls, and track lists.

### User Profile

- Page: `Frontend/src/pages/user/profile/UserProfile.jsx`
- Components: `Frontend/src/components/profile/`
- Hook: `Frontend/src/hooks/useProfile.jsx`
- Service: `Frontend/src/services/profile.service.js`
- Route: `/profile`

What it does:
- Fetches the logged-in user profile.
- Supports editing display name and avatar.
- Shows a loading skeleton while profile data is being fetched.

Detailed flow:
- See `docs/profile-feature.md`.

### Analytics

- Page: `Frontend/src/pages/user/Artist/Analytics`
- Layout: `Frontend/src/layouts/DashboardLayout.jsx`
- Route: `/analytics`

What it does:
- Provides dashboard-style analytics for artist users.

### Common Layout and Routing

- App shell: `Frontend/src/App.jsx`
- Router: `Frontend/src/routes/index.jsx`
- Layouts: `Frontend/src/layouts/`

What it does:
- Splits the app into public, authenticated, auth-only, and dashboard sections.
- Uses React lazy loading and suspense for route-level code splitting.

## Backend Features

### Auth API

- Routes: `Backend/src/routes/auth.routes.js`
- Controller: `Backend/src/controllers/auth.controller.js`

What it does:
- Handles authentication, registration, and token/session-related actions.

### User Profile API

- Routes: `Backend/src/routes/user.routes.js`
- Controller: `Backend/src/controllers/users.controller.js`
- Upload middleware: `Backend/src/middlewares/multer.js`
- Image upload service: `Backend/src/services/imagekit.service.js`

What it does:
- Returns the current authenticated user profile.
- Updates display name, bio, and avatar using multipart form data.

### Artist, Album, Track, Playlist, Follow, Library, Search, Player, Recommendations, Admin

- Routes: `Backend/src/routes/`
- Controllers: `Backend/src/controllers/`

What they do:
- These modules are split by feature and exposed through `Backend/src/routes/index.route.js`.
- Each route file maps requests to its matching controller.

## Development Notes

- Frontend services usually return `res.data`, not the raw axios response.
- Profile avatar updates must use multipart form data with the `profile` field name.
- Protected frontend routes are wrapped in `AuthRoute`.