const axios = require("axios");

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const API_ENDPOINTS = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibonacci",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

const getRandomCount = () => Math.floor(Math.random() * (20 - 5 + 1)) + 5;

const generateRandomNumbers = (count, min = 1, max = 100) => {
  return Array.from(
    { length: count },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
};

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const generateRandomPrimes = async (count, min = 2, max = 100) => {
  let primes = [];
  while (primes.length < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (isPrime(num) && !primes.includes(num)) {
      primes.push(num);
    }
  }
  return primes;
};

const generateRandomFibonacci = async (count) => {
  const fib = [0, 1];
  while (fib.length < 50) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  }
  const startIdx = Math.floor(Math.random() * (fib.length - count));
  return fib.slice(startIdx, startIdx + count);
};

const generateRandomEvenNumbers = async (count, min = 2, max = 100) => {
  let evens = new Set();
  while (evens.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (num % 2 === 0) evens.add(num);
  }
  return [...evens];
};

const fetchNumbers = async (type) => {
  const count = getRandomCount();

  if (!API_ENDPOINTS[type]) return [];

  try {
    const response = await axios.get(API_ENDPOINTS[type], {
      headers: { Authorization: ACCESS_TOKEN },
      timeout: 500,
    });

    return response.data.numbers || [];
  } catch (error) {
    switch (type) {
      case "p":
        return generateRandomPrimes(count);
      case "f":
        return generateRandomFibonacci(count);
      case "e":
        return generateRandomEvenNumbers(count);
      case "r":
        return generateRandomNumbers(count);
      default:
        return [];
    }
  }
};

module.exports = { fetchNumbers };
