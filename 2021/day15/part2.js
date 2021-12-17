const fs = require("fs");
const path = require("path");

const minCost = (map) => {
  const costs = [...new Array(map.length)].map(() =>
    new Array(map[0].length).fill(0)
  );

  for (let x = 1; x < map[0].length; x++) {
    costs[0][x] = costs[0][x - 1] + map[0][x];
  }

  for (let y = 1; y < map.length; y++) {
    costs[y][0] = costs[y - 1][0] + map[y][0];
  }

  for (y = 1; y < map.length; y++) {
    for (x = 1; x < map[0].length; x++) {
      costs[y][x] = Math.min(costs[y][x - 1], costs[y - 1][x]) + map[y][x];
    }
  }
  return costs[map.length - 1][map[0].length - 1];
};

const generateBiggerMap = (map) => {
  const biggerMap = [...new Array(map.length * 5)].map(() =>
    new Array(map[0].length * 5).fill(0)
  );
  for (let y = 0; y < biggerMap.length; y++) {
    for (let x = 0; x < biggerMap[0].length; x++) {
      const matchingVal = map[y % map.length][x % map[0].length];
      biggerMap[y][x] =
        (matchingVal +
          Math.floor(y / map.length) +
          Math.floor(x / map[0].length)) %
          9 || 9;
    }
  }
  return biggerMap;
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const map = data
    .split("\n")
    .filter(Boolean)
    .map((row) => [...row].map((val) => parseInt(val, 10)));
  const biggerMap = generateBiggerMap(map);
  const biggerMapStringify = biggerMap.map((row) => row.join("")).join("\n");
  const result = minCost(biggerMap);
  console.log(result);
} catch (error) {
  console.log(error);
}
