const fs = require("fs");
const path = require("path");

const displayMap = (map) => {
  const output = map
    .filter((row) => row.reduce((prev, curr) => prev + curr, 0))
    .map((row) =>
      row
        .slice(0, 50)
        .map((x) => (x ? "#" : "."))
        .join("")
    )
    .join("\n");
  console.log(output);
};

const fold = (map, axis, foldValue) => {
  const foldX = axis === "x";
  const minMain = foldValue + 1;
  const maxMain = foldX ? map[0].length : map.length;
  const minCross = 0;
  const maxCross = foldX ? map.length : map[0].length;
  for (let j = minCross; j < maxCross; j++) {
    for (let i = minMain; i < maxMain; i++) {
      const dotAtCoord = foldX ? map[j][i] === 1 : map[i][j] === 1;
      if (dotAtCoord) {
        const newX = foldX ? 2 * foldValue - i : j;
        const newY = foldX ? j : 2 * foldValue - i;
        if (newX >= 0 && newY >= 0) {
          map[newY][newX] = 1;
          map[foldX ? j : i][foldX ? i : j] = 0;
        }
      }
    }
  }
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const [dotsInput, foldsInput] = data.split("\n\n");
  const dots = dotsInput
    .split("\n")
    .filter(Boolean)
    .map((coords) => coords.split(","))
    .map((coords) => coords.map((coord) => parseInt(coord, 10)));
  const folds = foldsInput
    .split("\n")
    .filter(Boolean)
    .map((fold) => fold.slice(11).split("="))
    .map((fold) => [fold[0], parseInt(fold[1], 10)]);
  const [maxX, maxY] = dots.reduce(
    (prev, coords) => {
      const result = [...prev];
      if (coords[0] > prev[0]) result[0] = coords[0];
      if (coords[1] > prev[1]) result[1] = coords[1];
      return result;
    },
    [-Infinity, -Infinity]
  );
  const map = [...Array(maxY + 1)].map(() => Array(maxX + 1).fill(0));
  dots.forEach(([x, y]) => (map[y][x] = 1));
  folds.forEach((foldInstruction) => {
    [axis, foldValue] = foldInstruction;
    fold(map, axis, foldValue);
  });
  displayMap(map);
} catch (error) {
  console.log(error);
}
