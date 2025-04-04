const axios = require("axios");

const API_TOKEN = process.env.API_TOKEN;
const API_ENDPOINTS = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibonacci",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

const fetchNumbers = async (type) => {
  if (!API_ENDPOINTS[type]) return [];

  try {
    const response = await axios.get(API_ENDPOINTS[type], {
      headers: { Authorization: API_TOKEN },
      timeout: 500,
    });

    return response.data.numbers || [];
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return [];
  }
};

module.exports = { fetchNumbers };
