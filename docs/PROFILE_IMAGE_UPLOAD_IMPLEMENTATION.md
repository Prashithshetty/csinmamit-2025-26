# Profile Image Upload Implementation

## Overview
This implementation adds the ability for core members to upload profile images to Cloudinary and save the complete profile data to Firestore.

## Features Implemented

### 1. Image Upload to Cloudinary
- **Location**: `src/components/CoreProfile/ProfileAvatar.jsx`
- **Functionality**:
  - Click on camera button to select image
  - File validation (type and size)
  - Image preview before upload
  - Loading state during upload

### 2. Profile Data Management
- **Location**: `src/services/profileService.js`
- **Services**:
  - `uploadProfileImage()` - Uploads image to Cloudinary
  - `updateUserProfile()` - Updates user data in Firestore
  - `updateProfileWithImage()` - Combines image upload and profile update
  - `validateProfileData()` - Validates form data before submission

### 3. Firestore Integration
- **Data Structure**:
```javascript
{
  uid: "user_id",
  name: "User Name",
  photoURL: "cloudinary_url",
  profile: {
    phone: "1234567890",
    bio: "User bio",
    branch: "CS",
    year: "3rd Year",
    skills: [],
    linkedin: "linkedin.com/in/user",
    github: "github.com/user",
    imageHistory: [
      {
        url: "cloudinary_url",
        publicId: "public_id",
        uploadedAt: "timestamp",
        format: "jpg",
        size: 12345
      }
    ],
    updatedAt: serverTimestamp()
  }
}
```

## Implementation Flow

1. **User clicks camera button** → Opens file picker
2. **User selects image** → Validates file and shows preview
3. **User fills/edits profile form** → Real-time validation
4. **User clicks Save** → 
   - Uploads image to Cloudinary (if selected)
   - Gets Cloudinary URL
   - Updates Firestore with profile data and image URL
   - Updates local state via AuthContext
   - Shows success message

## Key Components Modified

### 1. ProfileAvatar Component
```jsx
// Added props for image handling
<ProfileAvatar 
  user={user}
  getUserRoleDisplay={getUserRoleDisplay}
  getRoleCategory={() => roleCategory}
  onImageSelect={handleImageSelect}  // New
  isUploading={isUploading}          // New
  previewUrl={previewUrl}            // New
/>
```

### 2. CoreMemberProfile Component
- Added image selection state management
- Integrated with profileService for uploads
- Added validation before submission
- Better error handling with specific messages

### 3. ProfileForm Component
- Added upload progress indicator
- Disabled form fields during upload
- Loading state on submit button

## Configuration Requirements

### Cloudinary Setup
Ensure these environment variables are set in `.env`:
```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=csi-events
```

### Firebase Setup
Firestore rules should allow authenticated users to update their own profiles:
```javascript
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

## Error Handling

The implementation includes comprehensive error handling:
- File type validation (JPEG, PNG, WebP only)
- File size validation (max 5MB)
- Network error handling
- Cloudinary upload failures
- Firestore permission errors
- Form validation errors

## Security Considerations

1. **Client-side validation** - File type and size checks
2. **Cloudinary folder organization** - Images stored in `csi-profiles` folder
3. **Image history tracking** - Keeps record of all uploaded images
4. **Firebase security rules** - Users can only update their own profiles

## Testing Checklist

- [ ] Upload JPEG image
- [ ] Upload PNG image
- [ ] Upload WebP image
- [ ] Try uploading invalid file type
- [ ] Try uploading file > 5MB
- [ ] Update profile without image
- [ ] Update profile with image
- [ ] Cancel edit mode
- [ ] Check image preview
- [ ] Verify Firestore update
- [ ] Verify Cloudinary upload
- [ ] Test error scenarios

## Future Enhancements

1. **Image cropping** - Allow users to crop images before upload
2. **Image compression** - Automatically compress large images
3. **Multiple images** - Support for gallery/portfolio
4. **Image deletion** - Allow users to remove profile picture
5. **Cloudinary transformations** - Auto-optimize images for different screen sizes

## Troubleshooting

### Common Issues

1. **"Cloudinary configuration error"**
   - Check environment variables
   - Verify Cloudinary account settings
   - Ensure upload preset exists

2. **"Failed to upload image"**
   - Check internet connection
   - Verify file size < 5MB
   - Check Cloudinary quota

3. **"Permission denied"**
   - Verify Firebase authentication
   - Check Firestore security rules
   - Ensure user is logged in

## Dependencies

- `firebase/firestore` - Database operations
- `react-hot-toast` - User notifications
- `lucide-react` - Icons
- Cloudinary API - Image hosting
- Firebase Storage - Alternative storage option (not used in this implementation)
