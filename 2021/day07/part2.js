const fs = require("fs");
const path = require("path");

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const crabsPositions = data
    .split("\n")
    .filter(Boolean)[0]
    .split(",")
    .map((val) => parseInt(val, 10));
  const crabsPositionsOrdered = crabsPositions.sort((a, b) => a - b);
  const maxPosition = crabsPositionsOrdered[crabsPositionsOrdered.length - 1];
  const fuelCosts = [];
  for (let i = 0; i < maxPosition; i++) {
    let fuelCost = 0;
    for (let j = 0; j < crabsPositionsOrdered.length; j++) {
      const upperBound = Math.abs(i - crabsPositionsOrdered[j]);
      fuelCost += (upperBound * (upperBound + 1)) / 2;
    }
    fuelCosts.push(fuelCost);
  }
  const minFuelCost = fuelCosts.reduce(
    (prev, curr) => (curr < prev ? curr : prev),
    Infinity
  );
  console.log("result:", minFuelCost);
} catch (error) {
  console.log(error);
}
