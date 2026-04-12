# Profile Feature Flow

This document explains how the profile feature works across the frontend and backend.

## Frontend Entry Point

Main page:
- `Frontend/src/pages/user/profile/UserProfile.jsx`

Supporting components:
- `Frontend/src/components/profile/ProfileHeader.jsx`
- `Frontend/src/components/profile/ProfileMenu.jsx`
- `Frontend/src/components/profile/TrackList.jsx`
- `Frontend/src/components/ui/EditProfileModal.jsx`

Data hook:
- `Frontend/src/hooks/useProfile.jsx`

API service:
- `Frontend/src/services/profile.service.js`

## Page Responsibilities

### Initial fetch

When the profile page mounts:
- `getProfile()` is called from `useProfile`.
- Redux stores the returned `user` inside the profile slice.
- The page shows a skeleton until profile data is available.

### Local edit state

The page keeps local state for:
- `name`: current editable display name
- `profileImg`: current preview image shown in UI
- `profileFile`: pending uploaded file
- `isSaving`: modal save request state
- `isAvatarUploading`: avatar upload state from the main profile header

This lets the UI preview changes immediately before the server response returns.

### Avatar upload from the main page

Flow:
1. User clicks the avatar in `ProfileHeader`.
2. A hidden file input returns the selected file.
3. `UserProfile` creates a local object URL so the preview updates immediately.
4. The file is submitted with `FormData`.
5. The backend stores the image and returns the updated user.
6. Redux updates the profile slice with the latest saved user data.

### Edit Profile modal

Flow:
1. User opens the settings menu.
2. User clicks `Edit Profile`.
3. `EditProfileModal` receives the current editable values from `UserProfile`.
4. User changes name and/or image.
5. Save triggers the same shared submit path used by the main page upload.

## Backend Contract

Route:
- `PATCH /api/v1/users/my-profile`

Expected payload:
- `displayName`: string
- `profile`: file upload field name

Implementation:
- `Backend/src/routes/user.routes.js`
- `Backend/src/controllers/users.controller.js`

Important detail:
- The backend uses `upload.single("profile")`, so the frontend must send the avatar with the exact `profile` field name.

## Redux and Service Notes

Redux slice:
- `Frontend/src/redux/slices/profile.slice.jsx`

Service behavior:
- `profile.service.js` returns `res.data` directly.

Because of that:
- hooks should read `res.user` instead of assuming an axios response object.

## Recommended Maintenance Rules

- Keep form field names aligned with backend route expectations.
- If the backend contract changes, update both `profile.service.js` and `useProfile.jsx` together.
- Keep preview state local to the page, but keep persisted profile data in Redux.
- Use the loading skeleton for fetch states and upload spinners for user-triggered actions.