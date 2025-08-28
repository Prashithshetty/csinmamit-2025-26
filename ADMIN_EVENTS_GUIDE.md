# Admin Events Management Guide

## Overview
The Admin Events Management system provides a complete CRUD (Create, Read, Update, Delete) interface for managing CSI events. Events are stored in Firebase Firestore with images uploaded to Cloudinary.

## Features

### 1. Event Management
- **Create Events**: Add new events with all details and poster upload
- **Edit Events**: Update existing event information and images
- **Delete Events**: Remove events from the system
- **Publish/Unpublish**: Control event visibility on the public site
- **Feature Events**: Mark events as featured for special highlighting

### 2. Event Properties
Each event includes the following fields:
- **Basic Information**
  - Title (required)
  - Description (required)
  - Brief summary
  - Event poster image (uploaded to Cloudinary)
  
- **Date & Time**
  - Date (required)
  - Time
  - Year (required, used for filtering)
  
- **Location & Organization**
  - Venue (required)
  - Organizers (default: CSI NMAMIT)
  
- **Event Configuration**
  - Category: UPCOMING, ONGOING, PREVIOUS
  - Type: TEAM, INDIVIDUAL, WORKSHOP, SEMINAR, COMPETITION, BOOTCAMP
  - Status: active, completed, cancelled, postponed
  
- **Registration & Participation**
  - Entry fee
  - Registrations available (yes/no)
  - Participant count
  - Contact persons (name, phone, email)
  
- **Visibility Settings**
  - Published (visible on public site)
  - Featured (highlighted events)

### 3. Admin Interface Features
- **Statistics Dashboard**: View total events, published, upcoming, and previous counts
- **Advanced Filtering**: Search and filter by year, category, status, type
- **Sorting Options**: Sort by date, title, year, or creation date
- **Bulk Actions**: Export/Import events in JSON format
- **Expandable Details**: Click to view full event information in the list

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=csi-events
```

### 2. Cloudinary Setup
1. Create a Cloudinary account at https://cloudinary.com
2. Navigate to Settings > Upload
3. Create an unsigned upload preset named `csi-events`
4. Configure the preset:
   - Folder: `csi-events`
   - Allowed formats: jpg, jpeg, png, webp
   - Max file size: 5MB (optional)
   - Transformations: Auto quality, auto format (optional)

### 3. Firebase Firestore Setup
1. Enable Firestore in your Firebase project
2. Create a collection named `events`
3. Set up security rules (example):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public can read published events
    match /events/{eventId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
  }
}
```

### 4. Create Firestore Indexes
Create the following composite indexes in Firestore:

1. **Index 1**: For public event queries
   - Collection: `events`
   - Fields: 
     - `year` (Ascending)
     - `published` (Ascending)
     - `date` (Descending)

2. **Index 2**: For admin queries
   - Collection: `events`
   - Fields:
     - `year` (Descending)
     - `createdAt` (Descending)

## Usage Guide

### Creating an Event
1. Navigate to Admin > Events
2. Click "Create Event" button
3. Fill in the required fields:
   - Upload event poster
   - Enter title and description
   - Select date and year
   - Choose category and type
   - Add venue information
4. Configure optional settings:
   - Entry fee
   - Contact persons
   - Registration availability
5. Choose visibility:
   - Check "Published" to make visible on public site
   - Check "Featured" for special highlighting
6. Click "Create Event"

### Editing an Event
1. Find the event in the list
2. Click the Edit icon (pencil)
3. Modify the desired fields
4. Upload a new image if needed
5. Click "Update Event"

### Managing Event Visibility
- **Publish/Unpublish**: Click the eye icon to toggle
- **Feature/Unfeature**: Click the star icon to toggle
- Changes take effect immediately

### Deleting an Event
1. Click the trash icon next to the event
2. Click again to confirm deletion
3. Event and associated data will be permanently removed

### Exporting Events
1. Click "Export" button in the header
2. Events will be downloaded as JSON file
3. File includes all event data for backup/migration

### Importing Events
1. Click "Import" button
2. Select a JSON file with event data
3. System will validate and prepare for import
4. Review and confirm import

## Data Flow

### Event Creation Flow
1. Admin fills event form
2. Image uploads to Cloudinary
3. Event data + Cloudinary URL saves to Firestore
4. Event appears in admin list
5. If published, appears on public Events page

### Public Display
- User Events page (`/events`) fetches from Firestore
- Only shows published events
- Filters by year
- Falls back to mock data if no events exist

## File Structure

```
src/
├── pages/Admin/
│   └── AdminEvents.jsx          # Main admin events page
├── components/Admin/
│   ├── EventForm.jsx            # Event creation/edit form
│   └── EventList.jsx            # Events table with filters
├── services/
│   └── eventService.js          # Firestore & Cloudinary operations
├── hooks/
│   └── useEvents.js             # Public events data hook
├── utils/
│   └── adminEventUtils.js       # Helper functions
└── config/
    ├── firebase.js              # Firebase configuration
    └── cloudinary.js            # Cloudinary configuration
```

## Troubleshooting

### Common Issues

1. **Image Upload Fails**
   - Check Cloudinary cloud name in `.env`
   - Verify upload preset exists and is unsigned
   - Check file size (max 5MB)
   - Ensure file is an image format

2. **Events Not Showing on Public Page**
   - Verify event is published
   - Check year matches selected filter
   - Ensure Firestore indexes are created
   - Check browser console for errors

3. **Firestore Permission Denied**
   - Verify user is authenticated as admin
   - Check Firestore security rules
   - Ensure admin role is set in Firebase Auth

4. **Date Sorting Not Working**
   - Create composite index in Firestore
   - Check date format is valid
   - Fallback to manual sorting if index fails

## Best Practices

1. **Image Optimization**
   - Upload high-quality images (1920x1080 recommended)
   - Cloudinary auto-optimizes for web delivery
   - Use JPEG for photos, PNG for graphics

2. **Event Information**
   - Write clear, descriptive titles
   - Include all relevant details in description
   - Add contact persons for inquiries
   - Set appropriate category and status

3. **Data Management**
   - Regularly export events for backup
   - Review and clean up old events
   - Keep participant counts updated
   - Archive completed events (set as PREVIOUS)

## Security Considerations

1. **Admin Access**
   - Only authenticated admins can manage events
   - Implement role-based access control
   - Log admin actions for audit trail

2. **Data Validation**
   - All inputs are validated before saving
   - File uploads restricted to images
   - Size limits enforced (5MB)
   - XSS protection on text inputs

3. **API Security**
   - Cloudinary upload preset is unsigned (public)
   - Sensitive operations require authentication
   - Rate limiting recommended for production

## Future Enhancements

Potential improvements for the system:
- Batch event operations
- Event templates for quick creation
- Automatic social media sharing
- Registration form builder
- Payment integration for paid events
- Email notifications for participants
- Analytics dashboard
- Event check-in system
