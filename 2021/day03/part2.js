const fs = require("fs");
const path = require("path");

const filterReport = (report, bitPos, strategy) => {
  if (report.length <= 1) return report[0];
  const counter = report.reduce(
    (prev, curr) => (prev += parseInt(curr.charAt(bitPos), 10)),
    0
  );
  const winningBit = +(counter >= report.length / 2);
  const match = strategy === "co2" ? +!winningBit : winningBit;
  const filteredReport = report.filter(
    (reportEntry) => parseInt(reportEntry.charAt(bitPos), 10) === match
  );
  return filterReport(filteredReport, bitPos + 1, strategy);
};

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const report = data.split("\n").filter(Boolean);
  const oxygenRating = parseInt(filterReport(report, 0, "oxygen"), 2);
  const co2Rating = parseInt(filterReport(report, 0, "co2"), 2);
  console.log("result:", oxygenRating * co2Rating);
} catch (error) {
  console.log(error);
}
