/**
 * Debug utility to check core member authentication
 * This file helps identify why core members are not being recognized
 */

import { isCoreMember, getRoleByEmail } from './secureCoreMembersUtils';
import { CORE_MEMBERS } from '../constants/coreMembers';

export const debugCoreMemberAuth = (email) => {
  console.log('=== Core Member Authentication Debug ===');
  console.log('Email being checked:', email);
  
  // Check if email exists in constants file
  const inConstantsFile = CORE_MEMBERS.hasOwnProperty(email.toLowerCase());
  console.log('Email in constants/coreMembers.js:', inConstantsFile);
  
  if (inConstantsFile) {
    console.log('Role data from constants:', CORE_MEMBERS[email.toLowerCase()]);
  }
  
  // Check if email is recognized by secure utils (env variable)
  const isCore = isCoreMember(email);
  console.log('Recognized as core member by secureCoreMembersUtils:', isCore);
  
  const roleData = getRoleByEmail(email);
  console.log('Role data from secureCoreMembersUtils:', roleData);
  
  // Check environment variable
  const envData = import.meta.env.VITE_CORE_MEMBERS_DATA;
  console.log('Environment variable VITE_CORE_MEMBERS_DATA exists:', !!envData);
  
  if (envData) {
    try {
      const decodedData = JSON.parse(atob(envData));
      console.log('Decoded environment data contains email:', decodedData.hasOwnProperty(email.toLowerCase()));
      console.log('Total emails in environment data:', Object.keys(decodedData).length);
    } catch (error) {
      console.error('Error decoding environment data:', error);
    }
  }
  
  console.log('=== End Debug ===');
  
  return {
    email,
    inConstantsFile,
    recognizedBySecureUtils: isCore,
    roleData,
    envVariableExists: !!envData
  };
};

// Function to generate the encoded data for .env file
export const generateEnvData = () => {
  const encoded = btoa(JSON.stringify(CORE_MEMBERS));
  console.log('Generated encoded data for VITE_CORE_MEMBERS_DATA:');
  console.log(encoded);
  console.log('\nAdd this to your .env file:');
  console.log(`VITE_CORE_MEMBERS_DATA=${encoded}`);
  return encoded;
};
