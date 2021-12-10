const fs = require("fs");
const path = require("path");

const scoreTable = {
  "(": 1,
  "[": 2,
  "{": 3,
  "<": 4,
};

const openingChars = ["(", "[", "{", "<"];
const closingChars = [")", "]", "}", ">"];

const isCorrupted = (line) => {
  let lastOpenedChars = [];
  const isCorrupted = [...line].some((char) => {
    if (openingChars.includes(char)) {
      lastOpenedChars.push(char);
      return false;
    } else {
      const charIndex = closingChars.findIndex((val) => val === char);
      const lastOpenedChar = lastOpenedChars.pop();
      if (lastOpenedChar === openingChars[charIndex]) return false;
      corruptedChar = char;
      return true;
    }
  });
  return isCorrupted;
};

const getIncompleteLineScore = (line) => {
  let lastOpenedChars = [];
  [...line].forEach((char) => {
    if (openingChars.includes(char)) {
      lastOpenedChars.push(char);
    } else {
      lastOpenedChars.pop();
    }
  });
  return lastOpenedChars
    .reverse()
    .reduce((prev, curr) => prev * 5 + scoreTable[curr], 0);
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const lines = data.split("\n").filter(Boolean);
  const incompleteLines = lines.filter((line) => !isCorrupted(line));
  const results = incompleteLines
    .reduce((prev, curr) => [...prev, getIncompleteLineScore(curr)], [])
    .sort((a, b) => a - b);
  const result = results[(results.length - 1) / 2];
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
