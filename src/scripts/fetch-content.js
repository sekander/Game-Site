const fs = require("fs");
const path = require("path");
const axios = require("axios");
const https = require("https");

// Custom agent to bypass SSL certificate verification for your local server
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const wordpressBaseUrl =
  "https://sekander.duckdns.org/projects/wordpress/wp-json/wp/v2";
const pagesToFetch = [
  { key: "home", slug: "home" },
  { key: "about", slug: "about" },
  { key: "projectsGames", slug: "project-games" },
  { key: "changelog", slug: "changelog" },
  { key: "contactUs", slug: "contact-us" },
  { key: "privacyNotice", slug: "privacy-policy" },
  { key: "footer", slug: "footer" },
];

const imageDir = path.resolve(__dirname, "../../public/images");

// Regex to identify image URLs. This is a generic pattern. You may need to refine it.
const imageUrlRegex =
  /https:\/\/sekander\.duckdns\.org\/projects\/wordpress\/wp-content\/uploads\/\S+\.(png|jpe?g|gif|svg)/i;

// Function to download an image from a URL and save it to a local file
async function downloadImage(url, filename) {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      httpsAgent: agent,
    });

    const filePath = path.join(imageDir, filename);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log(`Downloaded ${url} to /images/${filename}`);
        resolve(`/images/${filename}`);
      });
      writer.on("error", (err) => {
        console.error(`Error writing file ${filename}:`, err);
        reject(err);
      });
    });
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error.message);
    return null; // Return null on failure
  }
}

// Recursive function to process an object, find image URLs, and replace them
async function processObjectForImages(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return Promise.all(obj.map((item) => processObjectForImages(item)));
  }

  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Check if the value is a string and matches our image URL regex
      if (typeof value === "string" && imageUrlRegex.test(value)) {
        try {
          const filename = path.basename(new URL(value).pathname);
          const localPath = await downloadImage(value, filename);
          newObj[key] = localPath || value; // Use local path, or fall back to original URL
        } catch (error) {
          console.error(`Could not process image URL ${value}:`, error);
          newObj[key] = value; // Fallback to original URL
        }
      } else if (typeof value === "object") {
        // Recursively process nested objects and arrays
        newObj[key] = await processObjectForImages(value);
      } else {
        // Copy other values as-is
        newObj[key] = value;
      }
    }
  }
  return newObj;
}

async function fetchAllContent() {
  const allContent = {};

  // 1. Create the images directory if it doesn't exist
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
    console.log(`Created image directory: ${imageDir}`);
  }

  for (const { key, slug } of pagesToFetch) {
    console.log(`Fetching content for: ${key}...`);
    try {
      const response = await axios.get(
        `${wordpressBaseUrl}/pages?slug=${slug}`,
        { httpsAgent: agent },
      );
      const data = response.data;
      let content = data[0]?.acf || null;
      console.log(content);

      // 2. Process the entire ACF object to find and download images
      if (content) {
        content = await processObjectForImages(content);
      }

      allContent[key] = content;
    } catch (error) {
      console.error(`Error fetching or processing content for ${key}:`, error);
      allContent[key] = null;
    }
  }

  const outputPath = path.resolve(__dirname, "../../public/content.json");
  try {
    fs.writeFileSync(outputPath, JSON.stringify(allContent, null, 2), "utf-8");
    console.log(`Successfully wrote content to: ${outputPath}`);
  } catch (error) {
    console.error(`Error writing to file ${outputPath}:`, error);
  }
}

fetchAllContent();
