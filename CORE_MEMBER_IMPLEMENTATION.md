# Core Member Role-Based Authentication Implementation

## Overview
This implementation provides automatic role assignment for CSI core members when they login with their registered email addresses. Only users with @nmamit.in emails can be core members.

## Features Implemented

### 1. Core Members Mapping (`src/constants/coreMembers.js`)
- Defines 26 core members with their specific roles
- Maps email addresses to positions and permissions
- Includes role hierarchy with levels (1-10)
- Permission-based access control system

### 2. Enhanced Authentication Context (`src/contexts/AuthContext.jsx`)
- **Auto-role assignment**: Automatically assigns roles when core members login
- **Permission checking**: `checkPermission()` method to verify user permissions
- **Role display**: `getUserRoleDisplay()` to show user's position
- **Core member verification**: `isUserCoreMember()` to check if user is a core member
- Updates existing users' roles if they're in the core member list

### 3. Updated Navigation (`src/components/Layout/Navbar.jsx`)
- Shows role badge for core members with yellow border
- Displays position name under user's name
- Added "Core Dashboard" link for core members
- Visual distinction for core members (yellow theme)

### 4. Core Member Guard (`src/components/Guards/CoreMemberGuard.jsx`)
- Protects core member routes
- Verifies user is logged in and is a core member
- Optional permission-based access control
- User-friendly error messages for unauthorized access

### 5. Core Member Dashboard (`src/pages/CoreDashboard.jsx`)
- Personalized dashboard based on role and permissions
- Dynamic cards showing only accessible features
- Role-specific quick stats
- Recent activity feed
- Permission display

### 6. Updated Routes (`src/App.jsx`)
- Added protected `/dashboard` route for core members
- Integrated CoreMemberGuard for route protection

## Core Member Roles & Permissions

### Executive Board
- **President** (Level 1): Full system access
- **Vice President** (Level 2): Full system access
- **Secretary** (Level 3): Events, Members, Announcements
- **Joint Secretary** (Level 4): Events, Members
- **Treasurer** (Level 5): Finance, Members

### Team Leads
- **Technical Lead** (Level 6): Technical, Website, Projects
- **Event Management Lead** (Level 7): Events, Coordination
- **Publicity Lead** (Level 8): Publicity, Social Media, Content

### Team Members
- **Technical Team** (Level 10): Technical, Projects
- **Graphics Team** (Level 10): Graphics, Content
- **Event Management** (Level 10): Events
- **MC Committee** (Level 10): Announcements, Events
- **Publicity Team** (Level 10): Publicity
- **Social Media** (Level 10): Social Media, Content

## How It Works

1. **User Signs In**: When a user signs in with Google OAuth
2. **Email Check**: System checks if the email is in the core members list
3. **Auto Assignment**: If found, automatically assigns:
   - Role: `coreMember`
   - Position: Specific role (President, Secretary, etc.)
   - Permissions: Based on their position
   - Membership status: Active
4. **UI Updates**: Navigation shows role badge and Core Dashboard link
5. **Access Control**: User can access dashboard and role-specific features

## Testing Instructions

### For Core Members:
1. Sign in with one of the registered email addresses
2. You'll see a welcome message with your role
3. Your profile will show a yellow badge with your position
4. Click "Core Dashboard" in the dropdown menu
5. Dashboard will show features based on your permissions

### Test Accounts:
- President: `nnm23cb052@nmamit.in`
- Vice President: `harshithapsalian11@gmail.com`
- Secretary: `nnm23cs043@nmamit.in`
- Technical Lead: `prashithshetty16@gmail.com`
- Graphics Team: `nnm24is200@nmamit.in`

## Security Features

1. **Email Verification**: Only registered emails get core member roles
2. **NMAMIT Priority**: Special recognition for @nmamit.in emails
3. **Permission-Based Access**: Features shown based on role permissions
4. **Protected Routes**: Core dashboard only accessible to verified members
5. **Automatic Updates**: Existing users get role updates on next login

## Future Enhancements

1. Admin interface to manage core member list
2. Email notifications for role assignments
3. Activity logging for core member actions
4. Team collaboration features
5. Performance metrics dashboard
6. Integration with event management system

## Notes

- Core member status is automatically assigned and cannot be self-selected
- Only the 26 registered emails will get core member access
- Permissions are predefined and tied to specific roles
- The system supports both @nmamit.in and external email addresses for core members
