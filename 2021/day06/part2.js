const fs = require("fs");
const path = require("path");

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const initialState = data
    .split("\n")
    .filter(Boolean)[0]
    .split(",")
    .map((val) => parseInt(val, 10));
  const days = 256;
  const simulator = initialState.reduce((prev, curr) => {
    prev[curr]++;
    return prev;
  }, new Array(9).fill(0));
  for (let i = 0; i < days; i++) {
    state = [...simulator];
    for (let j = state.length - 1; j >= 0; j--) {
      if (!j) {
        simulator[8] = state[j];
        simulator[6] += state[j];
      } else {
        simulator[j - 1] = state[j];
      }
    }
  }
  const result = simulator.reduce((prev, curr) => prev + curr, 0);
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
