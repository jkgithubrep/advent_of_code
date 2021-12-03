const fs = require("fs");
const path = require("path");

const pos = {
  horizontal: 0,
  depth: 0,
};

const forward = ((pos) => (val) => (pos.horizontal += val))(pos);
const down = ((pos) => (val) => (pos.depth += val))(pos);
const up = ((pos) => (val) => (pos.depth -= val))(pos);

const ops = {
  forward: forward,
  up: up,
  down: down,
};

const updatePos = ([direction, value]) => ops[direction](parseInt(value, 10));

const computeInstructions = (instructions) => instructions.forEach(updatePos);

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const instructions = data
    .split("\n")
    .filter(Boolean)
    .map((val) => val.split(" "));
  computeInstructions(instructions);
  console.log(pos);
  console.log("result:", pos.horizontal * pos.depth);
} catch (error) {
  console.log(error);
}
