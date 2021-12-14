const fs = require("fs");
const path = require("path");

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const [template, rulesInput] = data.split("\n\n");
  const rules = rulesInput
    .split("\n")
    .filter(Boolean)
    .reduce((prev, rule) => {
      const [key, value] = rule.split(" -> ");
      prev.set(key, value);
      return prev;
    }, new Map());
  const nbOfSteps = 10;
  let templateUpdated = template;
  for (let j = 0; j < nbOfSteps; j++) {
    const pairsToInsert = [];
    for (let i = 0; i < templateUpdated.length - 1; i++) {
      pairsToInsert.push(templateUpdated.slice(i, i + 2));
    }
    const newTemplate = pairsToInsert.reduce((prev, pair, index, pairs) => {
      const afterInsert = `${pair.charAt(0)}${rules.get(pair)}${
        index === pairs.length - 1 ? pair.charAt(1) : ""
      }`;
      return prev.concat(afterInsert);
    }, "");
    templateUpdated = newTemplate;
  }
  const uniq = [...new Set(templateUpdated)];
  const counter = new Map();
  for (let letter of uniq) {
    counter.set(
      letter,
      [...templateUpdated].filter((curr) => curr === letter).length
    );
  }
  const valuesOrdered = [...counter.values()].sort((a, b) => a - b);
  const result = valuesOrdered[valuesOrdered.length - 1] - valuesOrdered[0];
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
