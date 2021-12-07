const fs = require("fs");
const path = require("path");

try {
  const data = fs.readFileSync(path.join(__dirname, "input-test.txt"), "utf8");
  const vents = data
    .split("\n")
    .filter(Boolean)
    .map((coord) =>
      coord
        .split(" -> ")
        .map((coord) => coord.split(",").map((val) => parseInt(val, 10)))
    );
  const allCoords = vents.flat(2);
  const xCoords = allCoords.filter((_, index) => !(index % 2));
  const yCoords = allCoords.filter((_, index) => index % 2);
  const xCoordsOrdered = xCoords.sort((a, b) => a - b);
  const yCoordsOrdered = yCoords.sort((a, b) => a - b);
  const [maxX, maxY] = [
    xCoordsOrdered[xCoordsOrdered.length - 1],
    yCoordsOrdered[yCoordsOrdered.length - 1],
  ];
  const diagram = [...Array(maxY + 1)].map((_) => Array(maxX + 1).fill(0));
  vents.forEach((vent) => {
    const isDiag = vent[0][0] !== vent[1][0] && vent[0][1] !== vent[1][1];
    if (isDiag) {
      const [[x1, y1], [x2, y2]] = vent.sort((a, b) => a[0] - b[0]);
      for (let i = 0; x1 + i <= x2; i++) {
        const y = y1 < y2 ? y1 + i : y1 - i;
        diagram[y][x1 + i] += 1;
      }
    } else {
      const fixedCoordIndex = vent[0][0] === vent[1][0] ? 0 : 1;
      const [min, max] = vent
        .flat(1)
        .filter((_, index) => index % 2 !== fixedCoordIndex)
        .sort((a, b) => a - b);
      for (let i = min; i <= max; i++) {
        if (fixedCoordIndex) {
          diagram[vent[0][fixedCoordIndex]][i] += 1;
        } else {
          diagram[i][vent[0][fixedCoordIndex]] += 1;
        }
      }
    }
  });
  const nbDangerousPoints = diagram.flat(2).filter((val) => val > 1).length;
  console.log("result:", nbDangerousPoints);
} catch (error) {
  console.log(error);
}
