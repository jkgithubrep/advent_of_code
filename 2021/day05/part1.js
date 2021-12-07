const fs = require("fs");
const path = require("path");

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const vents = data
    .split("\n")
    .filter(Boolean)
    .map((coord) =>
      coord
        .split(" -> ")
        .map((coord) => coord.split(",").map((val) => parseInt(val, 10)))
        .reduce((prev, curr, currIndex) => {
          prev[!currIndex ? "start" : "end"] = {
            x: curr[0],
            y: curr[1],
          };
          return prev;
        }, {})
    )
    .filter(
      (vent) => vent.start.x === vent.end.x || vent.start.y === vent.end.y
    );
  console.log(vents);
} catch (error) {
  console.log(error);
}
