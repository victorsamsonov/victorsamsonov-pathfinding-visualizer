import React from "react";
import "./Main.css";
//Component that will display how each node looks like
const UI = () => {
  return (
    <div className="sample-wrapper">
      <div className="sample-header-row">
        <h4 className="start-header">Start Node</h4>
        <h4 className="end-header"> End Node</h4>
        <h4 className="wall-header"> Wall Node</h4>
      </div>
      <div className="sample-node-row">
        <div className="start-node-sample"></div>

        <div className="end-node-sample"></div>

        <div className="wall-node-sample"></div>
      </div>
    </div>
  );
};
export default UI;
