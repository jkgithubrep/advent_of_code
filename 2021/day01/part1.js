const fs = require("fs");
const path = require("path");

const reducer = (prev, _, currIndex, array) => {
  if (currIndex && array[currIndex] > array[currIndex - 1]) return prev + 1;
  return prev;
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const measurements = data
    .split("\n")
    .filter(Boolean)
    .map((val) => parseInt(val, 10));
  const result = measurements.reduce(reducer, 0);
  console.log(`${result} / ${measurements.length}`);
} catch (error) {
  console.log(error);
}
