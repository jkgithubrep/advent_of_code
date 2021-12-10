const fs = require("fs");
const path = require("path");

const scoreTable = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const openingChars = ["(", "[", "{", "<"];
const closingChars = [")", "]", "}", ">"];

const getLineScore = (line) => {
  let lastOpenedChars = [];
  let corruptedChar = "";
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
  return isCorrupted ? scoreTable[corruptedChar] : 0;
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const lines = data.split("\n").filter(Boolean);
  const result = lines.reduce((prev, curr) => prev + getLineScore(curr), 0);
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
