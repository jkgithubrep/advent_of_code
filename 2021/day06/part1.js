const fs = require("fs");
const path = require("path");

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const initialState = data
    .split("\n")
    .filter(Boolean)[0]
    .split(",")
    .map((val) => parseInt(val, 10));
  const lanternfishes = [...initialState];
  const days = 80;
  for (let i = 0; i < days; i++) {
    const max = lanternfishes.length;
    for (let j = 0; j < max; j++) {
      if (lanternfishes[j]) {
        lanternfishes[j] -= 1;
      } else {
        lanternfishes[j] = 6;
        lanternfishes.push(8);
      }
    }
  }
  console.log("result:", lanternfishes.length);
} catch (error) {
  console.log(error);
}
