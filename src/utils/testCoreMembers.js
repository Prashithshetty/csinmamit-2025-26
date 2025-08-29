import { isCoreMember, getRoleByEmail } from '../constants/coreMembers';

// Test function to verify core member detection
export const testCoreMemberDetection = () => {
  const testEmails = [
    'nnm23cb052@nmamit.in', // President
    'harshithapsalian11@gmail.com', // Vice President
    'prashithshetty16@gmail.com', // Technical Lead
    'regular@nmamit.in', // Not a core member
    'external@gmail.com' // Not a core member
  ];

  console.log('=== Core Member Detection Test ===');
  
  testEmails.forEach(email => {
    const isCoreResult = isCoreMember(email);
    const roleResult = getRoleByEmail(email);
    
    console.log(`Email: ${email}`);
    console.log(`Is Core Member: ${isCoreResult}`);
    console.log(`Role Data:`, roleResult);
    console.log('---');
  });
};

// Test the current user's role detection
export const testCurrentUserRole = (user) => {
  if (!user) {
    console.log('No user logged in');
    return;
  }

  console.log('=== Current User Role Test ===');
  console.log('User Email:', user.email);
  console.log('User Role:', user.role);
  console.log('Is Core Member:', user.isCoreMember);
  console.log('Role Details:', user.roleDetails);
  
  // Test the helper functions
  const isCoreResult = isCoreMember(user.email);
  const roleResult = getRoleByEmail(user.email);
  
  console.log('Helper Function Results:');
  console.log('isCoreMember():', isCoreResult);
  console.log('getRoleByEmail():', roleResult);
};
