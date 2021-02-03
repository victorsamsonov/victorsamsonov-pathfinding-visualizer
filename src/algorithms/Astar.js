//Initializes the Astar algorithm
function Astar(startNode, endNode) {
  let notVisited = [];
  let visited = [];
  let shortestPath = [];
  let visitedNodes = [];
  notVisited.push(startNode);
  console.log(notVisited);
  while (notVisited.length > 0) {
    let minIndex = 0;
    for (let i = 0; i < notVisited.length; i++) {
      if (notVisited[i].f < notVisited[minIndex].f) {
        minIndex = i;
      }
    }
    let currentNode = notVisited[minIndex];
    visitedNodes.push(currentNode);
    if (currentNode === endNode) {
      let pointer = endNode;
      shortestPath.push(pointer);
      while (pointer.previous) {
        shortestPath.push(pointer.previous);
        pointer = pointer.previous;
      }
      return { shortestPath, visitedNodes };
    }
    notVisited = notVisited.filter((node) => node !== currentNode);
    visited.push(currentNode);
    let neighbours = currentNode.neighbours;
    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];
      if (!visited.includes(neighbour) && !neighbour.wall) {
        let tempG = currentNode.g + 1;
        let newShortestPath = false;
        if (notVisited.includes(neighbour)) {
          if (tempG < neighbour.g) {
            neighbour.g = tempG;
            newShortestPath = true;
          }
        } else {
          neighbour.g = tempG;
          newShortestPath = true;
          notVisited.push(neighbour);
        }
        if (newShortestPath) {
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.h = heruistic(neighbour, endNode);
          neighbour.previous = currentNode;
        }
      }
    }
  }
  return { shortestPath, visitedNodes, error: "ERROR NO PATH" };
}

//Used to optimize dijkstra
function heruistic(a, b) {
  let distance = Math.abs(a.x - a.y) + Math.abs(b.x - b.y);

  return distance;
}

export default Astar;
