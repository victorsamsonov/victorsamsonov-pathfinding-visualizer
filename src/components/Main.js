import React, { useState, useEffect } from "react";
import Node from "./Node";
import "./Main.css";
import "./Node.css";
import Astar from "../algorithms/Astar";
import Dijkstra from "../algorithms/Dijkstra";

import UI from "./UI";

const rows = 20;
const cols = 50;
var NSR = 0;
var NSC = 0;
var NER = rows - 1;
var NEC = cols - 1;

const Main = () => {
  const [Board, setBoard] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState([]);
  //setState is not currently being used, but will be useful for future updates.
  const [startRowNode, setStartRowNode] = useState(NSR);
  const [startColumnNode, setStartColumnNode] = useState(NSC);
  const [endRowNode, setEndRowNode] = useState(NER);
  const [endColumnNode, setColumnNode] = useState(NEC);

  const [algorithm, setAlgorithm] = useState("A* Algorithm");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisualizing, setIsVisualizing] = useState(0);
  const [initialized, setInitialized] = useState(0);
  const [useAlgorithm, setUseAlgorithm] = useState();
  const [clickedWalls, setClickedWalls] = useState([]);

  const handleSwitchAlgorithm = () => {
    if (!isVisualizing) {
      clearVisualization();
      if (algorithm === "A* Algorithm") {
        console.log("Dijkstrasss");
        setAlgorithm("Dijkstra's Algorithm");
        setClickedWalls([]);
        createBoard(0, "Dijkstra's Algorithm", []);
      } else {
        console.log("not astar");
        createBoard(0, "A* Algorithm", []);
        setAlgorithm("A* Algorithm");
      }
    }
  };
  useEffect(() => {
    createBoard(0, "A* Algorithm", []);
    setInitialized(1);
  }, []);

  //Creates our board while making sure that random walls are generated if given the input and handles the current algorithm used while making sure that all the Nodes in the List are walls.
  const createBoard = (randomWallGeneration, algorithm, wallsList) => {
    if (!isVisualizing) {
      const Board = new Array(rows);

      for (let i = 0; i < rows; i++) {
        Board[i] = new Array(cols);
      }

      createSquare(Board, randomWallGeneration, wallsList);
      setBoard(Board);
      addNeighbours(Board);
      //addWalls(clickedWalls)
      const startNode = Board[startRowNode][startColumnNode];
      const endNode = Board[endRowNode][endColumnNode];

      if (algorithm === "A* Algorithm") {
        let object = Astar(startNode, endNode);
        startNode.wall = false;
        endNode.wall = false;
        setShortestPath(object.shortestPath);
        setVisitedNodes(object.visitedNodes);
      } else {
        let object = Dijkstra(Board, startNode, endNode);
        startNode.wall = false;
        endNode.wall = false;
        // console.log(object)

        setShortestPath(object.shortestPath);
        setVisitedNodes(object.visitedNodes);
      }
    }
  };

  //Initializes all of our squares
  const createSquare = (Board, randomWallGeneration, wallsList) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        Board[i][j] = new Square(i, j, randomWallGeneration, wallsList);

        /*
        Board[i][j].previous = previous
        console.log(previous)
        console.log()
        previous = Board[i][j]
        */
      }
    }
  };

  //Add Neighbours
  const addNeighbours = (Board) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        Board[i][j].addneighbours(Board);
      }
    }
  };

  //SQUARE CONSTRUCTOR
  function Square(i, j, randomWallGeneration, wallsList) {
    function removeAllElements(array, elem) {
      var index = array.indexOf(elem);
      while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
      }
      return array;
    }
    this.row = i;
    this.col = j;
    this.isStart = this.row === startRowNode && this.col === startColumnNode;
    this.isEnd = this.row === endRowNode && this.col === endColumnNode;
    if (algorithm === "A* Algorithm") {
      this.f = 0;
      this.g = 0;
      this.h = 0;
    }
    this.isVisited = false;
    this.distance = Infinity;
    this.className = "node";
    this.executed = false;
    if (randomWallGeneration) {
      this.wall = false;
      setClickedWalls([
        ...removeAllElements(clickedWalls, `${this.row}-${this.col}`),
      ]);
    }

    if (
      Math.random(1) < 0.2 &&
      !this.isStart &&
      !this.isEnd &&
      randomWallGeneration &&
      !this.executed
    ) {
      this.wall = true;
      let newClickedWalls = clickedWalls.push(`${this.row}-${this.col}`);
      setClickedWalls([...clickedWalls, newClickedWalls]);
      this.executed = true;
    }
    if (wallsList.includes(`${this.row}-${this.col}`)) {
      this.wall = true;
    }
    this.neighbours = [];
    this.previous = undefined;
    //Adds nodes that are touching each other
    this.addneighbours = function (Board) {
      let i = this.row;
      let j = this.col;
      if (i > 0) this.neighbours.push(Board[i - 1][j]);
      if (i < rows - 1) this.neighbours.push(Board[i + 1][j]);
      if (j > 0) this.neighbours.push(Board[i][j - 1]);
      if (j < cols - 1) this.neighbours.push(Board[i][j + 1]);
    };
  }

  //Maps each of our Nodes into a new Board, which will allow it to be displayed in the return function
  const nodesBoard = (
    <div className={"board"}>
      {Board.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className={"container"}>
            {row.map((col, colIndex) => {
              const { isStart, isEnd, wall, className } = col;
              return (
                <Node
                  key={colIndex}
                  isStart={isStart}
                  isEnd={isEnd}
                  row={rowIndex}
                  col={colIndex}
                  wall={wall}
                  className={className}
                  id={`${rowIndex}-${colIndex}`}
                  onClick={(row, col) => getNewBoardWithWallToggled(row, col)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );

  //clears the current path visualization
  const clearVisualization = () => {
    if (!isVisualizing) {
      for (let i = 0; i <= visitedNodes.length - 1; i++) {
        const node = visitedNodes[i];
        if (
          document.getElementById(`${node.row}-${node.col}`).className ===
            "node node-visited" ||
          document.getElementById(`${node.row}-${node.col}`).className ===
            "node node-shortest-path"
        ) {
          document.getElementById(`${node.row}-${node.col}`).className = "node";
        }
        if (node.row === startRowNode && node.col === startColumnNode) {
          document.getElementById(`${node.row}-${node.col}`).className =
            "node node-start";
        }
        if (node.row === endRowNode && node.col === endColumnNode) {
          document.getElementById(`${node.row}-${node.col}`).className =
            "node node-end";
        }
      }
    }
  };

  //handles adding and removing walls, executed when a Node component is clicked
  const getNewBoardWithWallToggled = (row, col) => {
    function removeAllElements(array, elem) {
      var index = array.indexOf(elem);
      while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
      }
      return array;
    }
    if (!isVisualizing)
      if (!Board[row][col].isStart && !Board[row][col].isEnd) {
        const newBoard = Board.slice();
        const node = newBoard[row][col];

        const newNode = {
          ...node,
          wall: !node.wall,
          neighbours: node.addneighbours,
        };

        let newClickedWalls = clickedWalls.push(`${row}-${col}`);
        setClickedWalls([...clickedWalls, newClickedWalls]);
        const startNode = Board[startRowNode][startColumnNode];
        const endNode = Board[endRowNode][endColumnNode];
        //console.log("this is the current algorithm:" + " " + algorithm);
        newBoard[row][col].wall = newNode.wall;
        setBoard(newBoard);
        // addNeighbours(Board);
        if (algorithm === "A* Algorithm") {
          setShortestPath(Astar(startNode, endNode).shortestPath);
          setVisitedNodes(Astar(startNode, endNode).visitedNodes);
        }

        if (algorithm === "Dijkstra's Algorithm") {
          if (newBoard[row][col].wall === false) {
            let current = clickedWalls;
            removeAllElements(current, `${row}-${col}`);

            setClickedWalls([
              ...removeAllElements(clickedWalls, `${row}-${col}`),
            ]);
          }
          let object = Dijkstra(Board, startNode, endNode);
          startNode.wall = false;
          endNode.wall = false;
          setShortestPath(object.shortestPath);
          setVisitedNodes(object.visitedNodes);
          createBoard(0, algorithm, clickedWalls);
        }
      }
  };

  //shortest path animation for all algorithms
  const animateShortestPath = (shortestPathNodes) => {
    for (let i = 0; i < shortestPathNodes.length; i++) {
      setTimeout(() => {
        const node = shortestPathNodes[i];
        //console.log(node);
        document.getElementById(`${node.row}-${node.col}`).className =
          "node node-shortest-path";
        if (i === shortestPathNodes.length - 1) {
          setIsVisualizing(0);
          console.log("set");
        }
      }, 40 * i);
    }
  };

  //visualizes our path, before visualizing the shortest path it animates each node visited before the shortest path was determined
  const visualizePath = () => {
    shortestPath.length > 0 ? setIsVisualizing(1) : setIsVisualizing(0);
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          animateShortestPath(shortestPath);
        }, 25 * i);
      } else {
        setTimeout(() => {
          const node = visitedNodes[i];
          if (
            document.getElementById(`${node.row}-${node.col}`).className !==
              "node node-start" &&
            document.getElementById(`${node.row}-${node.col}`).className !==
              "node nodeEnd"
          ) {
            document.getElementById(`${node.row}-${node.col}`).className =
              "node node-visited";
          }
        }, 25 * i);
      }
    }
  };

  return (
    <>
      <div className="menu-bar">
        <UI />
        <button
          className="clear-visualization-button"
          onClick={clearVisualization}
        >
          Clear Visualization
        </button>
        <button onClick={visualizePath} className="visualize-button">
          Visualize Path
        </button>
        <button
          className="switch-algorithm-button"
          onClick={() => handleSwitchAlgorithm()}
        >
          Switch Algorithm
        </button>
        <button
          onClick={() => {
            setClickedWalls([]);
            clearVisualization();
            createBoard(0, algorithm, []);
          }}
          className="random-wall-generation-button"
        >
          Clear Walls
        </button>
        <button
          onClick={() => {
            setClickedWalls([]);
            createBoard(1, algorithm, []);
            clearVisualization();
          }}
          className="random-wall-generation-button"
        >
          Random Wall Generation
        </button>
      </div>
      <h2 className="algorithm"> Current: {algorithm}</h2>
      <div className="wrapper">{nodesBoard}</div>
    </>
  );
};
export default Main;
