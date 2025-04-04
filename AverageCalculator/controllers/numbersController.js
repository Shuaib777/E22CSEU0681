const { fetchNumbers } = require("../services/numberService");

const WINDOW_SIZE = 10;
const windowCurrentState = [];

const getNumbers = async (req, res) => {
  const { type } = req.params;
  console.log(type);
  const numbers = await fetchNumbers(type);

  if (!numbers.length) {
    return res
      .status(500)
      .json({ error: "Failed to fetch numbers or timeout occurred." });
  }

  const newNumbers = numbers.filter((num) => !windowCurrentState.includes(num));
  const windowPrevState = [...windowCurrentState];

  windowCurrentState.push(...newNumbers);

  // remove from start
  while (windowCurrentState.length > WINDOW_SIZE) {
    windowCurrentState.shift();
  }

  const avg = windowCurrentState.length
    ? windowCurrentState.reduce((a, b) => a + b, 0) / windowCurrentState.length
    : 0;

  res.json({
    windowPrevState,
    windowCurrState: [...windowCurrentState],
    numbers: newNumbers,
    avg: avg.toFixed(2),
  });
};

module.exports = { getNumbers };
