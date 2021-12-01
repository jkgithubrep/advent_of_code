const fs = require("fs");
const path = require("path");

const memoizer = (fun) => {
  let cache = {};
  return (n) => {
    if (cache[n] !== undefined) {
      return cache[n];
    } else {
      let result = fun(n);
      cache[n] = result;
      return result;
    }
  };
};

const sum3MeasurementsFromArray = (array) => (index) => {
  return array.slice(index, index + 3).reduce((prev, curr) => prev + curr, 0);
};

const hasIncreased = (index, fun) => fun(index) - fun(index - 1) > 0;

const reducerGen = (fun) => (prev, _, currIndex, array) => {
  if (!currIndex || currIndex + 2 > array.length - 1) return prev;
  return hasIncreased(currIndex, fun) ? prev + 1 : prev;
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const measurements = data
    .split("\n")
    .filter(Boolean)
    .map((val) => parseInt(val, 10));
  const sum3Measurements = sum3MeasurementsFromArray(measurements);
  const sum3MeasurementsMemoized = memoizer(sum3Measurements);
  const reducer = reducerGen(sum3MeasurementsMemoized);
  const result = measurements.reduce(reducer, 0);
  console.log(result);
} catch (error) {
  console.log(error);
}
