const fs = require("fs");
const path = require("path");

const reportReducer = (prev, curr) =>
  [...curr].map((bit, index) => (prev[index] += parseInt(bit, 10)));

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const report = data.split("\n").filter(Boolean);
  const reportLength = report.length;
  const initialCounter = new Array(report[0].length).fill(0);
  const finalCounter = report.reduce(reportReducer, initialCounter);
  const gammaRateBin = finalCounter
    .map((count) => (count > reportLength / 2 ? "1" : "0"))
    .join("");
  const gammaRate = parseInt(gammaRateBin, 2);
  const mask = parseInt(
    new Array([...gammaRate.toString(2)].length).fill(1).join(""),
    2
  );
  const epsilonRate = gammaRate ^ mask;
  console.log("result:", gammaRate * epsilonRate);
} catch (error) {
  console.log(error);
}
