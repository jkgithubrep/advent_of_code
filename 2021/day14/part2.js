const fs = require("fs");
const path = require("path");

class Polymer {
  constructor(template, rules) {
    this.template = template;
    this.rules = rules;
    this.lastPair = "";
    this.pairs = new Map();
  }

  initialize() {
    for (let i = 0; i < this.template.length - 1; i++) {
      const pair = this.template.slice(i, i + 2);
      if (this.pairs.has(pair)) {
        this.pairs.set(pair, this.pairs.get(pair) + 1);
      } else {
        this.pairs.set(pair, 1);
      }
      if (i === this.template.length - 2) {
        this.lastPair = pair;
      }
    }
  }

  iterate(steps) {
    for (let i = 0; i < steps; i++) {
      let lastPairSet = false;
      const pairsToIterate = new Map(this.pairs);
      for (let pair of pairsToIterate.keys()) {
        const nbOfPairs = pairsToIterate.get(pair);
        const letterToInsert = this.rules.get(pair);
        const left = `${pair.charAt(0)}${letterToInsert}`;
        const right = `${letterToInsert}${pair.charAt(1)}`;
        const newPairs = [left, right];
        if (pair === this.lastPair && !lastPairSet) {
          this.lastPair = right;
          lastPairSet = true;
        }
        for (let newP of newPairs) {
          if (this.pairs.has(newP)) {
            this.pairs.set(newP, this.pairs.get(newP) + nbOfPairs);
          } else {
            this.pairs.set(newP, nbOfPairs);
          }
        }
        this.pairs.set(pair, this.pairs.get(pair) - nbOfPairs);
      }
    }
  }

  counter() {
    const counter = new Map();
    for (let pair of this.pairs.keys()) {
      const firstLetter = pair.charAt(0);
      const nbOfOccurences = this.pairs.get(pair);
      if (counter.has(firstLetter)) {
        counter.set(firstLetter, counter.get(firstLetter) + nbOfOccurences);
      } else {
        counter.set(firstLetter, nbOfOccurences);
      }
    }
    const charToAdd = this.lastPair.charAt(1);
    counter.set(charToAdd, counter.get(charToAdd) + 1);
    return counter;
  }

  result(steps) {
    this.initialize();
    this.iterate(steps);
    const counter = this.counter();
    const valuesOrdered = [...counter.values()].sort((a, b) => a - b);
    return valuesOrdered[valuesOrdered.length - 1] - valuesOrdered[0];
  }
}

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
  const polymer = new Polymer(template, rules);
  const result = polymer.result(40);
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
