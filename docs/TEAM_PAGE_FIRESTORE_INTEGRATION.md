# Team Page Firestore Integration

## Overview
This documentation explains how the Team page fetches and displays core member profiles from Firestore, including their uploaded profile images from Cloudinary.

## Implementation Flow

### 1. Profile Update Flow (CoreMemberProfile)
1. **User uploads image** → Selected file is validated
2. **Image preview** → Shows before saving
3. **Save profile** → 
   - Uploads image to Cloudinary (`csi-profiles` folder)
   - Gets Cloudinary URL
   - Saves all profile data + image URL to Firestore
   - Updates local state

### 2. Team Page Data Flow
1. **Page loads** → Fetches core members from Firestore
2. **Permission handling** → 
   - First tries to fetch with `where('role', '==', 'coreMember')` query
   - If permission fails, fetches all users and filters client-side
   - Falls back to static JSON data if Firestore fails
3. **Data transformation** → Converts Firestore data to team member format
4. **Display** → Shows members with their Cloudinary-hosted images

## Key Components

### Services

#### `profileService.js`
- `uploadProfileImage()` - Uploads to Cloudinary and stores URL
- `updateProfileWithImage()` - Combines upload and Firestore update
- `validateProfileData()` - Validates form data

#### `teamService.js`
- `fetchCoreMembers()` - Fetches from Firestore with fallback
- `sortMembersByRole()` - Sorts by role hierarchy
- `transformUserToTeamMember()` - Formats data for display

### Components

#### `CoreMemberProfile.jsx`
- Profile editing interface
- Image upload handling
- Form validation
- Firestore update

#### `Team-new.jsx`
- Fetches team data on mount
- Loading/error states
- Refresh functionality
- Fallback to static data

#### `ProfileAvatar.jsx`
- Image selection UI
- File validation
- Preview display
- Upload progress

## Firestore Structure

### User Document
```javascript
{
  uid: "user_id",
  email: "user@email.com",
  name: "User Name",
  photoURL: "https://res.cloudinary.com/...", // Cloudinary URL
  role: "coreMember",
  isCoreMember: true,
  roleDetails: {
    position: "Technical Lead",
    permissions: ["manage_events", "manage_members"],
    level: "executive"
  },
  profile: {
    phone: "1234567890",
    bio: "About me...",
    branch: "Computer Science",
    year: "3rd Year",
    skills: ["React", "Node.js"],
    linkedin: "https://linkedin.com/in/user",
    github: "https://github.com/user",
    imageHistory: [{
      url: "cloudinary_url",
      publicId: "public_id",
      uploadedAt: "2024-01-01T00:00:00Z",
      format: "jpg",
      size: 123456
    }],
    updatedAt: serverTimestamp()
  }
}
```

## Security Rules

### Firestore Rules for Users Collection
```javascript
match /users/{userId} {
  // Public read for core members (team page)
  allow read: if resource.data.role == 'coreMember' || 
                 resource.data.isCoreMember == true ||
                 isOwner(userId) || 
                 isAdmin();
  
  // Only owners can update their profile
  allow update: if isOwner(userId) || isAdmin();
}
```

## Error Handling

### Permission Errors
- If Firestore query fails due to permissions, tries alternative approach
- Falls back to fetching all users and filtering client-side
- Ultimate fallback to static JSON data

### Upload Errors
- Validates file type (JPEG, PNG, WebP)
- Validates file size (max 5MB)
- Shows specific error messages
- Continues with profile save even if image upload fails

### Network Errors
- Displays error state with retry button
- Shows cached data when available
- Toast notifications for user feedback

## Features

### Real-time Sync
- Team page automatically shows updated profiles
- Refresh button to manually fetch latest data
- Loading states during data fetch

### Image Management
- Images stored in Cloudinary `csi-profiles` folder
- Image history tracked in Firestore
- Automatic image optimization by Cloudinary

### Fallback Mechanism
1. Try Firestore with proper query
2. Try fetching all users if permission fails
3. Use static JSON data as last resort
4. Always show something to users

## Testing Checklist

### Profile Update
- [ ] Upload profile image
- [ ] Update profile details
- [ ] Verify Cloudinary upload
- [ ] Check Firestore update
- [ ] Test validation errors

### Team Page
- [ ] View team members
- [ ] Check profile images load
- [ ] Test refresh functionality
- [ ] Verify fallback to static data
- [ ] Check loading states

### Permissions
- [ ] Non-authenticated users can view team
- [ ] Core members can update own profile
- [ ] Regular users cannot see non-core profiles
- [ ] Admin access works correctly

## Deployment Notes

1. **Firestore Rules**: Deploy the updated rules before going live
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Environment Variables**: Ensure these are set:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
   - Firebase configuration variables

3. **Cloudinary Setup**:
   - Create `csi-profiles` folder
   - Set up unsigned upload preset if needed
   - Configure transformation settings

## Troubleshooting

### "Missing or insufficient permissions"
- Check Firestore rules are deployed
- Verify user authentication status
- Check if user document has correct role field

### Images not uploading
- Verify Cloudinary configuration
- Check upload preset exists
- Ensure file size is under 5MB

### Team page not loading
- Check network connectivity
- Verify Firestore is accessible
- Check browser console for errors
- Static data should load as fallback

## Future Enhancements

1. **Caching**: Implement local caching for team data
2. **Pagination**: Add pagination for large teams
3. **Search**: Add search/filter functionality
4. **Batch Updates**: Allow admin to update multiple profiles
5. **Image Optimization**: Auto-resize images before upload
6. **Offline Support**: Add offline capability with service workers
