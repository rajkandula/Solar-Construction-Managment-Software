const mongoCollections = require("../config/mongoCollections");
const more = mongoCollections.more;
const { ObjectId } = require("mongodb");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const fetch = import("node-fetch");

function extractBlogData(html) {
  // Use any HTML parsing library of your choice to extract the relevant data
  // Here, we'll use a simple regex-based approach for demonstration purposes
  const titleRegex = /<h1>(.*?)<\/h1>/i;
  const contentRegex = /<div class="blog-content">(.*?)<\/div>/i;

  const titleMatch = html.match(titleRegex);
  const contentMatch = html.match(contentRegex);

  const title = titleMatch ? titleMatch[1] : "Solar Blog";
  const content = contentMatch
    ? contentMatch[1]
    : " The Benefits of Solar Energy for a Sustainable Future, Introduction: In recent years, solar energy has emerged as a leading source of renewable energy, revolutionizing the way we power our homes and businesses. Harnessing the power of the sun, solar energy offers numerous benefits for a sustainable future. In this blog post, we will explore the advantages of solar energy and how it contributes to a cleaner and greener world";

  return { title, content };
}

// news fetch

const fetchNewsData = async () => {
  const apiKey = "9f88c911dd3c4e69b198440def6afee5"; // Replace with your actual API key
  const apiUrl =
    "https://techcrunch.com/2023/05/07/elizabeth-holmes-left-to-her-own-devices/"; // Replace with the news API URL

  try {
    const response = await fetch(`${apiUrl}?apiKey=${apiKey}`);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching news data:", error);
    return [];
  }
};

// module.exports = fetchNewsData;

module.exports = { extractBlogData, fetchNewsData };
