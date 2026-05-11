import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// You can remove the local directory creation code entirely
// const uploadDir = path.join(process.cwd(), 'public', 'user-profile-pictures');
// if (!fs.existsSync(uploadDir)) { ... }

// ImgBB API Key – set in environment variables (e.g., .env file or Render dashboard)
const IMGBB_API_KEY = process.env.IMG_BB_API_KEY;

/**
 * Uploads a base64 image to ImgBB and returns the public URL.
 * @param {string} base64Data - Base64 string (e.g., "data:image/png;base64,iVBOR...")
 * @param {number|string} userId - User ID (unused for ImgBB but kept for compatibility)
 * @param {number} expiration - Expiration in seconds (optional, default 0 = no expiration)
 * @returns {Promise<string>} Public URL of the image on ImgBB
 */
export const saveBase64Image = async (base64Data, userId, expiration = 0) => {
  // Extract the base64 content (remove the data:image/...;base64, prefix)
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 image data');
  }

  const base64Content = matches[2]; // pure base64 string

  // Prepare FormData
  const formData = new FormData();
  formData.append('image', base64Content);
  if (expiration !== undefined && expiration !== null) {
    formData.append('expiration', expiration.toString());
  }

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    console.log(result.data.image.url,"result from imgbb");

    if (!result.success) {
      throw new Error(`ImgBB upload failed: ${result.error?.message || 'Unknown error'}`);
    }

    // Return the direct image URL (from the 'url' field in the response)
    return result.data.image.url;
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw new Error('Failed to upload image to ImgBB: ' + error.message);
  }
};