const fs = require("fs");
const path = require("path");

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const lavaTubes = data
    .split("\n")
    .filter(Boolean)
    .map((line) => [...line].map((val) => parseInt(val, 10)));
  const result = lavaTubes.reduce(
    (prev, currRow, y, rows) =>
      prev +
      currRow.reduce(
        (prev, point, x, row) =>
          prev +
          ([
            x ? row[x - 1] : Infinity,
            x < row.length - 1 ? row[x + 1] : Infinity,
            y ? rows[y - 1][x] : Infinity,
            y < rows.length - 1 ? rows[y + 1][x] : Infinity,
          ].every((val) => val > point)
            ? point + 1
            : 0),
        0
      ),
    0
  );
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
