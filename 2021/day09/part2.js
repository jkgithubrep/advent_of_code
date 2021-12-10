const fs = require("fs");
const path = require("path");

const findBasinSize = (x, y, map, mapVisited) => {
  if (x < 0 || x >= map[0].length) return 0;
  if (y < 0 || y >= map.length) return 0;
  if (map[y][x] === 9) return 0;
  if (mapVisited[y][x]) return 0;
  mapVisited[y][x] = 1;
  return (
    1 +
    findBasinSize(x - 1, y, map, mapVisited) +
    findBasinSize(x + 1, y, map, mapVisited) +
    findBasinSize(x, y - 1, map, mapVisited) +
    findBasinSize(x, y + 1, map, mapVisited)
  );
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const lavaTubes = data
    .split("\n")
    .filter(Boolean)
    .map((line) => [...line].map((val) => parseInt(val, 10)));
  const basins = lavaTubes.reduce(
    (prev, currRow, y, rows) =>
      prev.concat(
        currRow.reduce(
          (prev, point, x, row) =>
            [
              x ? row[x - 1] : Infinity,
              x < row.length - 1 ? row[x + 1] : Infinity,
              y ? rows[y - 1][x] : Infinity,
              y < rows.length - 1 ? rows[y + 1][x] : Infinity,
            ].every((val) => val > point)
              ? [
                  ...prev,
                  findBasinSize(
                    x,
                    y,
                    lavaTubes,
                    [...Array(lavaTubes.length)].map(() =>
                      Array(lavaTubes[0].length).fill(0)
                    )
                  ),
                ]
              : prev,
          []
        )
      ),
    []
  );
  const result = basins
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((prev, curr) => prev * curr);
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
