import { fileURLToPath } from "url";
import path from "path";

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
  const tag = `[ImgBB][user:${userId}]`;

  // 0) Key check — fail fast with a clear message
  if (!IMGBB_API_KEY) {
    console.error(`${tag} ❌ IMGBB_API_KEY is not set in environment`);
    throw new Error("IMG_BB_API_KEY missing");
  }
  console.log(`${tag} key present (len=${IMGBB_API_KEY.length})`);

  // 1) Validate base64 format
  console.log(`${tag} input length=${base64Data?.length ?? 0}`);
  const matches = base64Data?.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    console.error(
      `${tag} ❌ Invalid base64 — first 60 chars:`,
      base64Data?.slice(0, 60),
    );
    throw new Error("Invalid base64 image data");
  }

  const mimeType = matches[1];
  const base64Content = matches[2];
  console.log(
    `${tag} parsed OK — mime=${mimeType}, base64 length=${base64Content.length}`,
  );

  // 2) Build FormData
  const formData = new FormData();
  formData.append("image", base64Content);
  if (expiration !== undefined && expiration !== null) {
    formData.append("expiration", expiration.toString());
  }
  console.log(`${tag} FormData built — expiration=${expiration}`);

  // 3) Call ImgBB
  const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
  console.log(`${tag} POST ${url.replace(IMGBB_API_KEY, "***")}`);

  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        // Spoof a standard browser User-Agent
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    console.log(
      `${tag} HTTP ${response.status} ${response.statusText} (${Date.now() - startedAt}ms)`,
    );

    // 4) Parse JSON — guard against non-JSON responses
    let result;
    const rawText = await response.text();
    try {
      result = JSON.parse(rawText);
    } catch (parseErr) {
      console.error(`${tag} ❌ Non-JSON response body:`, rawText.slice(0, 500));
      throw new Error(`ImgBB returned non-JSON (HTTP ${response.status})`);
    }

    // 5) Check success BEFORE touching result.data
    if (!result.success) {
      console.error(`${tag} ❌ ImgBB error:`, JSON.stringify(result, null, 2));
      throw new Error(
        `ImgBB upload failed: ${result.error?.message || "Unknown error"}`,
      );
    }

    // 6) Extract URL — guard against missing data shape
    const imageUrl = result.data?.image?.url;
    if (!imageUrl) {
      console.error(
        `${tag} ❌ Success=true but no data.image.url:`,
        JSON.stringify(result, null, 2),
      );
      throw new Error("ImgBB response missing data.image.url");
    }

    console.log(`${tag} ✅ uploaded → ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error(`${tag} ❌ upload failed (${Date.now() - startedAt}ms):`, {
      name: error.name,
      message: error.message,
      cause: error.cause?.message,
    });
    throw new Error("Failed to upload image to ImgBB: " + error.message);
  }
};
