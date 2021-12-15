const fs = require("fs");
const path = require("path");

let lowest = Infinity;

const lowestPath = (x, y, map, sum) => {
  const risk = map[y][x];
  if (sum + risk >= lowest) {
    return;
  }
  if (x === map[0].length - 1 && y === map.length - 1) {
    lowest = sum + risk;
    console.log("New lowest:", lowest);
    debugger;
    return;
  }
  if (x + 1 < map[0].length) {
    if (y + 1 < map.length) {
      if (map[y][x + 1] < map[y + 1][x]) {
        lowestPath(x + 1, y, map, sum + risk);
        lowestPath(x, y + 1, map, sum + risk);
      } else {
        lowestPath(x, y + 1, map, sum + risk);
        lowestPath(x + 1, y, map, sum + risk);
      }
    } else {
      lowestPath(x + 1, y, map, sum + risk);
    }
  } else if (y + 1 < map.length) {
    lowestPath(x, y + 1, map, sum + risk);
  }
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const map = data
    .split("\n")
    .filter(Boolean)
    .map((row) => [...row].map((val) => parseInt(val, 10)));
  lowestPath(0, 0, map, -map[0][0]);
  console.log(lowest);
} catch (error) {
  console.log(error);
}
