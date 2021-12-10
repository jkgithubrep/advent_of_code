const fs = require("fs");
const path = require("path");

const rightOrder = ["a", "b", "c", "d", "e", "f", "g"];
const digits = [
  "abcefg",
  "cf",
  "acdeg",
  "acdfg",
  "bcdf",
  "abdfg",
  "abdefg",
  "acf",
  "abcdefg",
  "abcdfg",
];
const letterIndexes = [2, 5, 0, 1, 3, 4, 6];

const cartesian = (...a) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

const formatEntry = (string) => [...string].sort().join("");

const parseEntry = (entry) => {
  const [inputDigits, outputDigits] = entry.split(" | ");

  const inputDigitsArray = inputDigits.split(" ").map(formatEntry);
  const outputDigitsArray = outputDigits.split(" ").map(formatEntry);
  return [inputDigitsArray, outputDigitsArray];
};

const reducer = (prev, curr) => {
  const [inputDigits, outputDigits] = parseEntry(curr);

  // Extract distinct digits from inputDigits
  const distinctDigits = inputDigits
    .filter((digit) => [2, 3, 4, 7].includes(digit.length))
    .sort((a, b) => a.length - b.length);

  // Extract segments from distinct digits
  const segments = distinctDigits.map((val, index, array) => {
    if (!index) return [...val];
    const lettersToFilter = [
      ...new Set(array.slice(0, index).flatMap((str) => [...str])),
    ];
    return [...val].filter((letter) => !lettersToFilter.includes(letter));
  });

  // Generate alternative order for each digit
  const altSegments = segments.map((val) => {
    if (val.length < 2) return [val];
    return [val, [val[1], val[0]]];
  });

  // Generate all possible combinations of segments
  const allComb = cartesian(...altSegments);

  const isFoundInInput = (digit) => inputDigits.includes(digit);

  let outputValue = 0;

  allComb.some((combination) => {
    // Generate a new try
    const tryOrder = new Array(7);
    combination.forEach(
      (letter, index) => (tryOrder[letterIndexes[index]] = letter)
    );

    // Generate digits with new try
    const newDigits = digits.map((digitString) =>
      [...digitString]
        .map(
          (letter) => tryOrder[rightOrder.findIndex((val) => val === letter)]
        )
        .sort()
        .join("")
    );

    const isValidCombination = newDigits.every(isFoundInInput);

    if (!isValidCombination) return false;

    outputValue = outputDigits.reduce(
      (prev, curr, index) =>
        prev +
        newDigits.findIndex((digit) => curr === digit) *
          Math.pow(10, 3 - index),
      0
    );

    return true;
  });

  return prev + outputValue;
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const entries = data.split("\n").filter(Boolean);
  const result = entries.reduce(reducer, 0);
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
