import React from "react";
import "./Node.css";

//Initializes each node
const Node = ({ isStart, isEnd, row, col, wall, onClick }) => {
  const classes = isStart
    ? "node-start"
    : wall
    ? "node-wall"
    : isEnd
    ? "node-end"
    : "";

  return (
    <button
      onClick={() => onClick(row, col)}
      className={`node ${classes}`}
      id={`${row}-${col}`}
    ></button>
  );
};

export default Node;
