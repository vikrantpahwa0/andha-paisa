import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'user-profile-pictures');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Saves a base64 image to the public folder and returns the public URL.
 * @param {string} base64Data - Base64 string (e.g., "data:image/png;base64,iVBOR...")
 * @param {number|string} userId - User ID to create unique filename
 * @returns {string} Public URL path (e.g., "/user-profile-pictures/user_123_1234567890.png")
 */
export const saveBase64Image = (base64Data, userId) => {
  // Extract the image type and base64 content
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 image data');
  }

  const extension = matches[1]; // png, jpeg, jpg
  const base64Content = matches[2];
  const buffer = Buffer.from(base64Content, 'base64');

  // Generate unique filename using userId + timestamp
  const timestamp = Date.now();
  const filename = `user_${userId}_${timestamp}.${extension}`;
  const filePath = path.join(uploadDir, filename);

  // Write file
  fs.writeFileSync(filePath, buffer);

  // Return public URL (relative path)
  return `/user-profile-pictures/${filename}`;
};