const fs = require("fs");
const path = require("path");

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const outputDigits = data
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(" | ")[1].split(" "));
  const result = outputDigits.reduce(
    (prev, curr) =>
      prev +
      curr.reduce((prev, curr) => prev + [2, 3, 4, 7].includes(curr.length), 0),
    0
  );
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
