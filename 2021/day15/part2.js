const fs = require("fs");
const path = require("path");

const isInsideMap = (x, y, map) => {
  return x >= 0 && x < map[0].length && y >= 0 && y < map.length;
};

const getUnvisitedNeighbours = (x, y, map, visited) => {
  const offsets = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const neighbours = [];
  for (let [dx, dy] of offsets) {
    const [nx, ny] = [x + dx, y + dy];
    if (isInsideMap(nx, ny, map) && !visited.has(`${nx}-${ny}`)) {
      neighbours.push([nx, ny]);
    }
  }
  return neighbours;
};

const getNext = (nexts) => {
  const nextsOrdered = [...nexts.entries()].sort(
    ([, valA], [, valB]) => valA - valB
  );
  const [key] = nextsOrdered[0];
  nexts.delete(key);
  return key.split("-").map((val) => parseInt(val, 10));
};

const updateCosts = (x, y, unvisitedNeighbours, map, costs, nexts) => {
  const distStartToCurrent = costs.get(`${x}-${y}`);
  for (let [x, y] of unvisitedNeighbours) {
    const key = `${x}-${y}`;
    const distStartToNeighbour = distStartToCurrent + map[y][x];
    const currentDistStartToNeighbour = costs.get(key) || Infinity;
    if (distStartToNeighbour < currentDistStartToNeighbour) {
      costs.set(key, distStartToNeighbour);
    }
    nexts.set(key, costs.get(key));
  }
};

const minCost = (map) => {
  const costs = new Map();
  costs.set("0-0", 0);
  const visited = new Set();
  const nexts = new Map();
  nexts.set("0-0", 0);
  while (nexts.size) {
    const [x, y] = getNext(nexts);
    visited.add(`${x}-${y}`);
    const unvisitedNeighbours = getUnvisitedNeighbours(x, y, map, visited);
    updateCosts(x, y, unvisitedNeighbours, map, costs, nexts);
  }

  return costs.get(`${map[0].length - 1}-${map.length - 1}`);
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
  const result = minCost(biggerMap);
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
