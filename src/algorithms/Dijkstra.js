function Dijkstra(Board, startNode, endNode) {
  const visitedNodes = [];
  const shortestPath = [];
  startNode.distance = 0;
  let getBoard = Board.slice();
  let unvisitedNodes = getAllNodes(getBoard);
  while (!!unvisitedNodes.length) {
    sortDistance(unvisitedNodes);
    var closestNode = unvisitedNodes.shift();
    if (closestNode.wall !== true) {
      if (closestNode.distance === Infinity) {
        let sPath = getShortestPath(endNode);
        for (let i = 0; i < sPath.length; i++) {
          shortestPath.push(sPath[i]);
        }
        return { visitedNodes, shortestPath };
      }
      closestNode.isVisited = true;

      if (!closestNode.wall) {
        visitedNodes.push(closestNode);
      }
      visitedNodes.filter((node) => !node);
      if (closestNode === endNode) {
        let sPath = getShortestPath(endNode);
        for (let i = 0; i < sPath.length; i++) {
          if (sPath.wall === true) {
            break;
          }
          shortestPath.push(sPath[i]);
        }
        let error = "";
        if (shortestPath.length === 0) {
          error = "ERROR NO PATH";
        }
        visitedNodes.filter((n) => !n.wall);
        return { visitedNodes, shortestPath, error };
      }

      const neighboursList = [];

      for (let i = 0; i < closestNode.neighbours.length; i++) {
        neighboursList.push(closestNode.neighbours[i]);
      }
      const unvisitedNeighbours = neighboursList.filter(
        (neighbour) => !neighbour.isVisited
      );
      for (let i = 0; i < unvisitedNeighbours.length; i++) {
        unvisitedNeighbours[i].distance = closestNode.distance + 1;

        unvisitedNeighbours[i].previous = closestNode;
      }
    }
  }
}

function sortDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(Board) {
  let nodes = [];
  for (let i = 0; i < Board.length; i++) {
    for (let j = 0; j < Board[i].length; j++) {
      nodes.push(Board[i][j]);
    }
  }

  return nodes;
}

function getShortestPath(endNode) {
  const shortestPath = [];
  let pathFound = false;
  let pointer = endNode;
  while (true) {
    shortestPath.push(pointer);
    pointer = pointer.previous;
    if (pointer === undefined) {
      break;
    }
  }
  for (let i = 0; i < shortestPath.length; i++) {
    if (shortestPath[i].isStart === true) {
      pathFound = true;
    }
  }

  if (pathFound === true) {
    return shortestPath;
  } else {
    return [];
  }
}

export default Dijkstra;
