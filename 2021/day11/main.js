const fs = require("fs");
const path = require("path");

const isInsideGrid = (x, y, grid) => {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
};

const displayGrid = (message, grid) => {
  console.log(message);
  const output = grid.map((row) => row.join("")).join("\n");
  console.log(`${output}\n`);
};

const increaseEnergyLevelByOne = (grid) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      grid[y][x] += 1;
    }
  }
};

const increaseEnergyLevelOfAdjacentByOne = (x, y, grid) => {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if ((i || j) && isInsideGrid(x + j, y + i, grid)) {
        grid[y + i][x + j] += 1;
      }
    }
  }
};

const isGreaterThan9 = (val) => val > 9;

const getNumberOfFlashes = (recorder) =>
  recorder.flatMap((row) => row.filter(Boolean)).length;

const hasRemainingFlashes = (grid, recorder) => {
  const possibleFlashes = grid.flatMap((row) => row.filter(isGreaterThan9));
  return getNumberOfFlashes(recorder) < possibleFlashes.length;
};

const spreadFlashes = (grid, flashes) => {
  const recorder = [...Array(grid.length)].map(() =>
    Array(grid[0].length).fill(0)
  );
  while (hasRemainingFlashes(grid, recorder)) {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] > 9 && !recorder[y][x]) {
          increaseEnergyLevelOfAdjacentByOne(x, y, grid);
          recorder[y][x] = 1;
        }
      }
    }
  }
  flashes.push(getNumberOfFlashes(recorder));
};

const resetEnergyLevel = (grid) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] > 9) grid[y][x] = 0;
    }
  }
};

const handleFlashes = (grid, flashes) => {
  spreadFlashes(grid, flashes);
  resetEnergyLevel(grid);
};

const updateGrid = (grid, step, flashes) => {
  increaseEnergyLevelByOne(grid);
  handleFlashes(grid, flashes);
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const grid = data
    .split("\n")
    .filter(Boolean)
    .map((row) => [...row].map((val) => parseInt(val, 10)));
  const steps = 300;
  const flashes = [];
  for (let i = 0; i < steps; i++) updateGrid(grid, i, flashes);
  const result = flashes.slice(0, 100).reduce((prev, curr) => prev + curr, 0);
  const nbOfOctopuses = grid.length * grid[0].length;
  const stepSynchro =
    flashes.findIndex((nbOfFlashes) => nbOfFlashes === nbOfOctopuses) + 1;
  console.log("result - part1:", result);
  console.log("result - part2:", stepSynchro);
} catch (error) {
  console.log(error);
}
