/**
 * Script to generate the encoded VITE_CORE_MEMBERS_DATA for .env file
 * Run this script to get the encoded string that needs to be added to your .env file
 */

import { CORE_MEMBERS } from '../constants/coreMembers.js';

// Function to encode data to base64
const encodeData = (data) => {
  try {
    // In Node.js environment, use Buffer
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(JSON.stringify(data)).toString('base64');
    }
    // In browser environment, use btoa
    return btoa(JSON.stringify(data));
  } catch (error) {
    console.error('Error encoding data:', error);
    return null;
  }
};

// Generate the encoded data
const generateEncodedData = () => {
  const encoded = encodeData(CORE_MEMBERS);
  
  if (encoded) {
    console.log('========================================');
    console.log('ENCODED CORE MEMBERS DATA FOR .env FILE');
    console.log('========================================\n');
    console.log('Add this line to your .env file:\n');
    console.log(`VITE_CORE_MEMBERS_DATA=${encoded}`);
    console.log('\n========================================');
    console.log('Total core members encoded:', Object.keys(CORE_MEMBERS).length);
    console.log('========================================');
  } else {
    console.error('Failed to encode core members data');
  }
  
  return encoded;
};

// Run the generation
generateEncodedData();

// Export for use in other scripts if needed
export { generateEncodedData, encodeData };
