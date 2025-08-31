// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqnlrrcgb',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'csi-events',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET
}

// Validate Cloudinary configuration
export const isCloudinaryConfigured = () => {
  const { cloudName } = cloudinaryConfig;
  return cloudName && cloudName !== 'your-cloud-name' && cloudName !== '';
}

// Get configuration status for debugging
export const getCloudinaryStatus = () => {
  return {
    configured: isCloudinaryConfigured(),
    cloudName: cloudinaryConfig.cloudName,
    uploadPreset: cloudinaryConfig.uploadPreset,
    hasApiKey: !!cloudinaryConfig.apiKey
  };
}

export const getCloudinaryUrl = (publicId, options = {}) => {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/`;

  // Add transformations (optional)
  let transformations = [];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);

  const transformString = transformations.length ? transformations.join(",") + "/" : "";

  return `${baseUrl}${transformString}${publicId}`;
};

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} folder - Folder path in Cloudinary
 * @returns {Promise<Object>} - Cloudinary response with secure_url
 */
export const uploadToCloudinary = async (file, folder = 'csi-events') => {
  // Check if Cloudinary is properly configured
  if (!isCloudinaryConfigured()) {
    const errorMsg = `Cloudinary is not properly configured. Cloud name: ${cloudinaryConfig.cloudName}`;
    console.error(errorMsg);
    throw new Error('Cloudinary configuration error: Please check your cloud name settings');
  }

  const formData = new FormData();
  formData.append('file', file);
  
  // Try unsigned upload if no preset is specified
  if (cloudinaryConfig.uploadPreset && cloudinaryConfig.uploadPreset !== '') {
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  }
  
  formData.append('folder', folder);

  try {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
    console.log('Uploading to Cloudinary:', uploadUrl);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary response error:', errorText);
      
      // Parse error for better user feedback
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message?.includes('preset')) {
          throw new Error('Upload preset not found. Please create "csi-events" preset in Cloudinary or use unsigned uploads.');
        }
        throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
      } catch (parseError) {
        throw new Error(`Failed to upload image. Status: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('Cloudinary upload successful:', data.secure_url);
    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} - Cloudinary response
 */
export const deleteFromCloudinary = async (publicId) => {
  // Note: This requires server-side implementation for security
  // as it needs API secret which should not be exposed in frontend
  console.warn('Image deletion should be handled server-side for security');
  return { success: false, message: 'Server-side implementation required' };
};

/**
 * Get optimized image URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed image URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const defaultOptions = {
    quality: 'auto',
    format: 'auto',
    ...options
  };

  // Extract public ID from URL
  const urlParts = url.split('/');
  const uploadIndex = urlParts.indexOf('upload');
  if (uploadIndex === -1) return url;

  const publicIdWithExtension = urlParts.slice(uploadIndex + 1).join('/');
  const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');

  return getCloudinaryUrl(publicId, defaultOptions);
};
