const fs = require("fs");
const path = require("path");

class Graph {
  constructor() {
    this.adjList = new Map();
  }

  addVertex(v) {
    if (!this.adjList.has(v)) this.adjList.set(v, []);
  }

  addEdge(v, w) {
    this.adjList.get(v).push(w);
    this.adjList.get(w).push(v);
  }

  print() {
    var keys = this.adjList.keys();
    for (var i of keys) {
      var connections = this.adjList.get(i).join(" ");
      console.log(i + " -> " + connections);
    }
  }

  findAllPaths() {
    const paths = [];
    this.bfs("start", paths);
    return paths;
  }

  #findLowerDuplicates(array) {
    return array.filter(
      (item, index) =>
        !["start", "end"].includes(item) &&
        array.indexOf(item) !== index &&
        item === item.toLowerCase()
    );
  }

  bfs(start, paths = []) {
    const result = [];
    const queue = [[start]];
    let currVertex;
    while (queue.length) {
      currVertex = queue.shift();
      const lastVertex = currVertex[currVertex.length - 1];
      if (lastVertex === "end") {
        paths.push(currVertex);
        continue;
      }
      this.adjList.get(lastVertex).forEach((neighbor) => {
        const isLower = neighbor.charAt(0) !== neighbor.charAt(0).toUpperCase();
        const isStart = neighbor === "start";
        const isEnd = neighbor === "end";
        const hasLowerBeenVisited = currVertex.includes(neighbor);
        const hasAnyLowerBeenVisitedTwice =
          this.#findLowerDuplicates(currVertex)?.length === 1;
        const isForbidden =
          isStart ||
          (!isEnd &&
            isLower &&
            hasLowerBeenVisited &&
            hasAnyLowerBeenVisitedTwice);
        if (!isForbidden) {
          queue.push([...currVertex, neighbor]);
        }
      });
    }
    return result;
  }
}

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const connections = data
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split("-"));
  const graph = new Graph();
  connections.forEach((connection) => {
    connection.forEach((vertex) => graph.addVertex(vertex));
    graph.addEdge(connection[0], connection[1]);
  });
  const paths = graph.findAllPaths();
  console.log("result:", paths.length);
} catch (error) {
  console.log(error);
}
