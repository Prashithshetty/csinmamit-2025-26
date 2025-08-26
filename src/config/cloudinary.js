// utils/cloudinary.js
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const getCloudinaryUrl = (publicId, options = {}) => {
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`;

  // Add transformations (optional)
  let transformations = [];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);

  const transformString = transformations.length ? transformations.join(",") + "/" : "";

  return `${baseUrl}${transformString}${publicId}`;
};
