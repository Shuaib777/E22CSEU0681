require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const WINDOW_SIZE = 10;
const windowCurrentState = [];

const API_TOKEN = process.env.API_TOKEN;

const API_ENDPOINTS = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibonacci",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

async function fetchNumbers(url) {
  try {
    console.log(url);
    const response = await axios.get(url, {
      headers: { Authorization: API_TOKEN },
      timeout: 600,
    });
    console.log(response);
    return response.data.numbers || [];
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return [];
  }
}

app.get("/numbers/:type", async (req, res) => {
  const { type } = req.params;
  if (!API_ENDPOINTS[type]) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  const numbers = await fetchNumbers(API_ENDPOINTS[type]);

  if (numbers.length === 0) {
    return res
      .status(500)
      .json({ error: "Failed to fetch numbers or timeout occurred." });
  }

  const newNumbers = numbers.filter((num) => !windowCurrentState.includes(num));
  const windowPrevState = [...windowCurrentState];

  if (windowCurrentState.length + newNumbers.length > WINDOW_SIZE) {
    const excessCount =
      windowCurrentState.length + newNumbers.length - WINDOW_SIZE;
    windowCurrentState.splice(0, excessCount);
  }

  windowCurrentState.push(...newNumbers);

  const avg = windowCurrentState.length
    ? windowCurrentState.reduce((a, b) => a + b, 0) / windowCurrentState.length
    : 0;

  res.json({
    windowPrevState,
    windowCurrState: [...windowCurrentState],
    numbers: newNumbers,
    avg: avg.toFixed(2),
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
